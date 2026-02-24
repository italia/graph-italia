import React, { createContext, useContext, useEffect, useState } from "react";
import type { ChartColorScheme, EchartsThemeValue } from "../themes";
import { getEchartsThemeName } from "../themes";

interface ColorSchemeContextValue {
  scheme: ChartColorScheme;
  resolvedTheme: EchartsThemeValue;
}

const ColorSchemeContext = createContext<ColorSchemeContextValue>({
  scheme: "light",
  resolvedTheme: "dataviz-light",
});

export function useColorScheme(): ChartColorScheme {
  return useContext(ColorSchemeContext).scheme;
}

export function useResolvedTheme(): EchartsThemeValue {
  return useContext(ColorSchemeContext).resolvedTheme;
}

function detectSystemScheme(): ChartColorScheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function isValidScheme(v: unknown): v is ChartColorScheme {
  return v === "light" || v === "dark";
}

function isCustomThemeObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

const POST_MESSAGE_TYPE = "DATAVIZ_THEME";

/**
 * Provider per il color scheme dei chart.
 *
 * Priorità di risoluzione del tema:
 *   1. Tema custom ricevuto via postMessage (oggetto ECharts)
 *   2. "light"/"dark" ricevuto via postMessage
 *   3. Prop `scheme` passata dal componente parent
 *   4. Auto-detect da `prefers-color-scheme` del browser
 *
 * postMessage protocol:
 *   { type: "DATAVIZ_THEME", theme: "dark" | "light" | { ...echartsThemeObject } }
 */
export function ColorSchemeProvider({
  scheme,
  children,
}: {
  scheme?: ChartColorScheme;
  children: React.ReactNode;
}) {
  const [currentScheme, setCurrentScheme] = useState<ChartColorScheme>(
    scheme ?? detectSystemScheme()
  );
  const [customTheme, setCustomTheme] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (scheme) {
      setCurrentScheme(scheme);
      setCustomTheme(null);
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setCurrentScheme(e.matches ? "dark" : "light");
      setCustomTheme(null);
    };
    mq.addEventListener("change", handler);
    setCurrentScheme(mq.matches ? "dark" : "light");
    return () => mq.removeEventListener("change", handler);
  }, [scheme]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data;
      if (!data || data.type !== POST_MESSAGE_TYPE) return;

      const incoming = data.theme;
      if (isValidScheme(incoming)) {
        setCurrentScheme(incoming);
        setCustomTheme(null);
      } else if (isCustomThemeObject(incoming)) {
        setCustomTheme(incoming);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const resolvedTheme: EchartsThemeValue = customTheme ?? getEchartsThemeName(currentScheme);

  return (
    <ColorSchemeContext.Provider value={{ scheme: currentScheme, resolvedTheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}
