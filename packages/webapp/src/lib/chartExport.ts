import * as echarts from "echarts";
import type { EChartsType } from "echarts";

function saveAs(href: string, fileName: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const safeName = (name: string) =>
  (name || "grafico").replace(/[^\p{L}\p{N}_-]+/gu, "_").slice(0, 80);

/** PNG snapshot of the rendered chart (canvas renderer). */
export function downloadChartPng(instance: EChartsType, name: string) {
  const url = instance.getDataURL({ type: "png", pixelRatio: 2, backgroundColor: "#fff" });
  saveAs(url, `${safeName(name)}.png`);
}

/**
 * SVG export (#79): the visible chart uses the canvas renderer, so the same
 * option is rendered once more, off screen, with the SVG renderer.
 */
export function downloadChartSvg(instance: EChartsType, name: string) {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-10000px";
  host.style.width = `${instance.getWidth()}px`;
  host.style.height = `${instance.getHeight()}px`;
  document.body.appendChild(host);
  const temp = echarts.init(host, undefined, {
    renderer: "svg",
    width: instance.getWidth(),
    height: instance.getHeight(),
  });
  try {
    temp.setOption(instance.getOption() as echarts.EChartsOption, { notMerge: true });
    const url = temp.getDataURL({ type: "svg" });
    saveAs(url, `${safeName(name)}.svg`);
  } finally {
    temp.dispose();
    document.body.removeChild(host);
  }
}
