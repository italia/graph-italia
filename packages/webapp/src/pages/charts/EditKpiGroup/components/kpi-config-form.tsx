import type { ChartConfigType } from "dataviz-components";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
  background: "",
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
  const { t } = useTranslation("pages", {
    keyPrefix: "pages.charts.editKpiGroup.components.kpiConfigForm",
  });
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
    <div className="w-full">
      <div className="">
        <div className="p-6 space-y-6">
          {/* Direction - register */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                {t("form.fields.direction.label")}
              </span>
            </label>
            <select
              {...register("direction")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="vertical">
                {t("form.fields.direction.values.vertical")}
              </option>
              <option value="horizontal">
                {t("form.fields.direction.values.horizontal")}
              </option>
            </select>
          </div>

          {/* Height - register con valueAsNumber */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                {t("form.fields.height.label")}
              </span>
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
              <span className="label-text font-medium">
                {" "}
                {t("form.fields.labelLine.label")}
              </span>
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
              <span className="label-text font-medium">
                {" "}
                {t("form.fields.legend.label")}
              </span>
            </label>
          </div>

          {/* Legend Position - register - visible only when legend is true */}
          {legendValue && (
            <div>
              <label className="label">
                <span className="label-text font-medium">
                  {" "}
                  {t("form.fields.legendPosition.label")}
                </span>
              </label>
              <select
                {...register("legendPosition")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {t("form.fields.legendPosition.values.noValue")}
                </option>
                <option value="top">
                  {t("form.fields.legendPosition.values.top")}
                </option>
                <option value="bottom">
                  {t("form.fields.legendPosition.values.bottom")}
                </option>
                <option value="left">
                  {t("form.fields.legendPosition.values.left")}
                </option>
                <option value="right">
                  {t("form.fields.legendPosition.values.right")}
                </option>
              </select>
            </div>
          )}

          {/* Palette - Controller per trasformazione array */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                {t("form.fields.palette.label")}
              </span>
            </label>
            <Controller
              name="palette"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(",").map((s) => s.trim()),
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
            <label className="label">
              <span className="label-text font-medium">
                {t("form.fields.tooltip.label")}
              </span>
            </label>
          </div>

          {/* Tooltip Formatter - register - visible only when tooltip is true */}
          {tooltipValue && (
            <div>
              <label className="label">
                <span className="label-text font-medium">
                  {t("form.fields.tooltipFormatter.label")}
                </span>
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
              <label className="label">
                <span className="label-text font-medium">
                  {t("form.fields.tooltipTrigger.label")}
                </span>
              </label>
              <select
                {...register("tooltipTrigger")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {t("form.fields.tooltipTrigger.values.noValue")}
                </option>
                <option value="item">
                  {t("form.fields.tooltipTrigger.values.item")}
                </option>
                <option value="axis">
                  {t("form.fields.tooltipTrigger.values.axis")}
                </option>
              </select>
            </div>
          )}

          {/* Value Formatter - register */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                {t("form.fields.valueFormatter.label")}
              </span>
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
            <label className="label">
              <span className="label-text font-medium">
                {t("form.fields.totalLabel.label")}
              </span>
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
            <label className="label">
              <span className="label-text font-medium">
                {t("form.fields.colors.label")}
              </span>
            </label>
            <Controller
              name="colors"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  value={field.value.join(",")}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(",").map((s) => s.trim()),
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
            <label className="label">
              <span className="label-text font-medium">
                {t("form.fields.background.label")}
              </span>
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
                    value={field.value || "#FFFFFF"}
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
