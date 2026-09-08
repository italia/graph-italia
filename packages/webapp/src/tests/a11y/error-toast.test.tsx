import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Toaster } from "react-hot-toast";
import toast from "../../lib/toast";

/**
 * Guards issue 135: an error toast must reach assistive technology. Through
 * the app's toast wrapper it is rendered as role="alert" (announced on
 * insertion); success toasts stay polite status messages.
 */
describe("Toast announcements (#135)", () => {
  it("error toasts are alerts, success toasts are status messages", async () => {
    render(<Toaster />);
    await act(async () => {
      toast.error("Errore durante il salvataggio della dashboard");
      toast.success("Dashboard salvata con successo");
    });
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/errore durante il salvataggio/i);
    expect(alert).toHaveAttribute("aria-live", "assertive");
    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent(/salvata con successo/i);
  });
});
