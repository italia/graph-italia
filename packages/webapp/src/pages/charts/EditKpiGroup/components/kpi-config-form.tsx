import { ChartConfigType } from "dataviz-components";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";

type KpiGroupConfigType = Pick<
  ChartConfigType,
  | "direction"
  | "h"
  | "labeLine"
  | "legend"
  | "legendPosition"
  | "palette"
  | "tooltip"
  | "tooltipFormatter"
  | "valueFormatter"
  | "totalLabel"
  | "tooltipTrigger"
  | "colors"
  | "background"
>;

const defaultValues: KpiGroupConfigType = {
  direction: "vertical",
  h: 0,
  labeLine: false,
  legend: false,
  legendPosition: "",
  palette: [] as string[],
  tooltip: false,
  tooltipFormatter: "",
  valueFormatter: "",
  totalLabel: "",
  tooltipTrigger: "",
  colors: [],
  background: "skyblue",
};

export type KpiGroupConfigFormValues = typeof defaultValues;

export interface KpiConfigFormHandle {
  getFormData: () => KpiGroupConfigFormValues;
  resetForm: () => void;
}

const KpiConfigForm = forwardRef<
  KpiConfigFormHandle,
  { config: KpiGroupConfigType }
>((props, ref) => {
  const { register, control, reset, getValues, watch, setValue } = useForm({
    defaultValues: {
      ...defaultValues,
      ...props.config,
    },
  });

  const legendValue = watch("legend");
  const tooltipValue = watch("tooltip");

  useEffect(() => {
    if (!legendValue) {
      setValue("legendPosition", "");
    }
  }, [legendValue, setValue]);

  useEffect(() => {
    if (!tooltipValue) {
      setValue("tooltipFormatter", "");
      setValue("tooltipTrigger", "");
    }
  }, [tooltipValue, setValue]);

  useImperativeHandle(ref, () => ({
    getFormData: () => getValues(),
    resetForm: () => reset(),
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Configurazione Kpi Group
        </h1>

        <div className="space-y-6">
          {/* Direction - register */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orientamento
            </label>
            <select
              {...register("direction")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="vertical">Verticale</option>
              <option value="horizontal">Orizzontale</option>
            </select>
          </div>

          {/* Height - register con valueAsNumber */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Altezza (h)
            </label>
            <input
              {...register("h", { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* LabelLine - register */}
          <div className="flex items-center">
            <input
              {...register("labeLine")}
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Label Line
            </label>
          </div>

          {/* Legend - register */}
          <div className="flex items-center">
            <input
              {...register("legend")}
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Legenda
            </label>
          </div>

          {/* Legend Position - register - visible only when legend is true */}
          {legendValue && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posizione Legenda
              </label>
              <select
                {...register("legendPosition")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Nessuna</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          )}

          {/* Palette - Controller per trasformazione array */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Palette (comma separated)
            </label>
            <Controller
              name="palette"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  value={
                    Array.isArray(field.value)
                      ? field.value.join(", ")
                      : field.value
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="es: red, blue, green"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
          </div>

          {/* Tooltip - register */}
          <div className="flex items-center">
            <input
              {...register("tooltip")}
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Tooltip
            </label>
          </div>

          {/* Tooltip Formatter - register - visible only when tooltip is true */}
          {tooltipValue && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tooltip Formatter
              </label>
              <input
                {...register("tooltipFormatter")}
                type="text"
                placeholder="es: {b}: {c}"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Tooltip Trigger - register - visible only when tooltip is true */}
          {tooltipValue && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tooltip Trigger
              </label>
              <select
                {...register("tooltipTrigger")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Nessuno</option>
                <option value="item">Item</option>
                <option value="axis">Axis</option>
              </select>
            </div>
          )}

          {/* Value Formatter - register */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value Formatter
            </label>
            <input
              {...register("valueFormatter")}
              type="text"
              placeholder="es: {c}%"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Total Label - register */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Label Totale
            </label>
            <input
              {...register("totalLabel")}
              type="text"
              placeholder="es: Totale"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Colors - Controller per trasformazione array */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colori (separati dalla virgola)
            </label>
            <Controller
              name="colors"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  value={field.value.join(", ")}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="es: #ff0000, #00ff00, #0000ff"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
          </div>

          {/* Background - Controller per sincronizzare text e color input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background
            </label>
            <Controller
              name="background"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="color"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

KpiConfigForm.displayName = "KpiConfigForm";

export default KpiConfigForm;
