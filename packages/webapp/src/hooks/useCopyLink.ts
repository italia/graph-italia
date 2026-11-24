import { useTranslation } from "react-i18next";
import toast from "../lib/toast";

/**
 * Copies a link to the clipboard and says so in a toast: the "Share" button
 * of the ChartWrapper on the display pages.
 */
export function useCopyLink() {
  const { t } = useTranslation("pages");
  return (url: string) =>
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success(t("publicChart.share.copied")))
      .catch(() => toast.error(t("publicChart.share.error")));
}
