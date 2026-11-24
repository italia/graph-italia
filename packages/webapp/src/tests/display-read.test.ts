import { afterEach, describe, expect, it } from "vitest";
import axios, { AxiosError, type AxiosAdapter, type AxiosResponse } from "axios";
import { loadInstanceConfig, readChartForDisplay, readDashboardForDisplay } from "../lib/api";

// Answers by path; a status >= 400 rejects like axios' own adapters do.
function serve(routes: Record<string, [status: number, body?: unknown]>) {
  const calls: string[] = [];
  const adapter: AxiosAdapter = async (config) => {
    const path = new URL(config.url ?? "", "http://x").pathname.replace(/^\/api/, "");
    calls.push(path);
    const [status, data] = routes[path] ?? [404];
    const response = { data, status, statusText: "", headers: {}, config } as AxiosResponse;
    if (status >= 400) {
      throw new AxiosError(`Request failed with status code ${status}`, "ERR_BAD_REQUEST", config, null, response);
    }
    return response;
  };
  axios.defaults.adapter = adapter;
  return calls;
}

const original = axios.defaults.adapter;
afterEach(() => {
  axios.defaults.adapter = original;
});

async function withPublishing(publicPublishing: boolean) {
  serve({ "/config": [200, { publicPublishing, passwordAuth: false }] });
  await loadInstanceConfig();
}

describe("reads for the /display pages", () => {
  it("published chart: public read, not a preview", async () => {
    await withPublishing(true);
    const calls = serve({ "/charts/show/c1": [200, { id: "c1" }] });
    expect(await readChartForDisplay("c1")).toEqual({ data: { id: "c1" }, preview: false });
    expect(calls).toEqual(["/charts/show/c1"]);
  });

  it("private chart, project member: falls back to the authenticated read as a preview", async () => {
    await withPublishing(true);
    const calls = serve({ "/charts/show/c1": [401], "/charts/c1": [200, { id: "c1" }] });
    expect(await readChartForDisplay("c1")).toEqual({ data: { id: "c1" }, preview: true });
    expect(calls).toEqual(["/charts/show/c1", "/charts/c1"]);
  });

  it("private chart, anyone else: keeps the public 401 (\"not public\" message)", async () => {
    await withPublishing(true);
    serve({ "/charts/show/c1": [401], "/charts/c1": [401] });
    await expect(readChartForDisplay("c1")).rejects.toMatchObject({
      response: { status: 401 },
      config: { url: expect.stringContaining("/charts/show/c1") },
    });
  });

  it("missing chart: no fallback on 404", async () => {
    await withPublishing(true);
    const calls = serve({ "/charts/show/c1": [404] });
    await expect(readChartForDisplay("c1")).rejects.toMatchObject({ response: { status: 404 } });
    expect(calls).toEqual(["/charts/show/c1"]);
  });

  it("publishing off: authenticated read only, always a preview", async () => {
    await withPublishing(false);
    const calls = serve({ "/dashboards/d1": [200, { id: "d1", slots: [] }] });
    expect(await readDashboardForDisplay("d1")).toEqual({ data: { id: "d1", slots: [] }, preview: true });
    expect(calls).toEqual(["/dashboards/d1"]);
  });

  it("private dashboard, project member: preview through the authenticated read", async () => {
    await withPublishing(true);
    serve({ "/dashboards/show/d1": [401], "/dashboards/d1": [200, { id: "d1", slots: [] }] });
    expect(await readDashboardForDisplay("d1")).toEqual({ data: { id: "d1", slots: [] }, preview: true });
  });
});
