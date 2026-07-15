import { FaCheck } from "react-icons/fa6";

export type EditStepStatus = "completed" | "active" | "locked";

const CIRCLE_CLASSES: Record<EditStepStatus | "default", string> = {
  completed: "bg-success text-success-content",
  active: "bg-primary text-primary-content",
  locked: "bg-base-200 text-base-content/60",
  default: "bg-primary/10 text-primary",
};

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
  return (
    <details className={`collapse collapse-arrow bg-base-100 border border-base-300 transition-opacity ${activeBorder} ${isDisabled ? "opacity-60" : ""}`} name={`my-accordion-det-${index}`} aria-disabled={isDisabled} open={isOpen}>
      <summary className="collapse-title font-semibold">
        <div className="flex items-center gap-3 mb-4">
          <div
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
          </div>
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="card-title text-xl">
              {stepNumber != null && (
                <span className="sr-only">{stepNumber}. </span>
              )}
              {title}
              {srStatusLabel && (
                <span className="sr-only"> ({srStatusLabel})</span>
              )}
            </h2>
            <p className="text-sm text-base-content/60">
              {description || ""}
            </p>
          </div>
        </div>
      </summary>
      <div className="collapse-content text-sm ">
        {children}
      </div>
    </details>
  );
}
