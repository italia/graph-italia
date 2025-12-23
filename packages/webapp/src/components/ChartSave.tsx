import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as api from "../lib/api";

function ChartSave({ item, handleSave }: any) {
  const navigate = useNavigate();
  const defaultName = `${item.chart}chart-${dayjs(Date.now()).format(
    "YYYY-MM-DD_HH-mm"
  )}`;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      id: item?.id || "",
      name: item?.name || defaultName,
      description: item?.description || "",
      publish: item?.id ? item?.publish : true,
    },
  });

  function saveChart(formData: any) {
    const { id = "", name, description = "", publish = false } = formData;
    const payload = {
      name,
      description,
      publish,
      chart: item.chart || "bar",
      config: item.config,
      data: item.data,
      isRemote: item.isRemote,
      remoteUrl: item.remoteUrl,
    };
    return api.upsertChart(payload, id);
  }

  const onSubmit = async (formData: any) => {
    const result = await saveChart(formData);
    if (result) {
      handleSave();
      navigate("/home");
    }
  };

  if (!item.chart) {
    return (
      <div className="alert alert-warning my-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>Seleziona prima un tipo di grafico</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Anteprima immagine se disponibile */}
      {item.preview && (
        <div className="flex justify-center">
          <div className="border border-base-200 rounded-lg p-2 bg-white shadow-sm">
            <img
              src={item.preview}
              alt="Anteprima grafico"
              className="max-w-[200px] h-auto rounded"
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("id", { required: false })} />

        {/* Nome del grafico */}
        <div className="form-control">
          <label className="label" htmlFor="chart-name">
            <span className="label-text font-medium">Nome del grafico *</span>
          </label>
          <input
            id="chart-name"
            type="text"
            className={`input input-bordered w-full ${
              errors["name"] ? "input-error" : ""
            }`}
            placeholder="Es: Vendite mensili 2024"
            {...register("name", { required: true })}
          />
          {errors["name"] && (
            <label className="label">
              <span className="label-text-alt text-error">
                Il nome è obbligatorio
              </span>
            </label>
          )}
        </div>

        {/* Descrizione */}
        <div className="form-control">
          <label className="label" htmlFor="chart-description">
            <span className="label-text font-medium">Descrizione</span>
            <span className="label-text-alt text-base-content/50">
              Opzionale
            </span>
          </label>
          <textarea
            id="chart-description"
            {...register("description", { required: false })}
            className="textarea textarea-bordered w-full min-h-[80px]"
            placeholder="Aggiungi una descrizione per il tuo grafico..."
          />
        </div>

        {/* Opzione pubblica */}
        <div className="form-control bg-base-200/50 rounded-lg p-4">
          <label className="label cursor-pointer justify-start gap-4">
            <input
              id="publish-checkbox"
              type="checkbox"
              className="toggle toggle-primary"
              {...register("publish", { required: false })}
            />
            <div>
              <span className="label-text font-medium block">
                Pubblica grafico
              </span>
              <span className="label-text-alt text-base-content/60">
                Rendi il grafico visibile pubblicamente
              </span>
            </div>
          </label>
        </div>

        {/* Pulsante di salvataggio */}
        <div className="pt-4">
          <button
            disabled={isSubmitting}
            type="submit"
            className="btn btn-primary w-full gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Salvataggio in corso...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                Salva grafico
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChartSave;
