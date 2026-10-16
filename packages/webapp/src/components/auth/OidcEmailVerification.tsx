import type { AxiosError } from "axios";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import * as api from "../../lib/api";

/**
 * First step of the SPID/CIE signup when the identity provider sent no email
 * (CIE never does, SPID not always): the user types one and confirms it with
 * the code the server mails. The email is what links the identity to an
 * account, so when it already belongs to one the server links it and logs in
 * (`onLoggedIn`); otherwise signup continues with the verified email
 * (`onVerified`).
 */
function OidcEmailVerification({
  onVerified,
  onLoggedIn,
}: {
  onVerified: (email: string) => void;
  onLoggedIn: () => void;
}) {
  const { t } = useTranslation("pages", { keyPrefix: "auth.oidc.emailStep" });
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [info, setInfo] = useState("");

  const errorMessage = (error: unknown, badRequestKey: string) => {
    const status = (error as AxiosError).response?.status;
    if (status === 429) return t("errors.tooMany");
    if (status === 400) return t(badRequestKey);
    return t("errors.generic");
  };

  const sendCode = async (event?: FormEvent) => {
    event?.preventDefault();
    setMessage("");
    setInfo("");
    setBusy(true);
    try {
      await api.sendOidcEmailCode(email.trim());
      setCodeSent(true);
      setCode("");
      setInfo(t("sent", { email: email.trim() }));
    } catch (error) {
      setMessage(errorMessage(error, "errors.invalidEmail"));
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      const result = await api.verifyOidcEmailCode(code.trim());
      if (result.auth) onLoggedIn();
      else onVerified(result.email);
    } catch (error) {
      setMessage(errorMessage(error, "errors.invalidCode"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div className="mx-auto w-full min-w-sm max-w-lg card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body p-8">
          <h1 className="text-2xl font-bold leading-9 tracking-tight text-content">
            {t("title")}
          </h1>
          <p className="mt-2">{t("description")}</p>

          {!codeSent ? (
            <form onSubmit={sendCode} className="mt-8 space-y-6">
              <div>
                <label htmlFor="oidc-email" className="block text-sm font-medium leading-6">
                  {t("emailLabel")}
                </label>
                <div className="mt-2">
                  <input
                    id="oidc-email"
                    type="email"
                    required
                    autoComplete="email"
                    className="input input-bordered w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              {message && <p className="text-error" role="alert">{message}</p>}
              <button type="submit" className="btn btn-primary w-full" disabled={busy}>
                {t("send")}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="mt-8 space-y-6">
              {info && <p role="status">{info}</p>}
              <div>
                <label htmlFor="oidc-email-code" className="block text-sm font-medium leading-6">
                  {t("codeLabel")}
                </label>
                <div className="mt-2">
                  <input
                    id="oidc-email-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    maxLength={6}
                    className="input input-bordered w-full"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
              </div>
              {message && <p className="text-error" role="alert">{message}</p>}
              <button type="submit" className="btn btn-primary w-full" disabled={busy}>
                {t("verify")}
              </button>
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  className="link link-primary font-semibold"
                  onClick={() => {
                    setCodeSent(false);
                    setMessage("");
                    setInfo("");
                  }}
                >
                  {t("changeEmail")}
                </button>
                <button
                  type="button"
                  className="link link-primary font-semibold"
                  disabled={busy}
                  onClick={() => sendCode()}
                >
                  {t("resend")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default OidcEmailVerification;
