export default function EditStepComponent(props: {
  title: string;
  description?: string;
  Icon: React.ElementType;
  children: React.ReactNode;
  isOpen: boolean;
  isDisabled: boolean;
  index: number;
  stepNumber?: number;
  headingRef?: React.Ref<HTMLHeadingElement>;
}) {
  const { title, description, Icon, children, isOpen, index, isDisabled, stepNumber, headingRef } = props;
  return (
    <details className="collapse collapse-arrow bg-base-100 border border-base-200 " name={`my-accordion-det-${index}`} aria-disabled={isDisabled} open={isOpen}>
      <summary className="collapse-title font-semibold">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-primary font-bold">
              {stepNumber != null ? stepNumber : <Icon />}
            </span>
          </div>
          <div>
            <h2 ref={headingRef} tabIndex={-1} className="card-title text-xl">
              {stepNumber != null && (
                <span className="sr-only">{stepNumber}. </span>
              )}
              {title}
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
