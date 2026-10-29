import { describe, it, expect } from "vitest";
import { applyInstanceFlags } from "../lib/docsFlags";
import itCondivisione from "../docs/it/condivisione.md?raw";
import itIntroduzione from "../docs/it/introduzione.md?raw";

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
    for (const chapter of [itCondivisione, itIntroduzione]) {
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
});
