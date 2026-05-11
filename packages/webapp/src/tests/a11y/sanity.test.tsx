import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { render } from "@testing-library/react";

/**
 * Basic smoke test to confirm vitest + axe setup works.
 * Detailed a11y tests live alongside the issues they guard.
 */
describe("a11y infrastructure", () => {
  it("axe detects violations in intentionally broken markup", async () => {
    const { container } = render(
      <div>
        <img src="/x.png" />
        <button></button>
      </div>,
    );
    const results = await axe(container);
    expect(results.violations.length).toBeGreaterThan(0);
  });

  it("axe passes on valid markup", async () => {
    const { container } = render(
      <main>
        <h1>Title</h1>
        <button type="button" aria-label="close">
          X
        </button>
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
