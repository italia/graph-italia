import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as api from "../../lib/api";
import { HOME_ROUTE } from "../../router";
import { useUserStore } from "../../lib/store/user_store";
import { broadcastAuth } from "../../lib/authChannel";

function SignIn({ setLogin }: { setLogin: (login: boolean) => void }) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.auth.signin",
  });
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  const [message, setMessage] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resendInfo, setResendInfo] = useState<string | null>(null);

  const onSubmit = async (submittedData: any) => {
    setMessage("");
    setResendInfo(null);
    const { email, password } = submittedData;
    try {
      const rememberMe = submittedData["remember-me"] ?? false;
      const result = await api.login({ email, password, rememberMe });
      console.log("Login result", result);
      if (result) {
        const user = await api.getUser();
        // console.log(user);
        setUser(user);
        broadcastAuth("login"); // let other open tabs pick up the new session
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
      // The server message for an unverified account is stable enough to key on.
      // When matched, surface the "resend activation email" affordance.
      if (
        typeof errorMessage === "string" &&
        /verify your email/i.test(errorMessage)
      ) {
        setUnverifiedEmail(email);
      } else {
        setUnverifiedEmail(null);
      }
    }
  };

  async function handleResend() {
    if (!unverifiedEmail) return;
    try {
      await api.resendActivation(unverifiedEmail);
      setResendInfo(t(`form.actions.resend.success`));
    } catch (error) {
      const status = (error as AxiosError).response?.status;
      setResendInfo(
        status === 429
          ? t(`form.actions.resend.tooMany`)
          : t(`form.actions.resend.error`),
      );
    }
  }

  function handleRecoverFlow() {
    navigate("/recover-password");
  }

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div className="mx-auto w-full  min-w-100 card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body p-8">
          <div>
            <h1 className="text-2xl font-bold leading-9 tracking-tight text-content">
              {t(`header.label`)}
            </h1>
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

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-content"
                  >
                    {t(`form.fields.password.label`)}
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
                        {t(`form.fields.password.errors.required`)}
                      </span>
                    )}
                  </div>
                </div>

                {message && <p className="text-error">{message}</p>}
                {unverifiedEmail && (
                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => handleResend()}
                      className="link font-semibold link-primary"
                    >
                      {t(`form.actions.resend.label`)}
                    </button>
                    {resendInfo && (
                      <p className="mt-2 text-info">{resendInfo}</p>
                    )}
                  </div>
                )}
                <div>
                  <button type="submit" className="btn btn-primary w-full">
                    {t(`form.actions.submit.label`)}
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
                      {t(`form.actions.recoverPassword.label`)}
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
                  <span className="bg-base-100 px-6">{t(`bottom.label`)}</span>
                </div>
              </div>

              <div className="mt-6 ">
                <button
                  onClick={() => setLogin(false)}
                  className="btn btn-outline w-full"
                >
                  {t(`bottom.actions.signup.label`)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
