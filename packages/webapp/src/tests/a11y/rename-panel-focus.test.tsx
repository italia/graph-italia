import { describe, it, expect, vi } from "vitest";
import { render, screen, act, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TransformDataTable from "../../components/load-data/TransformDataTable";
import "../../i18n/config";

/**
 * Guards issue 132 follow-up: the "Rinomina intestazioni" panel receives the
 * focus when it opens and gives it back to its toggle button when it closes
 * (apply with Enter, cancel), so a screen-reader user keeps their place in
 * the toolbar instead of being dropped out of the content (WCAG 2.4.3).
 */

const DATA = [
  ["regione", "valore"],
  ["Nord", 1],
  ["Sud", 2],
];

async function flushFocus() {
  // closeRenameForm moves the focus on the next macrotask
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe("Rename headers panel focus (#132)", () => {
  it("opens with the focus on its first field and returns it on Enter", async () => {
    const user = userEvent.setup();
    const onTransform = vi.fn();
    render(<TransformDataTable currentData={DATA} handleTransformData={onTransform} />);

    const toggle = screen.getByRole("button", { name: /rinomina intestazioni/i });
    await user.click(toggle);
    const first = screen.getByLabelText(/colonna 1/i) as HTMLInputElement;
    expect(document.activeElement).toBe(first);

    await user.clear(first);
    await user.type(first, "area{Enter}");
    await flushFocus();

    expect(screen.queryByLabelText(/colonna 1/i)).toBeNull();
    expect(document.activeElement).toBe(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("returns the focus to the toggle on cancel", async () => {
    const user = userEvent.setup();
    render(<TransformDataTable currentData={DATA} handleTransformData={() => {}} />);

    const toggle = screen.getByRole("button", { name: /rinomina intestazioni/i });
    await user.click(toggle);
    const panel = screen.getByRole("region", { name: /rinomina intestazioni/i });
    await user.click(within(panel).getByRole("button", { name: /annulla/i }));
    await flushFocus();

    expect(document.activeElement).toBe(toggle);
  });
});
