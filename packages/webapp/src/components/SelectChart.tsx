import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa6";

// Available chart types with icons and descriptions
const CHART_TYPES = [
  {
    value: "bar",
    label: "chartTypes.bar.label",
    description: "chartTypes.bar.description",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    value: "line",
    label: "chartTypes.line.label",
    description: "chartTypes.line.description",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4v16"
        />
      </svg>
    ),
  },
  {
    value: "pie",
    label: "chartTypes.pie.label",
    description: "chartTypes.pie.description",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
        />
      </svg>
    ),
  },
  {
    value: "map",
    label: "chartTypes.map.label",
    description: "chartTypes.map.description",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
  },
];

function SelectChart({
  chart,
  setChart,
}: {
  chart?: string;
  setChart: Function;
}) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.selectChart",
  });
  return (
    <fieldset className="space-y-3 border-none p-0 m-0">
      <legend className="label">
        <span className="label-text font-medium">
          {t("fieldset.legend.label")}
        </span>
      </legend>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CHART_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setChart(type.value)}
            aria-pressed={chart === type.value}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
              chart === type.value
                ? "border-primary bg-primary text-primary-content shadow-md"
                : "border-base-300 bg-base-100 text-base-content/80 hover:border-primary/60 hover:bg-primary/5"
            }`}
          >
            {chart === type.value && (
              <span
                aria-hidden="true"
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary-content text-primary flex items-center justify-center"
              >
                <FaCheck className="w-3 h-3" />
              </span>
            )}
            <div
              className={`${
                chart === type.value
                  ? "text-primary-content"
                  : "text-base-content/60"
              }`}
            >
              {type.icon}
            </div>
            <span className="text-sm font-semibold text-center">
              {t(type.label)}
            </span>
          </button>
        ))}
      </div>

      {chart && (
        <p className="text-sm text-base-content/60 px-1">
          {t(CHART_TYPES.find((t) => t.value === chart)?.description)}
        </p>
      )}
    </fieldset>
  );
}

export default SelectChart;
