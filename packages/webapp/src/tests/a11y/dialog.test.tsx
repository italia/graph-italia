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
    render(
      <GenericDialog
        toggle={true}
        title="Conferma eliminazione"
        description="Sei sicuro?"
        labels={{ cancel: "Annulla", confirm: "Elimina" }}
        confirmCb={() => {}}
        cancelCb={() => {}}
      >
        <div>body</div>
      </GenericDialog>,
    );

    const title = screen.getByRole("heading", {
      level: 2,
      name: /conferma eliminazione/i,
    });
    const closeBtn = screen.getByRole("button", { name: /close modal/i });

    // DOCUMENT_POSITION_FOLLOWING (4) means `closeBtn` comes AFTER `title`.
    const relation = title.compareDocumentPosition(closeBtn);
    expect(relation & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
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
