import * as echarts from "echarts";
import { lightTheme } from "./light";
import { darkTheme } from "./dark";

export type ChartColorScheme = "light" | "dark";

export type EchartsThemeValue = string | Record<string, unknown>;

echarts.registerTheme("graph-italia-light", lightTheme);
echarts.registerTheme("graph-italia-dark", darkTheme);

export function getEchartsThemeName(scheme: ChartColorScheme): string {
  return scheme === "dark" ? "graph-italia-dark" : "graph-italia-light";
}

export function isDarkScheme(scheme: ChartColorScheme): boolean {
  return scheme === "dark";
}
