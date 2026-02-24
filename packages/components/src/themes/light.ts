/**
 * ECharts theme "light" - Tema chiaro basato su #0166CC → #FFF
 */
export const lightTheme = {
  color: [
    "#0166CC",
    "#1A75D4",
    "#3390E0",
    "#4DABEC",
    "#66C6F7",
    "#80D9FA",
    "#99E5FC",
    "#B3EEFD",
    "#CCF5FE",
    "#E6FAFF",
  ],
  backgroundColor: "#F5FAFF",
  textStyle: {
    fontFamily: "Titillium Web, sans-serif",
    fontSize: 12,
    color: "#001A33",
  },
  title: {
    textStyle: {
      color: "#0166CC",
      fontFamily: "Titillium Web, sans-serif",
      fontWeight: "600",
      fontSize: 16,
    },
    subtextStyle: {
      color: "#4D7BA3",
      fontSize: 12,
    },
  },
  axis: {
    axisLine: {
      show: true,
      lineStyle: { color: "#80B8E6" },
    },
    axisTick: { show: false },
    axisLabel: {
      color: "#001A33",
      fontSize: 11,
    },
    splitLine: {
      lineStyle: { color: "#D6ECFA" },
    },
  },
  legend: {
    textStyle: {
      color: "#001A33",
      fontSize: 12,
    },
  },
  tooltip: {
    backgroundColor: "rgba(255,255,255,0.98)",
    borderColor: "#80B8E6",
    borderWidth: 1,
    textStyle: {
      color: "#001A33",
      fontSize: 12,
    },
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: "#80B8E6" } },
    axisLabel: { color: "#001A33" },
    splitLine: { lineStyle: { color: "#D6ECFA" } },
  },
  valueAxis: {
    axisLine: { show: false },
    axisLabel: { color: "#001A33" },
    splitLine: { lineStyle: { color: "#D6ECFA" } },
  },
};
