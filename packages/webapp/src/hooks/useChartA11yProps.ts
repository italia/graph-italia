import { useTranslation } from "react-i18next";

/**
 * Localized accessibility strings for RenderChart: the component library
 * defaults to Italian, so charts rendered with an English UI would announce
 * Italian keyboard instructions (WCAG 3.1.2).
 */
export function useChartA11yProps() {
  const { t } = useTranslation("components", {
    keyPrefix: "components.chartA11y",
  });
  return {
    keyboardHint: t("keyboardHint"),
    dataTableCaption: t("dataTableCaption"),
  };
}
