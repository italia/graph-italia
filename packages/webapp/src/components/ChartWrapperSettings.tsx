import { useTranslation } from "react-i18next";
import {
  WRAPPER_FLAGS,
  type ChartWrapperSettings as Settings,
  type WrapperFlagKey,
  type WrapperTextKey,
} from "../lib/chartWrapper";

type Props = {
  value: Settings;
  onChange: (value: Settings) => void;
  /** Shown as placeholders: empty title and subtitle fall back on them. */
  chartName: string;
  chartDescription: string;
};

const TEXT_FIELDS: { key: WrapperTextKey; multiline: boolean }[] = [
  { key: "title", multiline: false },
  { key: "subTitle", multiline: true },
  { key: "text", multiline: true },
  { key: "sourceTextInfo", multiline: false },
  { key: "chartFooterText", multiline: true },
];

/**
 * "Show with wrapper" switch and, when on, the wrapper texts and the switches
 * of its buttons and features. Part of the chart editor's Info step.
 */
export default function ChartWrapperSettings({ value, onChange, chartName, chartDescription }: Props) {
  const { t } = useTranslation("pages", { keyPrefix: "charts.editChart.body.options.setup.form.wrapper" });
  const set = <K extends keyof Settings>(key: K, v: Settings[K]) => onChange({ ...value, [key]: v });
  const placeholders: Partial<Record<WrapperTextKey, string>> = {
    title: chartName,
    subTitle: chartDescription,
  };

  return (
    <fieldset className="mt-6 flex flex-col space-y-2">
      <legend className="sr-only">{t("legend")}</legend>
      <div className="flex items-center gap-4">
        <input
          id="chart_wrapper_enabled"
          type="checkbox"
          role="switch"
          checked={value.enabled}
          aria-describedby="chart_wrapper_enabled_hint"
          aria-controls="chart_wrapper_options"
          onChange={() => set("enabled", !value.enabled)}
          className="toggle toggle-sm toggle-primary cursor-pointer"
        />
        <label htmlFor="chart_wrapper_enabled" className="text-base text-base-content/70 cursor-pointer">
          {t("enabled.label")}
        </label>
      </div>
      <p id="chart_wrapper_enabled_hint" className="text-sm text-base-content/70">
        {t("enabled.hint")}
      </p>

      {value.enabled && (
        <div id="chart_wrapper_options" className="flex flex-col space-y-2 border-l-2 border-base-300 pl-4">
          {TEXT_FIELDS.map(({ key, multiline }) => {
            const id = `chart_wrapper_${key}`;
            const common = {
              id,
              value: value[key] ?? "",
              placeholder: placeholders[key] || t(`fields.${key}.placeholder`),
              "aria-describedby": `${id}_hint`,
            };
            return (
              <div key={key} className="flex flex-col space-y-1 mt-2">
                <label htmlFor={id} className="text-base-content/70">
                  {t(`fields.${key}.label`)}
                </label>
                <p id={`${id}_hint`} className="text-sm text-base-content/70">
                  {t(`fields.${key}.hint`)}
                </p>
                {multiline ? (
                  <textarea
                    {...common}
                    rows={3}
                    onChange={(e) => set(key, e.target.value)}
                    className="input textarea input-bordered w-full text-base bg-base-100 placeholder:text-base-content/65"
                  />
                ) : (
                  <input
                    {...common}
                    type="text"
                    onChange={(e) => set(key, e.target.value)}
                    className="input input-bordered py-2 px-3 w-full text-base bg-base-100 placeholder:text-base-content/65"
                  />
                )}
              </div>
            );
          })}

          <p className="mt-4 text-base-content/70">{t("flags.heading")}</p>
          {WRAPPER_FLAGS.map(({ key }: { key: WrapperFlagKey }) => {
            const id = `chart_wrapper_${key}`;
            return (
              <div key={key} className="flex items-center gap-4">
                <input
                  id={id}
                  type="checkbox"
                  role="switch"
                  checked={value[key] === true}
                  onChange={() => set(key, !value[key])}
                  className="toggle toggle-sm toggle-primary cursor-pointer"
                />
                <label htmlFor={id} className="text-base text-base-content/70 cursor-pointer">
                  {t(`flags.${key}`)}
                </label>
              </div>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}
