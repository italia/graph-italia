import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import type { TFunction } from "i18next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { PinInput } from "react-input-pin-code";
import { z as zod } from "zod";
import * as api from "../../lib/api";

const getResetPasswordSchema = (
  z: typeof zod,
  t: TFunction<"translation", undefined>,
) => {
  const passwordSchema = z
    .string()
    .min(8, { message: t(`form.fields.password.errors.minLength`) })
    .refine((p) => /[A-Z]/.test(p), { message: t(`form.fields.password.errors.uppercase`) })
    .refine((p) => /[a-z]/.test(p), { message: t(`form.fields.password.errors.lowercase`) })
    .refine((p) => /[0-9]/.test(p), { message: t(`form.fields.password.errors.number`) })
    .refine((p) => /[!@#$%^&*]/.test(p), { message: t(`form.fields.password.errors.specialChar`) });

  return z
    .object({ password: passwordSchema, confirmPassword: passwordSchema })
    .refine((d) => d.password === d.confirmPassword, {
      message: t(`form.errors.passwordDontMatch`),
      path: ["confirmPassword"],
    });
};

function ResetPasswordForm({
  uid,
  code: initialCode = "",
  onDone,
}: {
  uid: string;
  code?: string;
  onDone: () => void;
}) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.auth.changePasswordForm",
  });
  const [pinValues, setPinValues] = useState(
    initialCode.length === 6 ? initialCode.split("") : ["", "", "", "", "", ""],
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const schema = getResetPasswordSchema(zod, t);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: any) => {
    const code = pinValues.join("");
    if (code.length !== 6) {
      setMessage("Enter the 6-digit code from your email.");
      return;
    }
    setMessage("");
    setLoading(true);
    try {
      const result = await api.resetPassword({ uid, code, password: data.password });
      if (result) {
        onDone();
      } else {
        setMessage("Password reset failed. Try requesting a new code.");
      }
    } catch (error) {
      const errorMessage =
        ((error as AxiosError).response?.data as any)?.error?.message ||
        (error as any).message ||
        "An error occurred.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div className="mx-auto w-full min-w-sm max-w-lg card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body p-8">
          <h1 className="text-2xl font-bold leading-9 tracking-tight text-content">
            Reset password
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium leading-6 mb-2">
                Verification code
              </label>
              <PinInput
                values={pinValues}
                onChange={(_, __, values) => setPinValues(values)}
              />
            </div>

            <div>
              <label
                htmlFor="reset-password"
                className="block text-sm font-medium leading-6 text-content"
              >
                {t(`form.fields.password.label`)}
              </label>
              <div className="mt-2">
                <div className="relative">
                  <input
                    id="reset-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a new password"
                    className="input input-bordered w-full"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-content rounded-e-md focus:text-primary"
                  >
                    <svg
                      className="shrink-0 size-3.5"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line className={showPassword ? "hidden" : "block"} x1="2" x2="22" y1="2" y2="22" />
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
                {errors["password"] && (
                  <p className="text-error">{errors["password"].message}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="reset-confirm-password"
                className="block text-sm font-medium leading-6 text-content"
              >
                {t(`form.fields.confirmPassword.label`)}
              </label>
              <div className="mt-2">
                <input
                  id="reset-confirm-password"
                  type="password"
                  className="input input-bordered w-full"
                  {...register("confirmPassword")}
                />
                {errors["confirmPassword"] && (
                  <p className="text-error">{errors["confirmPassword"].message}</p>
                )}
              </div>
            </div>

            {message && <p className="text-error">{message}</p>}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Reset password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
