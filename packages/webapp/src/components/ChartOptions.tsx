import { useForm } from "react-hook-form";
import { defaultConfig, getFields, palettes } from "../lib/constants";
import { getAvailablePalettes, getMapPalettes } from "../lib/utils";
import ShowPalette from "./ShowPalette";

// Mappa per tradurre le label dei campi in italiano
const LABEL_TRANSLATIONS: Record<string, string> = {
  "Chart Title": "Titolo del grafico",
  "X Axis Label": "Etichetta asse X",
  "Y Axis Label": "Etichetta asse Y",
  "Show Legend": "Mostra legenda",
  "Legend Position": "Posizione legenda",
  "Show Tooltip": "Mostra tooltip",
  "Show Grid": "Mostra griglia",
  "Show Labels": "Mostra etichette",
  "Show Values": "Mostra valori",
  "Color Palette": "Palette colori",
  Direction: "Orientamento",
  Width: "Larghezza",
  Height: "Altezza",
  "Show Pie Labels": "Mostra etichette torta",
  "Visual Map": "Mappa visuale",
  Stacked: "Impilato",
  Smooth: "Linea curva",
};

// Mappa per tradurre i nomi delle sezioni
const SECTION_TRANSLATIONS: Record<string, string> = {
  Layout: "Layout",
  Style: "Stile",
  Labels: "Etichette",
  Legend: "Legenda",
  Tooltip: "Tooltip",
  Grid: "Griglia",
  Colors: "Colori",
  Options: "Opzioni",
};

function translateLabel(label: string): string {
  return LABEL_TRANSLATIONS[label] || label;
}

function translateSection(name: string): string {
  return SECTION_TRANSLATIONS[name] || name;
}

function ChartOptions({
  config,
  setConfig,
  chart,
  numSeries,
}: {
  config: any;
  setConfig: (c: any) => void;
  chart: string;
  numSeries: number;
}) {
  const availabelPalettes =
    chart === "map" ? getMapPalettes() : getAvailablePalettes(numSeries);
  const defaultPalette = availabelPalettes[0];
  const fields = getFields(availabelPalettes, defaultPalette);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      ...defaultConfig,
      palette: defaultPalette,
      ...config,
    },
  });
  const watchPalette = watch("palette", config?.palette || defaultPalette);
  const watchDirection = watch("direction", null);
  const watchToltip = watch("tooltip", true);
  const watchLegend = watch("legend", true);
  const watchShowPieLabels = watch("showPieLabels", true);
  const watchVisualMap = watch("visualMap", true);

  const onSubmit = (data: any) => {
    const { h, w, palette, ...rest } = data;
    const colors = palettes[palette];
    const newConfig = { h: Number(h), w: Number(w), ...rest, colors, palette };
    setConfig(newConfig);
  };

  if (!chart) {
    return (
      <div className="alert alert-info my-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>Seleziona un tipo di grafico per configurare le opzioni</span>
      </div>
    );
  }

  let filteredFields = fields.filter((field) =>
    field.chartType.includes(chart)
  );
  if (!watchToltip) {
    filteredFields = filteredFields.filter(
      (field) => field.dependsOn !== "tooltip"
    );
  }
  if (!watchLegend) {
    filteredFields = filteredFields.filter(
      (field) => field.dependsOn !== "legend"
    );
  }
  if (!watchShowPieLabels) {
    filteredFields = filteredFields.filter(
      (field) => field.dependsOn !== "showPieLabels"
    );
  }
  if (!watchVisualMap) {
    filteredFields = filteredFields.filter(
      (field) => field.dependsOn !== "visualMap"
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Pulsante Applica in alto */}
        <div className="sticky top-0 bg-base-100 py-3 z-10 border-b border-base-200 mb-4">
          <button className="btn btn-primary w-full gap-2" type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Applica modifiche
          </button>
        </div>

        {/* Griglia campi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredFields.map((field) => {
            // Campi di input testo, numero, colore
            if (["text", "email", "number", "color"].includes(field.type)) {
              const layoutValue = field.layout ? Number(field.layout) : 1;
              const gridSpan = layoutValue === 2 ? "sm:col-span-2" : "";

              let label = translateLabel(field.label);
              if (
                (field.name === "xLabel" || field.name === "yLabel") &&
                watchDirection === "horizontal"
              ) {
                label =
                  field.name === "xLabel"
                    ? label.replace("X", "Y")
                    : label.replace("Y", "X");
              }
              return (
                <div key={field.name} className={`form-control ${gridSpan}`}>
                  <label className="label">
                    <span className="label-text font-medium">{label}</span>
                  </label>
                  <input
                    className="input input-bordered w-full"
                    type={field.type}
                    {...field.otherProps}
                    {...register(field.name, { required: field.required })}
                  />
                  {errors[field.name] && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        Campo obbligatorio
                      </span>
                    </label>
                  )}
                </div>
              );
            }

            // Campi checkbox
            if (["checkbox"].includes(field.type)) {
              const layoutValue = field.layout ? Number(field.layout) : 1;
              const gridSpan = layoutValue === 2 ? "sm:col-span-2" : "";

              return (
                <div key={field.name} className={`form-control ${gridSpan}`}>
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      className="checkbox checkbox-primary"
                      type="checkbox"
                      {...field.otherProps}
                      {...register(field.name, { required: field.required })}
                    />
                    <span className="label-text font-medium">
                      {translateLabel(field.label)}
                    </span>
                  </label>
                  {errors[field.name] && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        Campo obbligatorio
                      </span>
                    </label>
                  )}
                </div>
              );
            }

            // Campi select
            if (["select"].includes(field.type)) {
              const layoutValue = field.layout ? Number(field.layout) : 1;
              const gridSpan = layoutValue === 2 ? "sm:col-span-2" : "";

              return (
                <div key={field.name} className={`form-control ${gridSpan}`}>
                  <label className="label">
                    <span className="label-text font-medium">
                      {translateLabel(field.label)}
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    {...field.otherProps}
                    {...register(field.name, { required: field.required })}
                  >
                    {field.options.map((option: string) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors[field.name] && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        Campo obbligatorio
                      </span>
                    </label>
                  )}
                  {field.name === "palette" && watchPalette && (
                    <div className="mt-2">
                      <ShowPalette palette={palettes[watchPalette]} />
                    </div>
                  )}
                </div>
              );
            }

            // Separatori di sezione
            return (
              <div key={field.name} className="col-span-full mt-4 first:mt-0">
                <div className="flex items-center gap-2">
                  <span className="badge badge-neutral">
                    {translateSection(field.name)}
                  </span>
                  <div className="flex-1 h-px bg-base-200"></div>
                </div>
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
}

export default ChartOptions;
