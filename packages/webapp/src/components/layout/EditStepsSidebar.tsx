import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSliders, FaXmark } from "react-icons/fa6";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Wraps the editor step column (Informazioni / Carica i tuoi dati / Configura).
 * On xl+ it renders as the usual static left column of the editor grid; below
 * xl it disappears into a slide-in drawer opened by a floating button, so the
 * preview keeps the whole width on small screens.
 *
 * While the drawer is open it behaves as a modal dialog (#122): focus moves
 * into it, Tab cycles inside it, Escape closes it and focus returns to the
 * button. The parent is told through `onOpenChange` so it can mark the rest
 * of the page `inert`, keeping screen-reader navigation inside the panel.
 */
export default function EditStepsSidebar({
  children,
  onOpenChange,
}: {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.layout.editSidebar",
  });
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !asideRef.current) return;
      const items = Array.from(
        asideRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const label = t("toggle", { defaultValue: "Impostazioni e dati" });

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="edit-steps-drawer"
        className="btn btn-primary xl:hidden fixed bottom-4 left-4 z-40 shadow-lg"
        onClick={() => setOpen(true)}
      >
        <FaSliders aria-hidden="true" /> {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 xl:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="edit-steps-drawer"
        ref={asideRef}
        aria-label={label}
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
        className={`fixed inset-y-0 left-0 z-50 w-[min(90vw,26rem)] overflow-y-auto bg-base-200 p-4 shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } xl:static xl:z-auto xl:col-span-2 xl:w-auto xl:translate-x-0 xl:overflow-visible xl:bg-transparent xl:p-0 xl:shadow-none`}
      >
        <div className="flex justify-end xl:hidden mb-2">
          <button
            ref={closeRef}
            type="button"
            className="btn btn-ghost btn-sm btn-square"
            aria-label={t("close", { defaultValue: "Chiudi il pannello" })}
            onClick={() => {
              setOpen(false);
              toggleRef.current?.focus();
            }}
          >
            <FaXmark aria-hidden="true" />
          </button>
        </div>
        {children}
      </aside>
    </>
  );
}
