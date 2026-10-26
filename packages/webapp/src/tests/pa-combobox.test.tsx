import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18next from "i18next";
import { SWRConfig } from "swr";
import { axe } from "vitest-axe";
import itResources from "../i18n/locales/it";
import PaCombobox from "../components/auth/PaCombobox";
import { createIpaSearch, formatPa, parsePa } from "../lib/ipa";
import type { IpaEnte } from "../lib/api";

const ENTI: IpaEnte[] = [
  { code: "c_a944", name: "Comune di Bologna", type: "Pubbliche Amministrazioni" },
  { code: "c_c121", name: "Comune di Castel Guelfo di Bologna", type: "Pubbliche Amministrazioni" },
  { code: "c_a345", name: "Comune di L'Aquila", type: "Pubbliche Amministrazioni" },
  { code: "inps", name: "Istituto Nazionale Previdenza Sociale - INPS", type: "Enti Nazionali di Previdenza" },
  { code: "unipd", name: "Universita' degli Studi di Padova", type: "Pubbliche Amministrazioni" },
  { code: "c_h501", name: "Roma Capitale", type: "Pubbliche Amministrazioni" },
];

const getIpaEnti = vi.fn(async () => ENTI);
vi.mock("../lib/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../lib/api")>()),
  getIpaEnti: () => getIpaEnti(),
}));

describe("lib/ipa", () => {
  it("formats and parses code#name; legacy free text has no code", () => {
    expect(formatPa(ENTI[0])).toBe("c_a944#Comune di Bologna");
    expect(parsePa("c_a944#Comune di Bologna")).toEqual({ code: "c_a944", name: "Comune di Bologna" });
    expect(parsePa("Comune di Bologna")).toEqual({ code: null, name: "Comune di Bologna" });
  });

  const search = createIpaSearch(ENTI);
  const names = (q: string) => search(q).results.map((e) => e.name);

  it("ranks the exact ente first, words in any order", () => {
    expect(names("comune bologna")[0]).toBe("Comune di Bologna");
    expect(names("bologna comune")[0]).toBe("Comune di Bologna");
  });

  it("tolerates one typo per word and ignores accents", () => {
    expect(names("comne bologna")[0]).toBe("Comune di Bologna");
    expect(names("università padova")).toEqual(["Universita' degli Studi di Padova"]);
  });

  it("needs at least two characters", () => {
    expect(search("c")).toEqual({ results: [], total: 0 });
  });
});

function makeI18n() {
  const instance = i18next.createInstance();
  instance.use(initReactI18next).init({
    lng: "it",
    resources: { it: itResources },
    interpolation: { escapeValue: false },
  });
  return instance;
}

function Harness({ onChange }: { onChange: (v: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="pa">Pubblica Amministrazione di Appartenenza</label>
      <PaCombobox
        id="pa"
        value={value}
        onChange={(v) => {
          setValue(v);
          onChange(v);
        }}
      />
    </form>
  );
}

function renderCombobox() {
  const onChange = vi.fn();
  const utils = render(
    // Fresh SWR cache per test: the list is cached under a fixed key.
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <I18nextProvider i18n={makeI18n()}>
        <Harness onChange={onChange} />
      </I18nextProvider>
    </SWRConfig>,
  );
  return { ...utils, onChange, input: screen.getByRole("combobox", { name: /amministrazione/i }) };
}

describe("PaCombobox", () => {
  beforeEach(() => {
    getIpaEnti.mockReset();
    getIpaEnti.mockImplementation(async () => ENTI);
  });

  it("picks an ente with the keyboard and stores code#name", async () => {
    const user = userEvent.setup();
    const { input, onChange } = renderCombobox();
    await waitFor(() => expect(getIpaEnti).toHaveBeenCalled());

    await user.type(input, "comune bologna");
    const options = await screen.findAllByRole("option");
    expect(options[0]).toHaveTextContent("Comune di Bologna");
    expect(input).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute("aria-activedescendant", options[0].id);
    expect(options[0]).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenLastCalledWith("c_a944#Comune di Bologna");
    expect(input).toHaveValue("Comune di Bologna");
    expect(screen.queryByRole("option")).toBeNull();
  });

  it("picks an ente with the mouse; typing again clears the choice", async () => {
    const user = userEvent.setup();
    const { input, onChange } = renderCombobox();

    await user.type(input, "inps");
    await user.click(await screen.findByRole("option", { name: /INPS/ }));
    expect(onChange).toHaveBeenLastCalledWith("inps#Istituto Nazionale Previdenza Sociale - INPS");

    await user.type(input, "x");
    expect(onChange).toHaveBeenLastCalledWith("");
  });

  it("Escape closes the list without choosing", async () => {
    const user = userEvent.setup();
    const { input, onChange } = renderCombobox();
    await user.type(input, "roma");
    await screen.findByRole("option", { name: /Roma Capitale/ });
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("option")).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("says when nothing matches", async () => {
    const user = userEvent.setup();
    const { input } = renderCombobox();
    await waitFor(() => expect(getIpaEnti).toHaveBeenCalled());
    await user.type(input, "zzzzzz");
    expect(await screen.findByRole("status")).toHaveTextContent(/nessun ente/i);
  });

  it("shows an error with a retry when the list cannot be loaded", async () => {
    getIpaEnti.mockImplementation(async () => {
      throw new Error("503");
    });
    const user = userEvent.setup();
    renderCombobox();
    expect(await screen.findByRole("status")).toHaveTextContent(/impossibile caricare/i);

    getIpaEnti.mockImplementation(async () => ENTI);
    await user.click(screen.getByRole("button", { name: /riprova/i }));
    await waitFor(() => expect(screen.getByRole("status")).not.toHaveTextContent(/impossibile/i));
  });

  it("has no axe violations with the list open", async () => {
    const user = userEvent.setup();
    const { container, input } = renderCombobox();
    await user.type(input, "comune");
    await screen.findAllByRole("option");
    expect(await axe(container)).toHaveNoViolations();
  });
});
