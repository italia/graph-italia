/**
 * ECharts theme "dark" - Tema scuro
 */
export const darkTheme = {
  color: [
    "#4DABEC",
    '#004D99',
    '#0066CC',
    '#207AD5',
    '#4392E0',
    '#D48D22',
    '#CC7A00',
    '#B36B00',
    '#995C00',
    '#804D00',
    '#D65C70',
    '#CC334D',
    '#B32D43',
    '#992639',
    '#7A1F2E',
    "#66C6F7",
    '#661A26',
    '#05615E',
    '#09AFA9',
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
