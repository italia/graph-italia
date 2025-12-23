import { ReactNode, useCallback, useEffect, useRef } from "react";

interface GenericDialogProps {
  title: string;
  description?: string;
  children: ReactNode;
  toggle: boolean;
  labels?: {
    cancel?: string;
    confirm?: string;
  };
  confirmCb: () => void;
  cancelCb: () => void;
  confirmDisabled?: boolean;
}

/**
 * GenericDialog - Componente Modal conforme alle linee guida del Design System Italia
 * @see https://designers.italia.it/design-system/componenti/modal/
 *
 * Caratteristiche:
 * - Titolo con h2 per accessibilità (contenuti separati dalla struttura della pagina)
 * - Pulsante di chiusura (X) in alto a destra
 * - Pulsanti azione in basso a destra (Cancel a sinistra, Confirm a destra)
 * - Overlay scuro per evidenziare la modale
 * - Chiusura cliccando fuori dalla modale
 */
export default function GenericDialog({
  title,
  description,
  children,
  toggle,
  confirmCb,
  cancelCb,
  labels = {
    confirm: "Conferma",
    cancel: "Annulla",
  },
  confirmDisabled = false,
}: GenericDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // Gestione chiusura con ESC e click fuori
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      const dialogDimensions = ref.current?.getBoundingClientRect();
      if (dialogDimensions) {
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          cancelCb();
        }
      }
    },
    [cancelCb]
  );

  useEffect(() => {
    if (ref.current) {
      if (toggle) {
        ref.current.showModal();
      } else {
        ref.current.close();
      }
    }
  }, [toggle]);

  // Gestione tasto ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && toggle) {
        cancelCb();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle, cancelCb]);

  return (
    <dialog
      ref={ref}
      className="modal modal-bottom sm:modal-middle"
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
    >
      <div className="modal-box relative" onClick={(e) => e.stopPropagation()}>
        {/* Pulsante chiusura (X) in alto a destra - Linea guida Italia */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
          onClick={() => cancelCb()}
          aria-label="Chiudi modale"
        >
          ✕
        </button>

        {/* Titolo con h2 per accessibilità - Linea guida Italia */}
        <h2 id="modal-title" className="font-bold text-xl pr-8">
          {title}
        </h2>

        {/* Descrizione opzionale */}
        {description && (
          <p
            id="modal-description"
            className="text-sm text-base-content/70 mt-2"
          >
            {description}
          </p>
        )}

        {/* Contenuto della modale */}
        <div className="py-4">{children}</div>

        {/* Pulsanti azione - Posizionati in basso a destra come da linee guida Italia */}
        <div className="modal-action">
          <button className="btn btn-outline" onClick={() => cancelCb()}>
            {labels.cancel}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => confirmCb()}
            disabled={confirmDisabled}
          >
            {labels.confirm}
          </button>
        </div>
      </div>
    </dialog>
  );
}
