/**
 * ECharts theme "dark" - Tema scuro
 */
export const darkTheme = {
  color: [
    "#4992FF",
    "#7CFFB2",
    "#FFC53D",
    "#FF6B6B",
    "#4DD2FF",
    "#FF9F7F",
    "#67E0E3",
    "#B49FDB",
    "#37A2DA",
    "#32C5E9",
  ],
  backgroundColor: "#1a1a2e",
  textStyle: {
    fontFamily: "Titillium Web, sans-serif",
    fontSize: 12,
    color: "#eee",
  },
  title: {
    textStyle: {
      color: "#fff",
      fontFamily: "Titillium Web, sans-serif",
      fontWeight: "600",
      fontSize: 16,
    },
    subtextStyle: {
      color: "#aaa",
      fontSize: 12,
    },
  },
  axis: {
    axisLine: {
      show: true,
      lineStyle: { color: "#555" },
    },
    axisTick: { show: false },
    axisLabel: {
      color: "#eee",
      fontSize: 11,
    },
    splitLine: {
      lineStyle: { color: "#333" },
    },
  },
  legend: {
    textStyle: {
      color: "#eee",
      fontSize: 12,
    },
  },
  tooltip: {
    backgroundColor: "rgba(50,50,76,0.95)",
    borderColor: "#555",
    borderWidth: 1,
    textStyle: {
      color: "#eee",
      fontSize: 12,
    },
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: "#555" } },
    axisLabel: { color: "#eee" },
    splitLine: { lineStyle: { color: "#333" } },
  },
  valueAxis: {
    axisLine: { show: false },
    axisLabel: { color: "#eee" },
    splitLine: { lineStyle: { color: "#333" } },
  },
};
