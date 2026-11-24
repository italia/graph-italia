import type { ChartWrapperProps } from "../components/chartwrapper/ChartWrapper";
import type { ChartWrapperSettings, FieldDataType, InfosType } from "../types";

type TextKey = "title" | "subTitle" | "text" | "sourceTextInfo" | "chartFooterText";
const TEXT_KEYS: TextKey[] = ["title", "subTitle", "text", "sourceTextInfo", "chartFooterText"];

const filled = (value?: string) => (value?.trim() ? value : undefined);

/**
 * ChartWrapper props completed with the settings saved with the chart
 * (`data.wrapper`). What the host passes wins: a non-empty info text, an
 * explicit flag. Then the saved settings, then the component defaults.
 * Empty saved title and subTitle fall back on the chart name and description.
 */
export function withSavedWrapperSettings(props: ChartWrapperProps): ChartWrapperProps {
  const saved = props.data.wrapper;
  if (!saved) return props;
  const texts: Partial<Record<TextKey, string>> = {};
  for (const key of TEXT_KEYS) texts[key] = filled(props.info[key]) ?? filled(saved[key]);
  return {
    ...props,
    info: { ...props.info, ...texts, text: texts.text ?? "" },
    showHeading: props.showHeading ?? saved.showHeading,
    enableDownloadData: props.enableDownloadData ?? saved.enableDownloadData,
    enableDownloadImage: props.enableDownloadImage ?? saved.enableDownloadImage,
    showDataTransposed: props.showDataTransposed ?? saved.showDataTransposed,
    showPoweredBy: props.showPoweredBy ?? saved.showPoweredBy,
    // enableShare is not applied: sharing needs a link only the host page
    // knows, so the button follows the host's shareFunction.
  };
}

/**
 * Whether a chart is shown with its wrapper. An explicit `withWrapper` decides;
 * otherwise the saved settings (the chart's own switch, or the dashboard's
 * "wrap every chart" switch) can turn it on over `fallback`.
 */
export function shouldWrap(
  chart: Pick<FieldDataType, "wrapper"> | undefined,
  withWrapper: boolean | undefined,
  { wrapCharts = false, fallback = false }: { wrapCharts?: boolean; fallback?: boolean } = {},
): boolean {
  if (withWrapper !== undefined) return withWrapper;
  return wrapCharts || chart?.wrapper?.enabled === true || fallback;
}

/**
 * Info for the ChartWrapper of a dashboard slot. A chart with saved settings
 * uses them (title and subtitle default to name and description); one without
 * keeps the dashboard look: name as title, description in the Info tab.
 * `labels` from the host go on top either way.
 */
export function wrapperInfo(chart: FieldDataType, labels: Partial<InfosType> = {}): InfosType {
  const base: InfosType = chart.wrapper
    ? { text: "" }
    : { text: chart.description ?? "", title: chart.name ?? "", subTitle: "" };
  return { ...base, ...labels };
}

export type { ChartWrapperSettings };
