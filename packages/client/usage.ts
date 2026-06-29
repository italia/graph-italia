import axios from "axios";
import { getGraphItaliaAPI } from "./dist/index.js";

const BASE_URL = process.env.API_BASE_URL ?? "http://127.0.0.1:3003";
const TOKEN = process.env.API_KEY;

if (!TOKEN) {
  console.error("Missing API_TOKEN in .env");
  process.exit(1);
}

async function main() {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  const client = getGraphItaliaAPI(axiosInstance);


  // List charts
  try {
    console.log("\n--- Charts ---");
    const chartsRes = await client.getApiCharts();
    console.log("charts:", chartsRes.data.length, "items");
    const names = chartsRes.data.map((c) => c.name).join(", ");
    console.log("chart names:", names);
  } catch (err) {
    console.error("Error:", err?.response?.data ?? err.message);
  }

  // List dashboards
  console.log("\n--- Dashboards ---");
  const dashboardsRes = await client.getApiDashboards();
  console.log("dashboards:", dashboardsRes.data.length, "items");


}

main();
