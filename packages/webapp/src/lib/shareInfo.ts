import { getServerUrl, getServerUrlWithApi } from "./api";

/**
 * I tre valori che servono per consumare un grafico o una dashboard fuori
 * dalla webapp: l'endpoint API, l'id della risorsa e l'host (URL base del
 * server, senza path) — quest'ultimo è l'`endpoint` che il pacchetto
 * components richiede insieme al chartId.
 */
export type ShareInfo = {
  apiUrl: string;
  id: string;
  host: string;
};

export function buildShareInfo(
  resource: "charts" | "dashboards",
  id?: string,
): ShareInfo {
  return {
    apiUrl: `${getServerUrlWithApi()}/${resource}/${id ?? ""}`,
    id: id ?? "",
    host: getServerUrl(),
  };
}

/** Formato richiesto dal pulsante "copia". */
export function shareInfoString({ apiUrl, id, host }: ShareInfo): string {
  return `API URL: ${apiUrl}, ID: ${id}, HOST: ${host}`;
}
