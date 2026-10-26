/**
 * Rigenera data/ipa-enti.json dagli open data IndicePA (vedi lib/ipa.ts).
 *
 *   bun run ipa:update
 *
 * Lascia il file com'è se gli enti non sono cambiati (updatedAt compreso), così
 * la GitHub Action settimanale apre una PR solo quando c'è davvero qualcosa.
 * Esce con codice 1 se IndicePA non risponde o restituisce un elenco anomalo.
 */
import path from "node:path";
import {
	fetchIpaEnti,
	ipaEntiFile,
	MIN_PLAUSIBLE_ENTI,
	readIpaFile,
	serializeIpaFile,
	toIpaFile,
} from "../lib/ipa";

const target = ipaEntiFile();
const shown = path.relative(process.cwd(), target);
const enti = await fetchIpaEnti();
if (enti.length < MIN_PLAUSIBLE_ENTI) {
	console.error(`IndicePA returned only ${enti.length} enti: file left untouched.`);
	process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const next = toIpaFile(enti, today);
const current = await readIpaFile().catch(() => null);
const unchanged =
	current &&
	JSON.stringify(current.types) === JSON.stringify(next.types) &&
	JSON.stringify(current.enti) === JSON.stringify(next.enti);

if (unchanged) {
	console.log(`No changes: ${enti.length} enti, ${shown} untouched.`);
} else {
	await Bun.write(target, serializeIpaFile(next));
	const before = new Set(current?.enti.map(([code]) => code));
	const after = new Set(next.enti.map(([code]) => code));
	const added = [...after].filter((c) => !before.has(c)).length;
	const removed = [...before].filter((c) => !after.has(c)).length;
	console.log(`Updated ${shown}: ${enti.length} enti (+${added} / -${removed}).`);
}
