import { useForm } from "react-hook-form";

export type KpiGroupFormValues = {
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

const defaultValues: KpiGroupFormValues = {
  title: "",
  value: "",
};

export function KpiGroupForm({
  initialValues = {},
  onSubmit,
}: {
  initialValues?: Partial<KpiGroupFormValues>;
  onSubmit?: (data: KpiGroupFormValues) => void;
}) {
  const { register, handleSubmit, watch } = useForm<KpiGroupFormValues>({
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
  });

  const showFlow = watch("show_flow");

  const onSubmitHandler = (data: KpiGroupFormValues) => {
    console.log(data);
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form
      id="kpi-group-form"
      onSubmit={handleSubmit(onSubmitHandler)}
      className="w-full"
    >
      <div className="">
        <div className="">
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Title *</span>
              </label>
              <input
                type="text"
                required
                className="input input-bordered w-full"
                {...register("title", { required: true })}
              />
            </div>

            {/* Open Data Path */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Open Data Path</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                {...register("openDataPath")}
              />
            </div>

            {/* Info aggiuntive */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Info aggiuntive
              </h3>

              {/* Mostra andamento */}
              <div className="mb-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      {...register("show_flow")}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors">
                      {" "}
                    </div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5">
                      {" "}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Mostra andamento
                  </span>
                </label>
              </div>

              {/* Direzione andamento */}
              <div className="mb-4">
                <label className="label">
                  <span className="label-text font-medium">
                    Direzione andamento
                  </span>
                </label>
                <select
                  className="input input-bordered w-full"
                  {...register("flow_direction")}
                  disabled={!showFlow}
                >
                  <option>--Seleziona un valore--</option>
                  <option value="+">Positivo (+)</option>
                  <option value="-">Negativo (-)</option>
                </select>
              </div>

              {/* Valore andamento */}
              <div className="mb-4">
                <label className="label">
                  <span className="label-text font-medium">
                    Valore andamento
                  </span>
                </label>
                <input
                  type="text"
                  disabled={!showFlow}
                  className="input input-bordered w-full"
                  {...register("flow_value")}
                />
              </div>

              {/* Dettaglio andamento */}
              <div className="mb-6">
                <label className="label">
                  <span className="label-text font-medium">
                    Dettaglio andamento
                  </span>
                </label>
                <input
                  type="text"
                  disabled={!showFlow}
                  className="input input-bordered w-full"
                  {...register("flow_detail")}
                />
              </div>
            </div>

            {/* Altri campi */}
            <div className="space-y-4 border-t pt-6">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Valore *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...register("value", { required: true })}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Colore sfondo</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...register("background_color")}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Prefisso valore
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...register("value_prefix")}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Suffisso valore
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...register("value_suffix")}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Percentuale</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...register("percentage")}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Testo footer</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...register("footer_text")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
