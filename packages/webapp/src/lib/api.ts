import axios from "axios";
axios.defaults.withCredentials = true;

// Runtime configuration loaded from ConfigMap (in Kubernetes) or from /config.json
// The config is loaded at app startup in main.tsx and stored in window.__ENV__
// Falls back to import.meta.env (from .env file at build-time) for development, then to default
const getServerUrl = (): string => {
  let baseServerUrl =import.meta.env.VITE_SERVER_URL;
  // Priority 1: Runtime config from ConfigMap (/config.json)
  if (!baseServerUrl && typeof window !== "undefined" && window.__ENV__?.VITE_SERVER_URL) {
    baseServerUrl = window.__ENV__.VITE_SERVER_URL;
  }
  // Priority 2: Build-time env from .env file (for local development)
  baseServerUrl =  'http://localhost:3003';
  // Priority 3: Default fallback
  console.log("Using server URL:", baseServerUrl);

  return baseServerUrl;
};

// Use a getter function instead of a constant to ensure it's recalculated
// when window.__ENV__ is updated after config.json is loaded
const getServerUrlWithApi = (): string => {
  return `${getServerUrl()}/api`;
};
// let headers: HeadersInit | undefined = { 'Content-Type': 'application/json' };

/** getSuggestions */
export async function getSuggestions(inputData: (string | number)[][]) {
  const url = `${getServerUrlWithApi()}/hints/`;
  const data = JSON.stringify(inputData.slice(0, 5));
  const response = await axios.post(url, data);
  console.log("hints", response.status);
  if (response.status === 401) {
    return logout();
  }
  if (response.status === 200) {
    return response.data;
  }
  return null;
}

/** List */
export async function getCharts() {
  const response = await axios.get(`${getServerUrlWithApi()}/charts`);

  if (response.status === 401) {
    // return auth.logout();
    return logout();
  }
  if (response.status === 200) {
    return response.data;
  } else {
    return [];
  }
}

/** Get a chart */
export async function getChart(id: string) {
  const response = await axios.get(`${getServerUrlWithApi()}/charts/${id}`, {
    method: "GET",
  });
  if (response.status === 200) {
    const { data } = response.data;
    return data;
  } else {
    return [];
  }
}

export async function showChart(id: string) {
  const response = await axios(`${getServerUrlWithApi()}/charts/show/${id}`, {
    method: "GET",
  });
  if (response.status === 200) {
    const data = response.data;
    if (data.error) {
      throw new Error(data.error.message);
    }
    return data;
  }
  return null;
}

/** Upsert */
export async function upsertChart(payload: any, id?: string) {
  const url = id
    ? `${getServerUrlWithApi()}/charts/${id}`
    : `${getServerUrlWithApi()}/charts/`;
  const method = id ? "PUT" : "POST";

  let response = await (method === "PUT"
    ? axios.put(url, payload)
    : axios.post(url, payload));
  if (response.status === 200) {
    return response.data;
  }

  return null;
}

/** Delete */
export async function deleteChart(id: string) {
  const response = await axios.delete(`${getServerUrlWithApi()}/charts/${id}`);
  console.log("deleteChart", response.status);
  if (response.status === 401) {
    return logout();
  }
  if (response.status === 200) {
    return response.data;
  }
  return null;
}

/** AUTH CALLS */

/** Login */
export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) {
  const response = await axios.post(`${getServerUrlWithApi()}/auth/login`, {
    email,
    password,
  });
  const data = response.data;
  if (response.status === 200) {
    console.log("LOGGED IN", data);
    return true;
  } else {
    console.log("ERROR", data);
    if (data.message) {
      throw new Error(data.message);
    }
  }
}
/** Register */
export async function register({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await axios.post(
      `${getServerUrlWithApi()}/auth/register`,
      {
        email,
        password,
      }
    );
    const data = response.data;
    console.log("RESPONSE DATA", data);
    if (response.status === 200) {
      return true;
    }
  } catch (error: any) {
    console.log("REGISTER ERROR", error.message);
    throw error;
  }
}
/** get user data */
export async function getUser() {
  const response = await axios(`${getServerUrlWithApi()}/auth/user`, {
    method: "GET",
  });
  console.log("response status", response.status);
  console.log("response data", response.data);
  return response.data;
}

/** verify pin */
export async function verify({ uid, code }: { uid: string; code: string }) {
  try {
    const response = await axios.post(`${getServerUrlWithApi()}/auth/verify`, {
      uid,
      code,
    });
    if (response.status === 200) {
      return true;
    }
  } catch (error: any) {
    console.log("verify ERROR", error?.message);
    throw error;
  }
  return false;
}
/** change pwd */
export async function changePasssword({ password }: { password: string }) {
  try {
    const response = await axios.put(`${getServerUrlWithApi()}/auth/pwd`, {
      password,
    });
    if (response.status === 204) {
      return true;
    }
  } catch (error: any) {
    console.log("changePasssword ERROR", error?.message);
    throw error;
  }
}

export async function activate() {
  try {
    const response = await axios.post(`${getServerUrlWithApi()}/auth/init`);
    if (response.status === 200) {
      return true;
    }
  } catch (error: any) {
    console.log("changePasssword ERROR", error?.message);
    throw error;
  }
}
/** ask pin code */
export async function recoverPasssword(email: string) {
  try {
    const response = await axios.post(`${getServerUrlWithApi()}/auth/recover`, {
      email,
    });
    if (response.status === 200) {
      return true;
    }
  } catch (error: any) {
    console.log("recoverPasssword ERROR", error?.message);
    throw error;
  }
}
/** logout */
export function logout() {
  return axios.get(`${getServerUrlWithApi()}/auth/logout`);
}

/** DAHSBOARDS calls */

export interface DashboardDetail {
  name: string;
  description: string;
  slots: {
    settings: {
      i: `item-${number}`;
      x: number;
      y: number;
      w: number;
      h: number;
    };
    chart: {
      id: string;
    };
  }[];
}

/* List */

export async function getDashboards() {
  const response = await axios.get(`${getServerUrlWithApi()}/dashboards`);
  if (response.status === 200) {
    return response.data;
  } else {
    return [];
  }
}

export async function findDashboardById(id: string) {
  const response = await axios.get(`${getServerUrlWithApi()}/dashboards/${id}`);
  if (response.status === 200) {
    return response.data as DashboardDetail;
  }
  throw new Error("Server error");
}

export async function updateSlots(
  id: string,
  body: {
    slots: {
      chartId: string;
      settings: {
        x: number;
        y: number;
        w: number;
        h: number;
        i: string;
      };
    }[];
  }
) {
  const response = await axios.put(
    `${getServerUrlWithApi()}/dashboards/${id}/slots`,
    body
  );
  return response.status === 200;
}

export async function deleteDashaboard(id: string) {
  const response = await axios.delete(
    `${getServerUrlWithApi()}/dashboards/${id}`
  );
  console.log("response status", response.status);
  return response.status === 204;
}

export async function createDashboard(payload: {
  name: string;
  description: string;
}) {
  const response = await axios.post(
    `${getServerUrlWithApi()}/dashboards`,
    payload
  );
  return { id: response.data.id } as { id: string };
}

/** Create a new chart with name only */
export async function createChart(payload: {
  name: string;
  description?: string;
}) {
  const response = await axios.post(`${getServerUrlWithApi()}/charts`, {
    ...payload,
    chart: "bar", // default chart type, will be changed in edit page
  });
  return { id: response.data.id } as { id: string };
}

type CreateKpiGroupPayload = {
  name: string;
  description?: string;
}

export async function createKpiGroup(payload: CreateKpiGroupPayload) {
  const response = await axios.post<{ id: string }>(`${getServerUrlWithApi()}/charts/kpi-group`, {
    ...payload
  });
  return { id: response.data.id };
}
