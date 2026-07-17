import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSliders, FaXmark } from "react-icons/fa6";

/**
 * Wraps the editor step column (Informazioni / Carica i tuoi dati / Configura).
 * On xl+ it renders as the usual static left column of the editor grid; below
 * xl it disappears into a slide-in drawer opened by a floating button, so the
 * preview keeps the whole width on small screens.
 */
export default function EditStepsSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.layout.editSidebar",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const label = t("toggle", { defaultValue: "Impostazioni e dati" });

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
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
        aria-label={label}
        className={`fixed inset-y-0 left-0 z-50 w-[min(90vw,26rem)] overflow-y-auto bg-base-200 p-4 shadow-xl transform transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } xl:static xl:z-auto xl:col-span-2 xl:w-auto xl:transform-none xl:overflow-visible xl:bg-transparent xl:p-0 xl:shadow-none`}
      >
        <div className="flex justify-end xl:hidden mb-2">
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square"
            aria-label={t("close", { defaultValue: "Chiudi il pannello" })}
            onClick={() => setOpen(false)}
          >
            <FaXmark aria-hidden="true" />
          </button>
        </div>
        {children}
      </aside>
    </>
  );
}
