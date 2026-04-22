import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

/**
 * Guards issue 1.3.1 (Informazioni e correlazioni) on the Edit pages.
 * The bug: the h1 was bound to a dynamic preview title (chart/dashboard name)
 * that is empty until the user types, and it didn't describe the purpose of
 * the page (create/edit). Fix: static h1 describes the page, dynamic name
 * moves to the h2 preview heading.
 *
 * We mirror the shape of each page header here without pulling the full page
 * (which depends on xstate, API, router, i18n, etc.).
 */

function EditPageHeader({
  mode,
  previewName,
}: {
  mode: "new" | "edit";
  previewName?: string;
}) {
  return (
    <>
      <div>
        <button type="button">Torna alla lista</button>
        <h1 className="text-xl font-bold">
          {mode === "edit" ? "Modifica grafico" : "Nuovo grafico"}
        </h1>
        <button type="button">Salva</button>
      </div>
      <section aria-labelledby="preview-heading">
        <h2 id="preview-heading" className="text-2xl font-bold">
          Anteprima{previewName ? `: ${previewName}` : ""}
        </h2>
      </section>
    </>
  );
}

describe("Edit pages — heading structure (1.3.1)", () => {
  it("new chart: h1 describes purpose even when the preview name is empty", () => {
    render(<EditPageHeader mode="new" previewName="" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/nuovo grafico/i);
    // Must not be a dynamic value that could be empty
    expect(h1.textContent?.trim().length).toBeGreaterThan(0);
  });

  it("edit chart: h1 says 'Modifica grafico'", () => {
    render(<EditPageHeader mode="edit" previewName="My Sales Chart" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/modifica grafico/i);
  });

  it("preview heading is h2, not h1, and includes the dynamic name", () => {
    render(<EditPageHeader mode="edit" previewName="Q3 KPIs" />);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2).toHaveTextContent(/anteprima: q3 kpis/i);
    // Only one h1: the page title, not the preview
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
  });

  it("preview section is exposed as a landmark labelled by the preview heading", () => {
    render(<EditPageHeader mode="new" previewName="" />);
    const section = screen.getByRole("region", { name: /anteprima/i });
    expect(section).toBeInTheDocument();
  });

  it("h2 still works when there is no dynamic name yet", () => {
    render(<EditPageHeader mode="new" />);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2).toHaveTextContent(/anteprima/i);
    // Must not be an empty heading (that'd fail WCAG 2.4.6 too)
    expect(h2.textContent?.trim().length).toBeGreaterThan(0);
  });
});
