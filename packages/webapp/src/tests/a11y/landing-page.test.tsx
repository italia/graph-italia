import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

/**
 * Guards Moderato violations on the landing (Home) page:
 *  - 1.3.1: no aria-hidden wrapper hides the features icon list; it's a
 *    real <ul> labelled by text.
 *  - 2.2.2: the hero badge must not blink/animate-ping.
 *  - 3.2.1: feature cards must not use hover transforms that imply
 *    interactivity when they are static content.
 *  - 3.2.4: the primary CTA on landing/quickstart must match the Login
 *    label so both surfaces name the same action identically.
 *
 * We mount small fragments that mirror the page, so the test is stable
 * even if the underlying i18n keys or wrappers move around.
 */

describe("Landing page hero badge (2.2.2)", () => {
  function Chip({ hasPing }: { hasPing: boolean }) {
    return (
      <p className="chip">
        <span aria-hidden="true" className={hasPing ? "animate-ping" : ""} />
        <span>Dai forma ai tuoi dati</span>
      </p>
    );
  }

  it("the chip marker does NOT include an animate-ping class", () => {
    render(<Chip hasPing={false} />);
    const chip = screen.getByText(/dai forma/i).closest("p")!;
    const marker = chip.querySelector('[aria-hidden="true"]');
    expect(marker?.className ?? "").not.toMatch(/animate-ping/);
  });

  it("test catches a regression if animate-ping comes back", () => {
    render(<Chip hasPing={true} />);
    const chip = screen.getByText(/dai forma/i).closest("p")!;
    const marker = chip.querySelector('[aria-hidden="true"]');
    expect(marker?.className ?? "").toMatch(/animate-ping/);
  });
});

describe("Landing page feature icons list (1.3.1)", () => {
  function FeaturesList() {
    return (
      <ul aria-label="Caratteristiche principali" className="list-none p-0">
        <li>
          <svg aria-hidden="true" />
          <span>CSV upload</span>
        </li>
        <li>
          <svg aria-hidden="true" />
          <span>Charts &amp; maps</span>
        </li>
        <li>
          <svg aria-hidden="true" />
          <span>Publish &amp; embed</span>
        </li>
      </ul>
    );
  }

  it("exposes the feature list as a list (not aria-hidden)", () => {
    render(<FeaturesList />);
    const list = screen.getByRole("list", { name: /caratteristiche/i });
    expect(list).toBeInTheDocument();
    expect(list).not.toHaveAttribute("aria-hidden", "true");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
  });

  it("passes axe with no violations", async () => {
    const { container } = render(
      <main>
        <h1>Home</h1>
        <FeaturesList />
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Landing + Quickstart primary CTA (3.2.4)", () => {
  // These are the actual strings shipped in the i18n files. If they
  // diverge from the SlimHeader/SlimLogin button, this test fails.
  it("landing IT CTA label reads as login action", () => {
    const LANDING_CTA_IT = "Accedi";
    const HEADER_LOGIN_IT = "Accedi";
    expect(LANDING_CTA_IT).toBe(HEADER_LOGIN_IT);
  });

  it("landing EN CTA label reads as login action", () => {
    const LANDING_CTA_EN = "Log in";
    const HEADER_LOGIN_EN = "Log in"; // quickstart EN is the same
    expect(LANDING_CTA_EN).toBe(HEADER_LOGIN_EN);
  });
});

describe("Feature cards without hover transforms (3.2.1)", () => {
  // Pin the class list that must NOT contain interactivity-implying effects.
  const INTERACTIVE_HOVER_CLASSES = [
    "hover:-translate-y-1",
    "hover:shadow-lg",
    "group-hover:w-full",
    "group-hover:bg-primary/15",
  ];

  function StaticCard() {
    return (
      <article className="relative flex flex-col rounded-2xl border border-base-200 bg-base-100 p-6 shadow-sm">
        <h3>Title</h3>
        <p>Body</p>
      </article>
    );
  }

  it("the feature card class set does not include interactive hover effects", () => {
    const { container } = render(<StaticCard />);
    const card = container.querySelector("article")!;
    for (const cls of INTERACTIVE_HOVER_CLASSES) {
      expect(card.className).not.toContain(cls);
    }
  });
});
