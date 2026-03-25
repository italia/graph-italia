import * as echarts from "echarts";
import { lightTheme } from "./light";
import { darkTheme } from "./dark";

export type ChartColorScheme = "light" | "dark";

export type EchartsThemeValue = string | Record<string, unknown>;

echarts.registerTheme("dataviz-light", lightTheme);
echarts.registerTheme("dataviz-dark", darkTheme);

export function getEchartsThemeName(scheme: ChartColorScheme): string {
  return scheme === "dark" ? "dataviz-dark" : "dataviz-light";
}

export function isDarkScheme(scheme: ChartColorScheme): boolean {
  return scheme === "dark";
}
