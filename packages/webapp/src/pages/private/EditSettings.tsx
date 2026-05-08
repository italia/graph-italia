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
        <title>{t("title", "Account Settings")}</title>
      </Helmet>

      <div className="w-full flex items-center gap-2 bg-base-300 py-4 px-8 rounded-lg mb-6">
        <FaLock className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{t("title", "Account Settings")}</h1>
          <p className="text-sm opacity-70">
            {t("description", "Manage your account preferences and security.")}
          </p>
        </div>
      </div>

      {done ? (
        <div className="px-8 max-w-2xl">
          <div className="alert alert-success flex items-center gap-2">
            <FaCheck />
            <span>{t("changePassword.success", "Password updated successfully.")}</span>
          </div>
        </div>
      ) : (
        <ChangePasswordForm onDone={() => setDone(true)} />
      )}
    </Layout>
  );
}
