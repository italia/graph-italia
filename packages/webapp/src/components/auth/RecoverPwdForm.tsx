import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as api from "../../lib/api";

function RecoverPasswordForm({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.auth.recoverPwdForm",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  const [message, setMessage] = useState("");

  const onSubmit = async (submittedData: any) => {
    setMessage("");
    const { email } = submittedData;
    try {
      const result = await api.recoverPasssword(email);
      console.log("result", result);
      if (!result) {
        setMessage(t(`form.actions.submit.messages.error`));
        return;
      }
      setMessage(t(`form.actions.submit.messages.success`));
      setTimeout(() => {
        onDone();
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        ((error as AxiosError).response?.data as any).error?.message ||
        (error as any).message ||
        error;
      setMessage(errorMessage);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-content">
            {t(`header.label`)}
          </h2>
        </div>

        <div className="mt-10">
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6"
                >
                  {t(`form.fields.email.label`)}
                </label>
                <div className="mt-2 form-control">
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="input input-bordered w-full"
                    {...register("email", { required: true })}
                  />
                  {errors["email"] && (
                    <span className="text-error">
                      {t(`form.fields.email.errors.required`)}
                    </span>
                  )}
                </div>
              </div>
              {message && <p className="text-error">{message}</p>}
              <div>
                <button type="submit" className="btn btn-primary w-full">
                  {t(`form.actions.submit.label`)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecoverPasswordForm;
