import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { useRef } from "react";
import { usePaginationSelectKeyboard } from "../../hooks/usePaginationSelectKeyboard";

/**
 * Guards the keyboard contract on react-data-table-component's "Rows per page"
 * select: pressing Enter while the select is focused must open the dropdown.
 *
 * Native <select> opens on Space and Alt+Down; Enter is inconsistent across
 * browsers. Our hook bridges this gap so keyboard users have a predictable
 * interaction (WCAG 2.1.1 Tastiera).
 */

function Harness({ onShow }: { onShow?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  usePaginationSelectKeyboard(ref);
  return (
    <div ref={ref}>
      {/* Mirror the library's DOM: nav.rdt_Pagination > select */}
      <nav className="rdt_Pagination">
        <select
          data-testid="per-page"
          ref={(el) => {
            if (el && onShow) {
              // Install a showPicker stub before the test dispatches Enter.
              (el as unknown as { showPicker: () => void }).showPicker = onShow;
            }
          }}
        >
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </nav>
    </div>
  );
}

describe("usePaginationSelectKeyboard", () => {
  it("calls showPicker() when Enter is pressed on the pagination select", () => {
    const showPicker = vi.fn();
    const { getByTestId } = render(<Harness onShow={showPicker} />);
    const select = getByTestId("per-page") as HTMLSelectElement;

    select.focus();
    select.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );

    expect(showPicker).toHaveBeenCalledTimes(1);
  });

  it("ignores Enter on selects outside the rdt_Pagination nav", () => {
    const showPicker = vi.fn();
    function Outside() {
      const ref = useRef<HTMLDivElement>(null);
      usePaginationSelectKeyboard(ref);
      return (
        <div ref={ref}>
          <select
            data-testid="unrelated"
            ref={(el) => {
              if (el) {
                (el as unknown as { showPicker: () => void }).showPicker =
                  showPicker;
              }
            }}
          >
            <option value="a">a</option>
          </select>
        </div>
      );
    }
    const { getByTestId } = render(<Outside />);
    const select = getByTestId("unrelated") as HTMLSelectElement;
    select.focus();
    select.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    expect(showPicker).not.toHaveBeenCalled();
  });

  it("falls back to a mousedown when showPicker is unavailable", () => {
    function NoPickerHarness() {
      const ref = useRef<HTMLDivElement>(null);
      usePaginationSelectKeyboard(ref);
      return (
        <div ref={ref}>
          <nav className="rdt_Pagination">
            <select data-testid="per-page">
              <option value="10">10</option>
            </select>
          </nav>
        </div>
      );
    }
    const { getByTestId } = render(<NoPickerHarness />);
    const select = getByTestId("per-page") as HTMLSelectElement;
    const mousedownSpy = vi.fn();
    select.addEventListener("mousedown", mousedownSpy);
    select.focus();
    select.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    expect(mousedownSpy).toHaveBeenCalled();
  });
});
