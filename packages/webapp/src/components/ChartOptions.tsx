import { useForm } from "react-hook-form";
import { palettes, getFields, defaultConfig } from "../lib/constants";
import { getAvailablePalettes, getMapPalettes } from "../lib/utils";
import ShowPalette from "./ShowPalette";

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
    return <div className='my-5'>Please choose a chart type</div>;
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
    <div className='bg-base-200 p-4 rounded-box'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='my-5'>
          <button className='btn btn-primary w-full' type='submit'>
            Apply Changes
          </button>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          {filteredFields.map((field) => {
            if (["text", "email", "number", "color"].includes(field.type)) {
              let style = {};
              if (field.layout) {
                style = { gridColumn: `span ${field.layout}` };
              }
              let label = field.label;
              if (
                (field.name === "xLabel" || field.name === "yLabel") &&
                watchDirection === "horizontal"
              ) {
                label =
                  field.name === "xLabel"
                    ? field.label.replace("X", "Y")
                    : field.label.replace("Y", "X");
              }
              return (
                <div key={field.name} style={style}>
                  <label className='label'>{label}</label>
                  <div>
                    <input
                      className='input'
                      type={field.type}
                      {...field.otherProps}
                      {...register(field.name, { required: field.required })}
                    />
                  </div>
                  {errors[field.name] && (
                    <span className='bg-danger'>This field is required</span>
                  )}
                </div>
              );
            } else if (["checkbox"].includes(field.type)) {
              let style = {};
              if (field.layout) {
                style = { gridColumn: `span ${field.layout}` };
              }
              return (
                <div key={field.name} style={style}>
                  <label className='label'>{field.label}</label>
                  <div>
                    <input
                      className='checkbox'
                      type='checkbox'
                      {...field.otherProps}
                      {...register(field.name, { required: field.required })}
                    />
                  </div>
                  {errors[field.name] && (
                    <span className='bg-danger'>This field is required</span>
                  )}
                </div>
              );
            } else if (["select"].includes(field.type)) {
              let style = {};
              if (field.layout) {
                style = { gridColumn: `span ${field.layout}` };
              }
              return (
                <div key={field.name} style={style}>
                  <div>{field.label}</div>
                  <select
                    className='input select'
                    style={{ width: "80%" }}
                    {...field.otherProps}
                    {...register(field.name, { required: field.required })}
                  >
                    {field.options.map((option: string) => {
                      return (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      );
                    })}
                  </select>
                  {errors[field.name] && (
                    <span className='bg-danger'>This field is required</span>
                  )}
                  {field.name === "palette" && watchPalette && (
                    <>
                      <ShowPalette palette={palettes[watchPalette]} />
                    </>
                  )}
                </div>
              );
            } else {
              let style = {
                marginTop: 10,
                gridColumn: "span 2",
                fontWeight: "bold",
                fontSize: 16,
              };
              return (
                <>
                  <div style={style}>
                    <span className='badge badge-neutral badge-lg'>
                      {field.name}
                    </span>
                  </div>
                </>
              );
            }
          })}
        </div>
        <div className='my-5'>
          <button className='btn btn-primary w-full' type='submit'>
            Apply Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChartOptions;
