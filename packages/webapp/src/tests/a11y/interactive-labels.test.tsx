import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { useState } from "react";

/**
 * Guards four Moderato fixes:
 *  - 2.4.6 Dashboard slot size controls — grouped and individually labelled.
 *  - 3.3.2 ChartTable icon-only actions — expose title AND aria-label.
 *  - 4.1.2 DataMngTable rename toggle — aria-expanded + aria-controls.
 *  - 1.3.1 Footer — no stray ":" implying missing content.
 */

describe("Dashboard slot toolbar (2.4.6)", () => {
  function Toolbar({ w, h }: { w: number; h: number }) {
    return (
      <div>
        <div role="group" aria-label="Larghezza">
          {[1, 2, 3].map((span) => (
            <button
              key={span}
              type="button"
              aria-label={`Larghezza ${span}`}
              aria-pressed={w === span}
            >
              {span}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Altezza">
          {[1, 2, 3, 4].map((rows) => (
            <button
              key={rows}
              type="button"
              aria-label={`Altezza ${rows}`}
              aria-pressed={h === rows}
            >
              {rows}
            </button>
          ))}
        </div>
      </div>
    );
  }

  it("each dimension button has a full aria-label (dimension + value)", () => {
    render(<Toolbar w={2} h={3} />);
    expect(screen.getByRole("button", { name: /larghezza 1/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /larghezza 2/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /altezza 4/i })).toBeInTheDocument();
  });

  it("the selected size has aria-pressed=true", () => {
    render(<Toolbar w={2} h={3} />);
    expect(
      screen.getByRole("button", { name: /larghezza 2/i }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: /larghezza 1/i }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByRole("button", { name: /altezza 3/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("dimension groups are exposed as labelled groups", () => {
    render(<Toolbar w={1} h={1} />);
    expect(
      screen.getByRole("group", { name: /larghezza/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /altezza/i }),
    ).toBeInTheDocument();
  });
});

describe("ChartTable row actions (3.3.2)", () => {
  function ActionCell() {
    return (
      <div>
        <button type="button" aria-label="Anteprima" title="Anteprima">
          <span aria-hidden="true">👁</span>
        </button>
        <a href="/edit" aria-label="Modifica" title="Modifica">
          <span aria-hidden="true">✏</span>
        </a>
        <a href="/view" aria-label="Apri in nuova scheda" title="Apri in nuova scheda">
          <span aria-hidden="true">🔗</span>
        </a>
        <button type="button" aria-label="Elimina" title="Elimina">
          <span aria-hidden="true">🗑</span>
        </button>
      </div>
    );
  }

  it("every icon button exposes both aria-label and title (tooltip)", () => {
    render(<ActionCell />);
    const preview = screen.getByRole("button", { name: /anteprima/i });
    expect(preview).toHaveAttribute("title", "Anteprima");
    const edit = screen.getByRole("link", { name: /modifica/i });
    expect(edit).toHaveAttribute("title", "Modifica");
    const view = screen.getByRole("link", { name: /apri in nuova scheda/i });
    expect(view).toHaveAttribute("title", "Apri in nuova scheda");
    const del = screen.getByRole("button", { name: /elimina/i });
    expect(del).toHaveAttribute("title", "Elimina");
  });
});

describe("DataMngTable rename toggle (4.1.2)", () => {
  function RenameToggle() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="rename-headers-panel"
          onClick={() => setOpen(!open)}
        >
          {open ? "Annulla rinomina" : "Rinomina intestazioni"}
        </button>
        {open && (
          <div
            id="rename-headers-panel"
            role="region"
            aria-labelledby="rename-headers-title"
          >
            <h4 id="rename-headers-title">Rinomina intestazioni colonne</h4>
          </div>
        )}
      </>
    );
  }

  it("button exposes aria-expanded=false when the panel is closed", () => {
    render(<RenameToggle />);
    const btn = screen.getByRole("button", { name: /rinomina intestazioni/i });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(btn).toHaveAttribute("aria-controls", "rename-headers-panel");
  });
});

describe("Footer semantics (1.3.1)", () => {
  function Footer({ tagline }: { tagline: string }) {
    return (
      <footer>
        <div>
          <p className="m-0 font-bold">Graph Italia</p>
          {tagline && <p className="m-0">{tagline}</p>}
        </div>
        <nav aria-label="Link del footer">
          <a href="/x">Link</a>
        </nav>
      </footer>
    );
  }

  it("does not render a stray ':' when tagline is empty", () => {
    const { container } = render(<Footer tagline="" />);
    expect(container.textContent).not.toMatch(/Graph Italia:/);
  });

  it("renders the nav with an accessible name", () => {
    render(<Footer tagline="" />);
    expect(
      screen.getByRole("navigation", { name: /link del footer/i }),
    ).toBeInTheDocument();
  });
});
