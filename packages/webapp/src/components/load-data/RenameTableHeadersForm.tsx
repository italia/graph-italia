import { useState } from "react";
import { useTranslation } from "react-i18next";

type RenameTableHeadersFormProps = {
  initialValues: string[];
  onApply: (values: string[]) => void;
  onCancel: () => void;
};

export default function RenameTableHeadersForm({
  initialValues,
  onApply,
  onCancel,
}: RenameTableHeadersFormProps) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.dataMngTable.renameForm",
  });
  const [values, setValues] = useState<string[]>(initialValues);

  return (
    <div className="mt-4 p-4 rounded-lg border border-base-300 bg-base-200">
      <h4 className="text-base mb-3">{t("title")}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {values.map((val, i) => (
          <div key={i} className="form-control">
            <label htmlFor={`col-rename-${i}`} className="label py-0.5">
              <span className="label-text text-xs text-base-content/50">
                {t("column")} {i + 1}
              </span>
            </label>
            <input
              id={`col-rename-${i}`}
              type="text"
              value={val}
              onChange={(e) => {
                const updated = [...values];
                updated[i] = e.target.value;
                setValues(updated);
              }}
              className="input input-sm input-bordered w-full"
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onApply(values)}
        >
          {t("actions.apply.label")}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onCancel}
        >
          {t("actions.cancel.label")}
        </button>
      </div>
    </div>
  );
}
