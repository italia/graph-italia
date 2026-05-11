import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type KpiFormValues = {
  title: string;
  openDataPath?: string;
  show_flow?: boolean;
  flow_direction?: "+" | "-";
  flow_value?: string;
  flow_detail?: string;
  value: string;
  background_color?: string;
  value_prefix?: string;
  value_suffix?: string;
  percentage?: string;
  footer_text?: string;
};

export const KPI_FORM_ID = "kpi-form";

const defaultValues: KpiFormValues = {
  title: "",
  value: "",
  flow_direction: "+",
};

export function KpiForm({
  initialValues = {},
  onSubmit,
}: {
  initialValues?: Partial<KpiFormValues>;
  onSubmit?: (data: KpiFormValues) => void;
}) {
  const { t } = useTranslation("pages", {
    keyPrefix: "charts.editKpiGroup.components.kpiForm",
  });
  const { register, handleSubmit, watch } = useForm<KpiFormValues>({
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
  });

  const showFlow = watch("show_flow");

  const onSubmitHandler = (data: KpiFormValues) => {
    console.log(data);
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <div className="w-full">
      <form
        id={KPI_FORM_ID}
        onSubmit={handleSubmit(onSubmitHandler)}
        className="w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            {/* Title */}

            <div>
              <label htmlFor="title" className="label">
                <span className="label-text font-medium">
                  {t("form.fields.title.label")} *
                </span>
              </label>
            </div>
            <div>
              <input
                id="title"
                type="text"
                required
                className="input input-bordered"
                {...register("title", { required: true })}
              />
            </div>

            <div>
              <label htmlFor="value" className="label">
                <span className="label-text font-medium">
                  {t("form.fields.value.label")} *
                </span>
              </label>
            </div>
            <div>
              <input
                id="value"
                type="text"
                className="input input-bordered"
                {...register("value", { required: true })}
              />
            </div>

            <div>
              <label htmlFor="footer_text" className="label">
                <span className="label-text font-medium">
                  {t("form.fields.footerText.label")}
                </span>
              </label>
            </div><div>
              <input
                id="footer_text"
                type="text"
                className="input input-bordered"
                {...register("footer_text")}
              />
            </div>
            {/* <div>

              <label htmlFor="path" className="label">
                <span className="label-text font-medium">
                  {t("form.fields.openDataPath.label")}
                </span>
              </label>
            </div>
            <div>
              <input
                id="path"
                type="text"
                className="input input-bordered"
                {...register("openDataPath")}
              />
            </div> */}
          </div>

          {/* Info aggiuntive */}
          <div className="">

            {/* Mostra andamento */}
            <div className="mb-4">
              <label htmlFor="show_flow" className="flex items-center space-x-3 cursor-pointer">
                <input
                  id="show_flow"
                  type="checkbox"
                  className="toggle toggle-primary"
                  {...register("show_flow")}
                />
                <span className="text-sm font-medium text-content/70">
                  {t("form.fields.showFlow.label")}
                </span>
              </label>
            </div>


            <div className="mb-4">
              <div>
                <label htmlFor="direction" className="label">
                  <span className="label-text font-medium">
                    {t("form.fields.flowDirection.label")}
                  </span>
                </label>
              </div>
              <div>
                <select
                  id="direction"
                  className="input input-bordered"
                  {...register("flow_direction")}
                  disabled={!showFlow}
                >
                  <option>
                    {t("form.fields.flowDirection.values.noValue")}
                  </option>
                  <option value="+">
                    {" "}
                    {t("form.fields.flowDirection.values.positive")}
                    (+)
                  </option>
                  <option value="-">
                    {t("form.fields.flowDirection.values.negative")} (-)
                  </option>
                </select>
              </div>
            </div>

            {/* Valore andamento */}
            <div className="mb-4">
              <div>
                <label htmlFor="flow_value" className="label">
                  <span className="label-text font-medium">
                    {t("form.fields.flowValue.label")}
                  </span>
                </label>
              </div>
              <div>
                <input
                  id="flow_value"
                  type="text"
                  disabled={!showFlow}
                  className="input input-bordered"
                  {...register("flow_value")}
                />
              </div>
            </div>

            {/* Dettaglio andamento */}
            <div className="mb-6">

              <div>
                <label htmlFor="flow_detail" className="label">
                  <span className="label-text font-medium">
                    {t("form.fields.flowDetail.label")}
                  </span>
                </label>
              </div>
              <div>
                <input
                  id="flow_detail"
                  type="text"
                  disabled={!showFlow}
                  className="input input-bordered"
                  {...register("flow_detail")}
                />
              </div>

            </div>
          </div>

          {/* Altri campi */}
          <div className="space-y-2">
            {/* <div>
              <label htmlFor="bg" className="label">
                <span className="label-text font-medium">
                  {t("form.fields.backgroundColor.label")}
                </span>
              </label>
              <input
                id="bg"
                type="text"
                className="input input-bordered"
                {...register("background_color")}
              />
            </div> */}

            <div>
              <label htmlFor="value_prefix" className="label">
                <span className="label-text font-medium">
                  {t("form.fields.valuePrefix.label")}
                </span>
              </label>
            </div><div>
              <input
                id="value_prefix"
                type="text"
                className="input input-bordered"
                {...register("value_prefix")}
              />
            </div>

            <div>
              <label htmlFor="value_suffix" className="label">
                <span className="label-text font-medium">
                  {t("form.fields.valueSuffix.label")}
                </span>
              </label>
            </div><div>
              <input
                id="value_suffix"
                type="text"
                className="input input-bordered"
                {...register("value_suffix")}
              />
            </div>

            <div>
              <label htmlFor="percentage" className="label">
                <span className="label-text font-medium">
                  {t("form.fields.percentage.label")}
                </span>
              </label>
            </div><div>
              <input
                id="percentage"
                type="text"
                className="input input-bordered"
                {...register("percentage")}
              />
            </div>


          </div>
        </div>
      </form >
    </div >
  );
}
