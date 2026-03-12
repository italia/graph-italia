import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as api from "../../lib/api";
import { HOME_ROUTE } from "../../router";
import { useUserStore } from "../../store/user_store";

function SignIn({ setLogin }: { setLogin: (login: boolean) => void }) {
  const { t } = useTranslation();
  const TRANSLATION_KEY_PATH = "components.auth.signin";
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  const [message, setMessage] = useState("");

  const onSubmit = async (submittedData: any) => {
    setMessage("");
    const { email, password } = submittedData;
    try {
      const rememberMe = submittedData["remember-me"] ?? false;
      const result = await api.login({ email, password, rememberMe });
      console.log("Login result", result);
      if (result) {
        const user = await api.getUser();
        // console.log(user);
        setUser(user);
        navigate(HOME_ROUTE);
      } else {
        setMessage("Error while logging in");
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        ((error as AxiosError).response?.data as any).error?.message ||
        (error as any).message ||
        error;
      setMessage(errorMessage);
    }
  };

  function handleRecoverFlow() {
    navigate("/recover-password");
  }

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-content">
            {t(`${TRANSLATION_KEY_PATH}.header.label`)}
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
                  {t(`${TRANSLATION_KEY_PATH}.form.fields.email.label`)}
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
                      {t(
                        `${TRANSLATION_KEY_PATH}.form.fields.email.errors.required`,
                      )}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-content"
                >
                  {t(`${TRANSLATION_KEY_PATH}.form.fields.password.label`)}
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="input input-bordered w-full"
                    {...register("password", { required: true })}
                  />
                  {errors["password"] && (
                    <span className="text-danger">
                      {" "}
                      {t(
                        `${TRANSLATION_KEY_PATH}.form.fields.password.errors.required`,
                      )}
                    </span>
                  )}
                </div>
              </div>

              {message && <p className="text-error">{message}</p>}
              <div>
                <button type="submit" className="btn btn-primary w-full">
                  {t(`${TRANSLATION_KEY_PATH}.form.actions.submit.label`)}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center"></div>

                <div className="text-sm leading-6">
                  <button
                    type="button"
                    onClick={() => handleRecoverFlow()}
                    className="link font-semibold link-primary"
                  >
                    {t(
                      `${TRANSLATION_KEY_PATH}.form.actions.recoverPassword.label`,
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-10">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-base-300" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-base-100 px-6">
                  {t(`${TRANSLATION_KEY_PATH}.bottom.label`)}
                </span>
              </div>
            </div>

            <div className="mt-6 ">
              <button
                onClick={() => setLogin(false)}
                className="btn btn-outline w-full"
              >
                {t(`${TRANSLATION_KEY_PATH}.bottom.actions.signup.label`)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
