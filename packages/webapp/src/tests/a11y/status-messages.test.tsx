import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CSVUpload from "../../components/load-data/CSVUpload";
import JsonUpload from "../../components/load-data/JsonUpload";

/**
 * Guards issue 4.1.3 (Messaggi di stato): after data is loaded from CSV/JSON,
 * the UI must announce the new state to assistive tech via a live region —
 * without requiring focus on the uploaded-data region.
 */

function makeFile(content: string, name: string, type: string): File {
  return new File([content], name, { type });
}

describe("CSVUpload status messages (4.1.3)", () => {
  it("renders a polite live region for status announcements", () => {
    render(<CSVUpload setData={() => {}} />);
    const regions = screen.getAllByRole("status");
    // There may be multiple status regions (e.g. one for errors) — ensure at
    // least one is a polite live region dedicated to status.
    expect(regions.length).toBeGreaterThanOrEqual(1);
    const polite = regions.find((el) => el.getAttribute("aria-live") === "polite");
    expect(polite).toBeDefined();
  });

  it("announces a status message after a successful CSV upload", async () => {
    const user = userEvent.setup();
    const onData = vi.fn();
    render(<CSVUpload setData={onData} />);

    const input = screen.getByLabelText(/upload csv file/i) as HTMLInputElement;
    const file = makeFile("a,b\n1,2\n3,4\n", "sample.csv", "text/csv");

    await act(async () => {
      await user.upload(input, file);
    });

    expect(onData).toHaveBeenCalled();
    // Wait for Papa Parse to complete asynchronously
    await screen.findByText(/sample\.csv/i);
    const statusText = screen.getByText(/sample\.csv/i);
    // The status text must live inside a polite live region
    const liveRegion = statusText.closest('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
  });
});

describe("JsonUpload status messages (4.1.3)", () => {
  it("renders a polite live region for status announcements", () => {
    render(<JsonUpload setData={() => {}} />);
    const regions = screen.getAllByRole("status");
    expect(regions.length).toBeGreaterThanOrEqual(1);
    const polite = regions.find((el) => el.getAttribute("aria-live") === "polite");
    expect(polite).toBeDefined();
  });
});
