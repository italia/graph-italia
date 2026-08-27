import { useEffect, useState } from "react";
import { FaCheck, FaChevronDown } from "react-icons/fa6";

export type EditStepStatus = "completed" | "active" | "locked";

const CIRCLE_CLASSES: Record<EditStepStatus | "default", string> = {
  completed: "bg-success text-success-content",
  active: "bg-primary text-primary-content",
  locked: "bg-base-200 text-base-content/60",
  default: "bg-primary/10 text-primary",
};

/**
 * Collapsible step card built on the disclosure pattern (button with
 * aria-expanded controlling a panel) instead of <details>/<summary>: the
 * native disclosure marker gets announced by screen readers as a triangle,
 * while here only the heading and the expanded/collapsed state are exposed
 * (WCAG 1.1.1). The chevron is purely decorative.
 */
export default function EditStepComponent(props: {
  title: string;
  description?: string;
  Icon: React.ElementType;
  children: React.ReactNode;
  isOpen: boolean;
  isDisabled: boolean;
  index: number;
  stepNumber?: number;
  status?: EditStepStatus;
  srStatusLabel?: string;
  headingRef?: React.Ref<HTMLHeadingElement>;
}) {
  const { title, description, Icon, children, isOpen, index, isDisabled, stepNumber, status, srStatusLabel, headingRef } = props;
  const circleClass = CIRCLE_CLASSES[status ?? "default"];
  const activeBorder = status === "active" ? "border-l-4 border-l-primary" : "";
  // The parent drives the open state on step transitions; in between the user
  // can toggle the card manually.
  const [open, setOpen] = useState(isOpen);
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  const panelId = `edit-step-panel-${index}`;

  return (
    <section className={`rounded-box bg-base-100 border border-base-300 transition-opacity ${activeBorder} ${isDisabled ? "opacity-60" : ""}`}>
      <h2 ref={headingRef} tabIndex={-1} className="m-0">
        <button
          type="button"
          className="w-full flex items-center justify-between gap-3 p-4 text-left font-semibold cursor-pointer disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-primary"
          aria-expanded={open}
          aria-controls={panelId}
          disabled={isDisabled}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex items-center gap-3">
            <span
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${circleClass}`}
              aria-hidden="true"
            >
              <span className="font-bold">
                {status === "completed" ? (
                  <FaCheck />
                ) : stepNumber != null ? (
                  stepNumber
                ) : (
                  <Icon />
                )}
              </span>
            </span>
            <span>
              <span className="card-title text-xl">
                {stepNumber != null && (
                  <span className="sr-only">{stepNumber}. </span>
                )}
                {title}
                {srStatusLabel && (
                  <span className="sr-only"> ({srStatusLabel})</span>
                )}
              </span>
              <span className="block text-base font-normal text-base-content/60">
                {description || ""}
              </span>
            </span>
          </span>
          <FaChevronDown
            aria-hidden="true"
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </h2>
      <div id={panelId} className={`${open ? "block" : "hidden"} px-4 pb-4 text-base`}>
        {children}
      </div>
    </section>
  );
}
