import { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { FaCheck, FaLock } from "react-icons/fa6";
import ChangePasswordForm from "../../components/auth/ChangePasswordForm";
import Layout from "../../components/layout/index.tsx";

export default function EditSettingsPage() {
  const { t } = useTranslation("pages", { keyPrefix: "settings" });
  const [done, setDone] = useState(false);

  return (
    <Layout>
      <Helmet>
        <title>{t("title", "Modifica password")}</title>
      </Helmet>

      <div className="w-full flex items-center gap-2 py-6 px-4 lg:px-10 mb-2">
        <FaLock className="text-primary" aria-hidden="true" />
        <div>
          <h1 className="text-2xl font-bold">{t("title", "Modifica password")}</h1>
          <p className="text-sm opacity-70">
            {t("description", "Scegli una nuova password per il tuo account.")}
          </p>
        </div>
      </div>

      {done ? (
        <div className="px-8 max-w-2xl">
          <div className="alert alert-success flex items-center gap-2">
            <FaCheck aria-hidden="true" />
            <span>{t("changePassword.success", "Password aggiornata con successo.")}</span>
          </div>
        </div>
      ) : (
        <ChangePasswordForm headingLevel="h2" onDone={() => setDone(true)} />
      )}
    </Layout>
  );
}
