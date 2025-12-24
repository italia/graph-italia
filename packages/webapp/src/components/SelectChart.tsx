// Available chart types with icons and descriptions
const CHART_TYPES = [
  {
    value: "bar",
    label: "Bar chart",
    description: "Compare values across categories",
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
    label: "Line chart",
    description: "Show trends over time",
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
    label: "Pie chart",
    description: "Display proportions",
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
    label: "Geographic map",
    description: "Display data on a map",
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
  return (
    <div className="space-y-3">
      <label className="label">
        <span className="label-text font-medium">Chart type</span>
      </label>

      {/* Chart type selection grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CHART_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setChart(type.value)}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
              chart === type.value
                ? "border-primary bg-primary/5 text-primary"
                : "border-base-200 bg-base-100 text-base-content/70 hover:bg-base-50"
            }`}
          >
            <div
              className={`${
                chart === type.value ? "text-primary" : "text-base-content/50"
              }`}
            >
              {type.icon}
            </div>
            <span className="text-sm font-medium text-center">
              {type.label}
            </span>
          </button>
        ))}
      </div>

      {/* Selected type description */}
      {chart && (
        <p className="text-sm text-base-content/60 px-1">
          {CHART_TYPES.find((t) => t.value === chart)?.description}
        </p>
      )}
    </div>
  );
}

export default SelectChart;
