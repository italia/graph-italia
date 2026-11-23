import { AxiosError } from "axios";
import { useState, type FormEvent } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout";
import * as api from "../../lib/api";
import { broadcastAuth } from "../../lib/authChannel";
import { useUserStore } from "../../lib/store/user_store";
import { ROUTES } from "../../router";

/**
 * Email/password sign-in for administrators (ROUTES.adminLogin). It stays
 * available when the instance is SPID/CIE-only, so admins whose account is not
 * linked to a SPID/CIE identity can still get in. The page is linked from
 * nowhere and not indexed; the server is what restricts it to ADMIN accounts.
 */
export default function AdminLoginPage() {
  const { t } = useTranslation("pages", { keyPrefix: "auth.adminLogin" });
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);
    try {
      await api.adminLogin({ email, password });
      setUser(await api.getUser());
      broadcastAuth("login"); // let other open tabs pick up the new session
      navigate(ROUTES.admin);
    } catch (error) {
      const status = (error as AxiosError).response?.status;
      setMessage(
        status === 401
          ? t("invalid")
          : status === 404
            ? t("unavailable")
            : status === 429
              ? t("tooMany")
              : t("error"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <Helmet>
        <title>{t("title")}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex flex-col min-h-full justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 flex-col justify-center py-12 lg:flex-none">
          <div className="mx-auto w-full min-w-100 card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-8">
              <h1 className="text-2xl font-bold leading-9 tracking-tight text-content">
                {t("title")}
              </h1>
              <p className="mt-2">{t("description")}</p>
              <form onSubmit={onSubmit} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="admin-email" className="block text-sm font-medium leading-6">
                    {t("email")}
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="email"
                    className="input input-bordered w-full mt-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="admin-password" className="block text-sm font-medium leading-6">
                    {t("password")}
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="input input-bordered w-full mt-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {message && (
                  <p className="text-error" role="alert">
                    {message}
                  </p>
                )}
                <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
                  {t("submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
