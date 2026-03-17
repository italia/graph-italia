/**
 * ECharts theme "light" - Tema chiaro basato su #0166CC → #FFF
 */
export const lightTheme = {
  color: [
    '#003366',
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
    '#080809',
    '#661A26',
    '#05615E',
    '#09AFA9',
    '#2F475E',
    '#737373',],

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
