import type { ChartWrapper } from "graph-italia-components";
import type { ComponentProps } from "react";

/**
 * ChartWrapper settings of a chart, saved in its `wrapper` JSON column
 * (server: chartWrapperSchema in routes/charts.ts). Turning the wrapper off
 * keeps the rest, so texts and options come back when it is turned on again.
 * Labels are not configurable yet: the component defaults apply.
 */
export type ChartWrapperSettings = {
  enabled: boolean;
  /** Empty: the chart name. */
  title?: string;
  /** Empty: the chart description. */
  subTitle?: string;
  /** Markdown of the "Info" tab. */
  text?: string;
  /** Markdown after the "Data source" label. */
  sourceTextInfo?: string;
  /** Markdown under the chart. */
  chartFooterText?: string;
  showHeading?: boolean;
  enableDownloadData?: boolean;
  enableDownloadImage?: boolean;
  enableShare?: boolean;
  showDataTransposed?: boolean;
  showPoweredBy?: boolean;
};

export type WrapperTextKey = "title" | "subTitle" | "text" | "sourceTextInfo" | "chartFooterText";
export type WrapperFlagKey =
  | "showHeading"
  | "enableDownloadData"
  | "enableDownloadImage"
  | "enableShare"
  | "showDataTransposed"
  | "showPoweredBy";

/** The flags in form order, with the value a new wrapper starts from. */
export const WRAPPER_FLAGS: { key: WrapperFlagKey; default: boolean }[] = [
  { key: "showHeading", default: true },
  { key: "enableDownloadData", default: true },
  { key: "enableDownloadImage", default: true },
  { key: "enableShare", default: false },
  { key: "showDataTransposed", default: false },
  { key: "showPoweredBy", default: false },
];

export const DEFAULT_WRAPPER: ChartWrapperSettings = {
  enabled: false,
  ...Object.fromEntries(WRAPPER_FLAGS.map((f) => [f.key, f.default])),
};

/** Saved settings (possibly missing or partial) completed with the defaults. */
export function withWrapperDefaults(saved: Partial<ChartWrapperSettings> | null | undefined): ChartWrapperSettings {
  return { ...DEFAULT_WRAPPER, ...(saved ?? {}) };
}

type WrapperProps = ComponentProps<typeof ChartWrapper>;

/**
 * Props for ChartWrapper from the saved settings. Empty title and subtitle are
 * left out, so the component falls back on the chart name and description.
 */
export function toWrapperProps(
  settings: ChartWrapperSettings,
  share?: () => void,
): Omit<WrapperProps, "data"> {
  const s = withWrapperDefaults(settings);
  const text = (value?: string) => (value?.trim() ? value : undefined);
  return {
    info: {
      text: s.text ?? "",
      title: text(s.title),
      subTitle: text(s.subTitle),
      sourceTextInfo: text(s.sourceTextInfo),
      chartFooterText: text(s.chartFooterText),
    },
    showHeading: s.showHeading,
    enableDownloadData: s.enableDownloadData,
    enableDownloadImage: s.enableDownloadImage,
    shareFunction: s.enableShare && share ? () => share() : undefined,
    showDataTransposed: s.showDataTransposed,
    showPoweredBy: s.showPoweredBy,
  };
}
