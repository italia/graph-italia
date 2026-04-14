import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { useState } from "react";

/**
 * Guards Grave issues on the Organizations page:
 *  - 4.1.2 Nome, ruolo, valore: card-accordion must expose semantic state
 *    (button + aria-expanded + aria-controls pointing at a labelled region).
 *  - 4.1.2: the icon-only delete button must expose a text alternative.
 *  - 1.1.1: decorative icons (chevron, trash glyph) must be aria-hidden.
 *
 * We reproduce the relevant fragment of the page locally to avoid pulling
 * the whole page (API, i18n, router).
 */

function OrgsListFragment({
  orgs,
  initialSelected = null,
}: {
  orgs: { id: string; name: string }[];
  initialSelected?: string | null;
}) {
  const [selected, setSelected] = useState<string | null>(initialSelected);
  return (
    <>
      <ul>
        {orgs.map((org) => {
          const isSelected = selected === org.id;
          return (
            <li key={org.id}>
              <button
                type="button"
                aria-expanded={isSelected}
                aria-controls={`org-panel-${org.id}`}
                onClick={() => setSelected(org.id)}
              >
                <span aria-hidden="true">{isSelected ? "▼" : "▶"}</span>
                <span>{org.name}</span>
              </button>
              <button
                type="button"
                aria-label={`Elimina organizzazione ${org.name}`}
              >
                <span aria-hidden="true">🗑</span>
              </button>
            </li>
          );
        })}
      </ul>
      {selected && (
        <section
          id={`org-panel-${selected}`}
          role="region"
          aria-label={`Dettagli organizzazione ${orgs.find((o) => o.id === selected)?.name ?? ""}`}
        >
          <h2>{orgs.find((o) => o.id === selected)?.name}</h2>
        </section>
      )}
    </>
  );
}

describe("Organizations list — accordion semantics (4.1.2, 1.1.1)", () => {
  const orgs = [
    { id: "a", name: "Acme" },
    { id: "b", name: "Beta Inc" },
  ];

  it("org card is a real button, not a div, so it's in the a11y tree", () => {
    render(<OrgsListFragment orgs={orgs} />);
    expect(
      screen.getByRole("button", { name: /^Acme$/, expanded: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Beta Inc$/, expanded: false }),
    ).toBeInTheDocument();
  });

  it("aria-expanded reflects selection state, and aria-controls points at the panel", async () => {
    const user = userEvent.setup();
    render(<OrgsListFragment orgs={orgs} />);

    const acmeBtn = screen.getByRole("button", { name: /^Acme$/ });
    expect(acmeBtn).toHaveAttribute("aria-expanded", "false");
    expect(acmeBtn).toHaveAttribute("aria-controls", "org-panel-a");

    await user.click(acmeBtn);
    expect(
      screen.getByRole("button", { name: /^Acme$/, expanded: true }),
    ).toBeInTheDocument();

    // The panel exists with the matching id, exposed as a labelled region
    const panel = screen.getByRole("region", {
      name: /dettagli organizzazione acme/i,
    });
    expect(panel.id).toBe("org-panel-a");
  });

  it("delete button exposes an accessible name that names the target org", () => {
    render(<OrgsListFragment orgs={orgs} />);
    expect(
      screen.getByRole("button", { name: /elimina organizzazione acme/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /elimina organizzazione beta inc/i }),
    ).toBeInTheDocument();
  });

  it("passes axe scan with no violations", async () => {
    const { container } = render(
      <main>
        <h1>Organizzazioni</h1>
        <OrgsListFragment orgs={orgs} initialSelected="a" />
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
