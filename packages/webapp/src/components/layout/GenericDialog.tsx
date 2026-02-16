import { type ReactNode, useCallback, useEffect, useRef } from "react";

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
 * GenericDialog - Modal Component following Italian Design System guidelines
 * @see https://designers.italia.it/design-system/componenti/modal/
 *
 * Features:
 * - Title with h2 for accessibility (content separated from page structure)
 * - Close button (X) at top right
 * - Action buttons at bottom right (Cancel on left, Confirm on right)
 * - Dark overlay to highlight the modal
 * - Close by clicking outside the modal
 */
export default function GenericDialog({
  title,
  description,
  children,
  toggle,
  confirmCb,
  cancelCb,
  labels = {
    confirm: "Confirm",
    cancel: "Cancel",
  },
  confirmDisabled = false,
}: GenericDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // Handle closing with ESC and click outside
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

  // Handle ESC key
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
        {/* Close button (X) at top right - Italian Design guideline */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
          onClick={() => cancelCb()}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Title with h2 for accessibility - Italian Design guideline */}
        <h2 id="modal-title" className="font-bold text-xl pr-8">
          {title}
        </h2>

        {/* Optional description */}
        {description && (
          <p
            id="modal-description"
            className="text-sm text-base-content/70 mt-2"
          >
            {description}
          </p>
        )}

        {/* Modal content */}
        <div className="py-4">{children}</div>

        {/* Action buttons - Positioned at bottom right as per Italian Design guidelines */}
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
