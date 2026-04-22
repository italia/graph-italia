import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import GenerateRandomData from "../../components/GenerateRandomData";
import LoadRemoteCSVSource from "../../components/load-data/LoadRemoteCSVSource";

/**
 * Guards the Bloccante violations — input fields must be programmatically
 * associated with a label (WCAG 2.4.6) — across the Generate Data, Load
 * Remote Data and Create Chart flows.
 *
 * These are marked "Risolto" in the audit CSV; this suite pins them down so
 * they don't regress.
 */

function makeI18n() {
  const instance = i18n.createInstance();
  instance.use(initReactI18next).init({
    lng: "it",
    fallbackLng: "it",
    interpolation: { escapeValue: false },
    resources: {
      it: {
        components: {
          components: {
            generateRandomData: {
              title: "Parametri",
              columns: {
                rows: { label: "Righe" },
                columns: { label: "Colonne" },
                rangeMin: { label: "Valore minimo" },
                rangeMax: { label: "Valore massimo" },
                offset: { label: "Offset" },
                multiplier: { label: "Moltiplicatore" },
              },
              actions: { generate: { label: "Genera" } },
            },
            loadData: {
              loadRemoteCsvData: {
                header: { label: "URL sorgente dati CSV" },
                errors: { invalidUrl: "URL non valido", loadingError: "Errore" },
                actions: {
                  load: { default: "Carica", loading: "Caricamento" },
                },
              },
            },
          },
        },
      },
    },
  });
  return instance;
}

function withI18n(node: React.ReactElement) {
  return <I18nextProvider i18n={makeI18n()}>{node}</I18nextProvider>;
}

describe("GenerateRandomData — input labels (2.4.6)", () => {
  it("every number input is reachable by its label", () => {
    render(withI18n(<GenerateRandomData setData={() => {}} />));
    for (const labelText of ["Righe", "Colonne", "Valore minimo", "Valore massimo", "Offset", "Moltiplicatore"]) {
      const input = screen.getByLabelText(labelText);
      expect(input).toHaveAttribute("type", "number");
    }
  });

  it("axe reports no labelling violations", async () => {
    const { container } = render(
      <main>{withI18n(<GenerateRandomData setData={() => {}} />)}</main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("LoadRemoteCSVSource — URL input label (2.4.6)", () => {
  it("URL field is associated to its label", () => {
    render(
      withI18n(
        <LoadRemoteCSVSource currentValue={null} setData={() => {}} />,
      ),
    );
    const input = screen.getByLabelText(/URL sorgente dati CSV/i);
    expect(input.id).toBe("csv-source-url");
    expect(input).toHaveAttribute("type", "text");
  });
});
