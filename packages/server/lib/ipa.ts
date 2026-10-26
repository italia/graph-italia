import path from "node:path";

/**
 * Enti dell'Indice dei domicili digitali della PA (IndicePA), per il campo
 * «Pubblica Amministrazione di appartenenza» della registrazione.
 *
 * L'elenco (~24.000 enti) sta in un file JSON nel repository,
 * data/ipa-enti.json, letto dal disco a ogni uso: il server non contatta mai
 * IndicePA. Il file si rigenera con `bun run ipa:update`
 * (scripts/update-ipa-enti.ts), lanciato ogni settimana da una GitHub Action
 * che apre una PR quando gli enti cambiano.
 *
 * L'ente scelto è salvato in `User.pa` come «<codice IPA>#<denominazione>»
 * (vedi formatPa/parsePa): i codici IPA sono alfanumerici con «_», e «#» non
 * compare in nessuna denominazione.
 */

export const DATASTORE_URL = "https://indicepa.gov.it/ipa-dati/api/3/action/datastore_search";
// Dataset «Enti» (https://indicepa.gov.it/ipa-dati/dataset/enti)
const ENTI_RESOURCE_ID = "d09adf99-dc10-4349-8c53-27b1e5aa97b6";
const PAGE_SIZE = 32000; // limite massimo di CKAN per richiesta
const FETCH_TIMEOUT_MS = 60_000;
// Sotto questa soglia la risposta di IndicePA è considerata anomala.
export const MIN_PLAUSIBLE_ENTI = 1000;

export const PA_SEPARATOR = "#";
const IPA_CODE_RE = /^[A-Za-z0-9_]{1,32}$/;

export type IpaEnte = { code: string; name: string; type: string };

/** Contenuto di data/ipa-enti.json, servito così com'è da GET /ipa/enti. */
export type IpaFile = {
	updatedAt: string;
	types: string[];
	enti: [code: string, name: string, type: number][];
};

/** File degli enti mancante o illeggibile. */
export class IpaUnavailableError extends Error {}

/** Percorso del file; IPA_ENTI_FILE lo sposta (test, deploy con volume). */
export function ipaEntiFile(): string {
	return process.env.IPA_ENTI_FILE || path.join(import.meta.dir, "../data/ipa-enti.json");
}

export async function readIpaFile(): Promise<IpaFile> {
	try {
		return (await Bun.file(ipaEntiFile()).json()) as IpaFile;
	} catch (err) {
		throw new IpaUnavailableError(`IndicePA list not readable: ${err instanceof Error ? err.message : err}`);
	}
}

export async function findIpaEnte(code: string): Promise<IpaEnte | null> {
	const file = await readIpaFile();
	const row = file.enti.find(([c]) => c === code);
	return row ? { code: row[0], name: row[1], type: file.types[row[2]] ?? "" } : null;
}

export function formatPa(ente: Pick<IpaEnte, "code" | "name">): string {
	return `${ente.code}${PA_SEPARATOR}${ente.name}`;
}

/** Scompone `User.pa`; i valori salvati prima di IndicePA non hanno codice. */
export function parsePa(value: string): { code: string | null; name: string } {
	const i = value.indexOf(PA_SEPARATOR);
	const code = i > 0 ? value.slice(0, i) : "";
	return IPA_CODE_RE.test(code) ? { code, name: value.slice(i + 1) } : { code: null, name: value };
}

/**
 * Verifica l'ente scelto in registrazione e restituisce il valore da salvare,
 * con la denominazione ufficiale (quella inviata dal client è ignorata).
 * `null` se il codice manca o non è nell'elenco.
 */
export async function resolvePa(value: string): Promise<string | null> {
	const { code } = parsePa(value.trim());
	if (!code) return null;
	const ente = await findIpaEnte(code);
	return ente ? formatPa(ente) : null;
}

// ─── Aggiornamento del file (scripts/update-ipa-enti.ts) ────────────────────

type DatastoreRecord = { Codice_IPA: string; Denominazione_ente: string; Tipologia: string };

/** Scarica tutti gli enti dal datastore CKAN degli open data IndicePA. */
export async function fetchIpaEnti(): Promise<IpaEnte[]> {
	const enti: IpaEnte[] = [];
	for (let offset = 0; ; offset += PAGE_SIZE) {
		const url = new URL(DATASTORE_URL);
		url.search = new URLSearchParams({
			resource_id: ENTI_RESOURCE_ID,
			fields: "Codice_IPA,Denominazione_ente,Tipologia",
			sort: "Denominazione_ente",
			limit: String(PAGE_SIZE),
			offset: String(offset),
		}).toString();
		const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
		if (!res.ok) throw new Error(`IndicePA responded ${res.status}`);
		const body = (await res.json()) as {
			success?: boolean;
			result?: { records: DatastoreRecord[]; total?: number };
		};
		if (!body.success || !body.result) throw new Error("IndicePA: unexpected response");
		for (const r of body.result.records) {
			const code = r.Codice_IPA?.trim();
			const name = r.Denominazione_ente?.trim();
			if (code && name && IPA_CODE_RE.test(code)) enti.push({ code, name, type: r.Tipologia?.trim() ?? "" });
		}
		const total = body.result.total ?? 0;
		if (body.result.records.length < PAGE_SIZE || offset + PAGE_SIZE >= total) break;
	}
	return enti;
}

/** Compatta gli enti nel formato del file (tipologie come indici in `types`). */
export function toIpaFile(enti: IpaEnte[], updatedAt: string): IpaFile {
	const types = [...new Set(enti.map((e) => e.type))].sort();
	const typeIndex = new Map(types.map((t, i) => [t, i]));
	const sorted = [...enti].sort((a, b) => a.name.localeCompare(b.name, "it") || a.code.localeCompare(b.code));
	return { updatedAt, types, enti: sorted.map((e) => [e.code, e.name, typeIndex.get(e.type)!]) };
}

/** JSON con un ente per riga, perché i diff delle PR di aggiornamento siano leggibili. */
export function serializeIpaFile(file: IpaFile): string {
	const rows = file.enti.map((row) => JSON.stringify(row)).join(",\n");
	return `{"updatedAt":${JSON.stringify(file.updatedAt)},"types":${JSON.stringify(file.types)},"enti":[\n${rows}\n]}\n`;
}
