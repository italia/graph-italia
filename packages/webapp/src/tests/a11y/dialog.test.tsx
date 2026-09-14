import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import GenericDialog from "../../components/layout/GenericDialog";

/**
 * Guards 1.3.2 (Sequenza significativa) for modals — the title must be
 * announced before the close affordance, which means the title must come
 * first in DOM order regardless of visual placement.
 */

describe("GenericDialog DOM order (1.3.2)", () => {
  it("the <h2> title appears before the close button in the DOM", () => {
    // Close-only dialog: the X is its single dismiss control
    render(
      <GenericDialog
        toggle={true}
        title="Conferma eliminazione"
        description="Sei sicuro?"
        cancelCb={() => {}}
      >
        <div>body</div>
      </GenericDialog>,
    );

    const title = screen.getByRole("heading", {
      level: 2,
      name: /conferma eliminazione/i,
    });
    const closeBtn = screen.getByRole("button", { name: /chiudi|close/i });

    // DOCUMENT_POSITION_FOLLOWING (4) means `closeBtn` comes AFTER `title`.
    const relation = title.compareDocumentPosition(closeBtn);
    expect(relation & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("a confirm dialog has a single dismiss control: Annulla, no X (3.2.4, #133)", () => {
    render(
      <GenericDialog
        toggle={true}
        title="Reimposta dati"
        labels={{ cancel: "Annulla", confirm: "Reimposta" }}
        confirmCb={() => {}}
        cancelCb={() => {}}
      >
        <div>body</div>
      </GenericDialog>,
    );
    expect(screen.queryByRole("button", { name: /chiudi|close/i })).toBeNull();
    expect(screen.getByRole("button", { name: "Annulla" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reimposta" })).toBeInTheDocument();
  });

  it("initial focus lands on the title, not on the close button (2.4.3)", async () => {
    render(
      <GenericDialog
        toggle={true}
        title="Conferma eliminazione"
        labels={{ cancel: "Annulla" }}
        cancelCb={() => {}}
      >
        <div>body</div>
      </GenericDialog>,
    );

    // The focus is moved on the next animation frame after showModal()
    await new Promise((resolve) => setTimeout(resolve, 50));

    const title = screen.getByRole("heading", {
      level: 2,
      name: /conferma eliminazione/i,
    });
    expect(document.activeElement).toBe(title);
  });

  it("the dialog is labelled by the modal title", () => {
    render(
      <GenericDialog
        toggle={true}
        title="Dialog with labelled heading"
        labels={{ cancel: "Cancel" }}
        cancelCb={() => {}}
      >
        <div>body</div>
      </GenericDialog>,
    );
    const dialog = document.querySelector("dialog")!;
    expect(dialog.getAttribute("aria-labelledby")).toBe("modal-title");
  });
});
