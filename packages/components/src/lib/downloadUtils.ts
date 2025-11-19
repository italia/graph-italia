import { log } from "./utils";

function saveAs(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadPng(echartInstance: any, name: string) {
  if (!echartInstance) return;
  const dataUrl = echartInstance.getDataURL();
  try {
    const blob = await fetch(dataUrl).then((res) => res.blob());
    saveAs(blob, `${name}.png`);
  } catch (error) {
    log("error", error);
  }
}

export async function downloadCSV(data: any, name: string) {
  try {
    const blob = new Blob([data], {
      type: "text/csv;charset=utf-8",
    });
    saveAs(blob, `${name}.csv`);
  } catch (error) {
    log("error", error);
  }
}

export function generateCSV(dataSource: any) {
  const columns = "_," + dataSource.categories.join(",");
  const rows = dataSource.series.map((serie: any) => {
    const { name = "", data = [] } = serie;
    return [name, ...data].join(",");
  });
  return [columns, ...rows].join("\n");
}

export function dataToCSV(data: any) {
  const rows = data.map((r: any) => {
    return r.join(",");
  });
  return rows.join("\n");
}

export function generateCSVPie(serie: any) {
  log("generateCSVPie", serie);
  if (!serie) {
    return null;
  }

  let columns = "name,value";
  if (typeof serie.data[0] !== "object") {
    columns = serie.name || "_";
  }

  const rows = serie.data.map((v: any) => {
    if (typeof v === "object") {
      return [v.name, v.value].join(",");
    } else {
      return v;
    }
  });

  return [columns, ...rows].join("\n");
}
