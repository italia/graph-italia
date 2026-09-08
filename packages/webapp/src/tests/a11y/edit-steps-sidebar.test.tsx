import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditStepsSidebar from "../../components/layout/EditStepsSidebar";
import "../../i18n/config";

/**
 * Guards issue 122: while the "Impostazioni e dati" drawer is open, nothing
 * outside it (header, toolbar, preview, footer) may be reachable by keyboard
 * or screen reader. The drawer marks every element outside its own branch
 * as inert and releases them when it closes.
 */

function Page() {
  return (
    <div>
      <header data-testid="header">
        <a href="/">Home</a>
      </header>
      <main>
        <div data-testid="toolbar">
          <button type="button">Salva</button>
        </div>
        <div>
          <EditStepsSidebar>
            <button type="button">Dentro il pannello</button>
          </EditStepsSidebar>
          <section data-testid="preview">
            <button type="button">Apri il grafico</button>
          </section>
        </div>
      </main>
      <footer data-testid="footer">footer</footer>
    </div>
  );
}

describe("EditStepsSidebar drawer (#122)", () => {
  it("makes everything outside the drawer inert while open, releases it on close", async () => {
    const user = userEvent.setup();
    render(<Page />);
    const toggle = screen.getByRole("button", { name: /impostazioni e dati/i });

    await user.click(toggle);
    for (const id of ["header", "toolbar", "preview", "footer"]) {
      expect(screen.getByTestId(id)).toHaveAttribute("inert");
    }
    expect(screen.getByRole("button", { name: /dentro il pannello/i })).not.toHaveAttribute("inert");
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    for (const id of ["header", "toolbar", "preview", "footer"]) {
      expect(screen.getByTestId(id)).not.toHaveAttribute("inert");
    }
    expect(document.activeElement).toBe(toggle);
  });
});
