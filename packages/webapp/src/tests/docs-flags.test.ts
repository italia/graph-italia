import { describe, it, expect } from "vitest";
import { applyInstanceFlags } from "../lib/docsFlags";
import itCondivisione from "../docs/it/condivisione.md?raw";
import itIntroduzione from "../docs/it/introduzione.md?raw";

// Every chapter, both languages, keyed by path ("../docs/it/mappe.md").
const CHAPTERS = import.meta.glob<string>("../docs/*/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const md = [
  "intro",
  "<!-- publishing:on -->",
  "public link",
  "<!-- /publishing -->",
  "<!-- publishing:off -->",
  "api key only",
  "<!-- /publishing -->",
  "<!-- password:off -->",
  "spid only",
  "<!-- /password -->",
  "outro",
].join("\n");

describe("applyInstanceFlags", () => {
  it("keeps the blocks matching the instance and drops the markers", () => {
    expect(applyInstanceFlags(md, { publishing: false, password: false })).toBe(
      "intro\napi key only\nspid only\noutro",
    );
    expect(applyInstanceFlags(md, { publishing: true, password: true })).toBe(
      "intro\npublic link\noutro",
    );
  });

  it("leaves no marker behind in the real chapters", () => {
    expect(Object.keys(CHAPTERS).length).toBeGreaterThanOrEqual(26);
    for (const chapter of [itCondivisione, itIntroduzione, ...Object.values(CHAPTERS)]) {
      for (const publishing of [true, false]) {
        for (const password of [true, false]) {
          expect(applyInstanceFlags(chapter, { publishing, password })).not.toContain("<!--");
        }
      }
    }
  });

  it("does not mention iframes when publishing is off", () => {
    const out = applyInstanceFlags(itCondivisione, { publishing: false, password: false });
    expect(out).not.toContain("<iframe");
    expect(out).toContain("ChartProvider");
  });

  it("leaves public links and embeds to the README in every language and mode", () => {
    for (const [path, chapter] of Object.entries(CHAPTERS)) {
      if (!path.endsWith("/condivisione.md")) continue;
      for (const publishing of [true, false]) {
        const out = applyInstanceFlags(chapter, { publishing, password: true });
        expect(out, path).not.toMatch(/<iframe|\/embed\/|\/display\//);
        // The visibility switch is a public-publishing setting: not covered here.
        expect(out, path).not.toMatch(/^## .*visib/im);
        // Team sharing and API-key integration are there whatever the flag.
        expect(out, path).toContain("/docs/organizzazioni");
        expect(out, path).toContain("ChartProvider");
      }
    }
  });

  it("does not describe visibility or the 24h refresh when publishing is off", () => {
    for (const [path, chapter] of Object.entries(CHAPTERS)) {
      const out = applyInstanceFlags(chapter, { publishing: false, password: true });
      expect(out, path).not.toMatch(/24 ore|24-hour|24 hours|pubblico\/privato|public\/private/i);
      // The sharing chapter explains that the visibility setting is absent.
      if (!path.endsWith("/condivisione.md")) {
        expect(out, path).not.toMatch(/visibilit/i);
      }
    }
  });
});
