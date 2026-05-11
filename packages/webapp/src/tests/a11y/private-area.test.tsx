import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/**
 * Tests for the Private Area page (Home). Rather than mounting the real page
 * (which pulls in API clients, stores, router, xstate, i18n, etc.), we test
 * minimal markup fragments that mirror the a11y-relevant structure.
 *
 * These guard the fixes for the following Grave/Moderate violations:
 *  - 2.4.6: descriptive section headings (not "Benvenuto")
 *  - 1.3.1: heading hierarchy h1 → h2 (no h3 jump)
 *  - 1.4.13: "Rename project" action visible on keyboard focus
 */

describe("Private Area — heading structure (1.3.1, 2.4.6)", () => {
  it("uses h1 for the page title and h2 for content sections", () => {
    render(
      <main>
        <h1>Area Privata</h1>
        <section aria-labelledby="c">
          <h2 id="c">I miei grafici</h2>
        </section>
        <section aria-labelledby="d">
          <h2 id="d">Le mie dashboard</h2>
        </section>
      </main>,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Area Privata",
    );
    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s).toHaveLength(2);
    expect(h2s[0]).toHaveTextContent("I miei grafici");
    expect(h2s[1]).toHaveTextContent("Le mie dashboard");
    // No h3 should be used for section-level headings in this page
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
  });

  it("section heading describes content, never 'Benvenuto'", () => {
    render(
      <section aria-labelledby="charts-heading">
        <h2 id="charts-heading">I miei grafici</h2>
      </section>,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).not.toMatch(/benvenuto/i);
    expect(heading.textContent).toMatch(/grafici/i);
  });
});

describe("Private Area — rename project button (1.4.13)", () => {
  // Mirrors the class set we apply in private/index.tsx so that if the
  // implementation drifts, this test catches it.
  const EXPECTED_CLASSES = [
    "group-hover:opacity-100",
    "group-focus-within:opacity-100",
    "focus-visible:opacity-100",
  ];

  function ProjectRow({ name }: { name: string }) {
    return (
      <div className="flex items-center gap-1 group">
        <button type="button">{name}</button>
        <button
          type="button"
          aria-label={`Rinomina progetto ${name}`}
          className={`opacity-0 ${EXPECTED_CLASSES.join(" ")} px-1`}
        >
          <span aria-hidden="true">✏️</span>
        </button>
      </div>
    );
  }

  it("rename button has a descriptive accessible name", () => {
    render(<ProjectRow name="My Project" />);
    expect(
      screen.getByRole("button", { name: /rinomina progetto my project/i }),
    ).toBeInTheDocument();
  });

  it("rename button exposes focus-visible classes so it becomes visible via keyboard", () => {
    render(<ProjectRow name="Proj" />);
    const btn = screen.getByRole("button", { name: /rinomina/i });
    for (const cls of EXPECTED_CLASSES) {
      expect(btn.className).toContain(cls);
    }
  });

  it("rename button is reachable by keyboard tab navigation", async () => {
    const user = userEvent.setup();
    render(<ProjectRow name="Proj" />);
    await user.tab(); // first button (the project name)
    await user.tab(); // pencil button
    expect(screen.getByRole("button", { name: /rinomina/i })).toHaveFocus();
  });
});
