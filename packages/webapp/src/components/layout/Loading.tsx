import { useTranslation } from "react-i18next";

export default function Loading() {
  const { t } = useTranslation("components", {
    keyPrefix: "components.loading",
  });
  return (
    <div role="status" className="my-10 gap-2 text-primary flex">
      <span className="text-primary text-2xl uppercase">{t("label")}</span>
      <span className="loading loading-dots loading-lg" aria-hidden="true" />
    </div>
  );
}
