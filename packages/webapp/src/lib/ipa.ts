import uFuzzy from "@leeoniya/ufuzzy";
import type { IpaEnte } from "./api";

/**
 * The signup «PA di appartenenza» is an IndicePA ente, stored in `User.pa` as
 * "<codice IPA>#<denominazione>" (the server checks the code and rewrites the
 * name with the official one, see server lib/ipa.ts). Values saved before
 * IndicePA are plain names with no code.
 */
const IPA_CODE_RE = /^[A-Za-z0-9_]{1,32}$/;

export function formatPa(ente: Pick<IpaEnte, "code" | "name">): string {
  return `${ente.code}#${ente.name}`;
}

export function parsePa(value: string): { code: string | null; name: string } {
  const i = value.indexOf("#");
  const code = i > 0 ? value.slice(0, i) : "";
  return IPA_CODE_RE.test(code)
    ? { code, name: value.slice(i + 1) }
    : { code: null, name: value };
}

export const MIN_QUERY_LENGTH = 2;

/**
 * Fuzzy search over the ~24k enti: one typo per word, words in any order
 * ("bologna comune"), accents ignored. Results come back ranked by uFuzzy, or
 * in alphabetical order when the query is too broad to rank (> 1000 matches).
 */
export function createIpaSearch(enti: IpaEnte[]) {
  const haystack = uFuzzy.latinize(enti.map((e) => e.name));
  const uf = new uFuzzy({ intraMode: 1, intraIns: 1 });

  return function search(query: string, limit = 50): { results: IpaEnte[]; total: number } {
    const needle = uFuzzy.latinize(query.trim());
    if (needle.length < MIN_QUERY_LENGTH) return { results: [], total: 0 };
    const [idxs, info, order] = uf.search(haystack, needle, 3);
    if (!idxs?.length) return { results: [], total: 0 };
    const ranked = info && order ? order.map((i) => info.idx[i]) : idxs;
    return { results: ranked.slice(0, limit).map((i) => enti[i]), total: ranked.length };
  };
}
