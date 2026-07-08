import axios from "axios";
import { broadcastAuth } from "./authChannel";
import { useUserStore } from "./store/user_store";
axios.defaults.withCredentials = true;

// Prevents duplicate in-flight mutation requests for the same resource.
// Key format: "<verb>:<resource>:<id>" e.g. "upsert:chart:abc" or "upsert:chart:new"
const pendingMutations = new Set<string>();
async function withMutationGuard<T>(key: string, fn: () => Promise<T>): Promise<T | null> {
  if (pendingMutations.has(key)) return null;
  pendingMutations.add(key);
  try {
    return await fn();
  } finally {
    pendingMutations.delete(key);
  }
}

// Interceptor to inject the active project ID into all requests
axios.interceptors.request.use((config) => {
  const projectId = localStorage.getItem("currentProjectId");
  if (projectId) {
    config.headers["x-project-id"] = projectId;
  }
  return config;
});

// Global session-loss handling. A 401 from a protected endpoint means the
// session cookie is gone/expired: clear local state, notify other tabs, and
// send the user to /login.
//
// NOT every 401 is a session-expiry, so we exclude:
//  - /auth/*  : login / verify / bootstrap-hydration flows report their own 401s.
//  - /show/   : PUBLIC publish-gated reads (an unpublished chart/dashboard returns
//               401 meaning "not public", not "you were logged out").
//  - /display/ and /embed/ pages: public share/iframe views must never be yanked
//    to /login on any 401 (defense-in-depth beyond the /show/ URL check).
// Missing these caused valid users (and public embeds) to be force-logged-out.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? "";
    const isNonSessionAuthFailure =
      url.includes("/auth/") || url.includes("/oidc/") || url.includes("/show/");
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    const onPublicViewPage = path.startsWith("/display/") || path.startsWith("/embed/");
    if (status === 401 && !isNonSessionAuthFailure && !onPublicViewPage) {
      useUserStore.getState().clearUser();
      broadcastAuth("logout");
      if (typeof window !== "undefined" && path !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);


// Runtime configuration loaded from ConfigMap (in Kubernetes) or from /config.json
// The config is loaded at app startup in main.tsx and stored in window.__ENV__
// Falls back to import.meta.env (from .env file at build-time) for development, then to default
const getServerUrl = (): string => {
  let baseServerUrl; // = import.meta.env.VITE_SERVER_URL;
  // Priority 1: Runtime config from ConfigMap (/config.json)
  if (typeof window !== "undefined" && window.__ENV__?.VITE_SERVER_URL) {
    baseServerUrl = window.__ENV__.VITE_SERVER_URL;
    return baseServerUrl;
  } else {
    // Priority 2: Build-time env from .env file (for local development)
    // Priority 3: Default fallback
    baseServerUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3003';
  }
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
  if (response.status === 200) {
    return response.data;
  }
  return null;
}

/** List */
export async function getCharts() {
  const response = await axios.get(`${getServerUrlWithApi()}/charts`);

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
    return response.data;
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

/** Upsert — creates (POST→201) or updates (PUT→200). Concurrent calls for the same resource are dropped. */
export async function upsertChart(payload: any, id?: string) {
  const lockKey = id ? `upsert:chart:${id}` : "upsert:chart:new";
  return withMutationGuard(lockKey, async () => {
    const url = id
      ? `${getServerUrlWithApi()}/charts/${id}`
      : `${getServerUrlWithApi()}/charts/`;
    const response = await (id ? axios.put(url, payload) : axios.post(url, payload));
    if (response.status === 200 || response.status === 201) {
      return response.data as { id: string };
    }
    return null;
  });
}

/** Delete */
export async function deleteChart(id: string) {
  const response = await axios.delete(`${getServerUrlWithApi()}/charts/${id}`);
  console.log("deleteChart", response.status);
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
}): Promise<{ uid: string } | null> {
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
    if (response.status === 200 && data.uid) {
      return { uid: data.uid };
    }
    return null;
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
  } catch (error) {
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

/** reset password via recovery code (uid + pin from email + new password) */
export async function resetPassword({ uid, code, password }: { uid: string; code: string; password: string }) {
  const response = await axios.post(`${getServerUrlWithApi()}/auth/reset-password`, { uid, code, password });
  if (response.status === 200) {
    return true;
  }
  return false;
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

/** re-send activation email for an unverified account */
export async function resendActivation(email: string) {
  try {
    const response = await axios.post(`${getServerUrlWithApi()}/auth/resend`, {
      email,
    });
    return response.status === 200;
  } catch (error: any) {
    console.log("resendActivation ERROR", error?.message);
    throw error;
  }
}
/** logout */
export async function logout() {
  // POST (not GET) so the server's CSRF Origin check applies and a cross-site
  // navigation / prefetch can't silently end the session.

  return Promise.all([
    axios.get(`${getServerUrlWithApi()}/oidc/logout`),
    axios.post(`${getServerUrlWithApi()}/auth/logout`)
  ]);
}

export function redirectToLoginOidc() {
  //TODO: needed to be adjusted
  return `${getServerUrl()}/api/oidc/login`
}

export interface OidcSignupStatus {
  registered: boolean;
  email: string;
  given_name: string;
  family_name: string;
}

/**
 * Checks — via the server-side OIDC session — whether the current OIDC user (by `sub`)
 * has already completed signup, and returns claims to prefill the form. The `t` query
 * param (the sub) is passed for reference only; the server derives identity from the
 * session. Throws on 401 (no active OIDC session).
 */
export async function getOidcSignupStatus(t?: string | null): Promise<OidcSignupStatus> {
  const url = `${getServerUrl()}/api/oidc/signup/status${t ? `?t=${encodeURIComponent(t)}` : ""}`;
  const response = await axios.get(url);
  return response.data;
}

/** Completes OIDC signup: creates the account linked to the session `sub` and logs in. */
export async function oidcSignup({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ auth: boolean }> {
  const response = await axios.post(`${getServerUrl()}/api/oidc/signup`, {
    email,
    password,
  });
  return response.data;
}

/** DAHSBOARDS calls */

export interface DashboardDetail {
  name: string;
  description: string;
  publish: boolean;
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

/**
 * Public read of a PUBLISHED dashboard (no project membership required),
 * mirroring showChart -> /charts/show/:id. Used by the display/embed views so
 * shared dashboard links keep working for anonymous / cross-project viewers.
 * Returns 401 when the dashboard exists but isn't published.
 */
export async function showDashboard(id: string) {
  const response = await axios.get(`${getServerUrlWithApi()}/dashboards/show/${id}`);
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

export async function updateDashboard(
  id: string,
  body: { name: string, description: string, publish: boolean }
) {
  const response = await axios.put(
    `${getServerUrlWithApi()}/dashboards/${id}`,
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
  description?: string;
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
  chart?: string;
}) {
  const response = await axios.post(`${getServerUrlWithApi()}/charts`, {
    ...payload,
    chart: payload.chart || "bar", // default chart type, will be changed in edit page
    publish: true, // default to public
  });
  return { id: response.data.id } as { id: string };
}

type CreateKpiGroupPayload = {
  name: string;
  description?: string;
  chart: "kpi";
};

export async function createKpiGroup(payload: CreateKpiGroupPayload) {
  const response = await axios.post<{ id: string }>(
    `${getServerUrlWithApi()}/charts/kpi-group`,
    {
      ...payload,
    }
  );
  return { id: response.data.id };
}

type GetKpiGroupParams = {
  id: string;
};

type GetKpiGroupResponse = {
  data: { name: string; description: string; config: any; dataSource: {}[] };
};

export async function getKpiGroup({ id }: GetKpiGroupParams) {
  const response = await axios.get(
    `${getServerUrlWithApi()}/charts/kpi-group/${id}`
  );
  return { data: response.data.data } as GetKpiGroupResponse;
}

export async function saveKpiGroup({
  id,
  payload,
}: {
  id: string;
  payload: any;
}) {
  const response = await axios.put(
    `${getServerUrlWithApi()}/charts/kpi-group/${id}`,
    payload
  );
  return Boolean(response.data.id);
}
/** API KEYS calls */

export interface ApiKey {
  id: string;
  prefix: string;
  rawKey?: string; // only present on creation response
  role: string;
  expire: number;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  project?: Project;
}

export async function getApiKeys(): Promise<ApiKey[]> {
  const response = await axios.get(`${getServerUrlWithApi()}/apikeys`);
  if (response.status === 200) {
    return response.data;
  }
  return [];
}

export async function createApiKey(payload: {
  role: string;
  expire: number;
  projectId?: string;
}): Promise<ApiKey | null> {
  const response = await axios.post(`${getServerUrlWithApi()}/apikeys`, payload);
  if (response.status === 201) {
    return response.data;
  }
  return null;
}

export async function deleteApiKey(id: string): Promise<boolean> {
  const response = await axios.delete(`${getServerUrlWithApi()}/apikeys/${id}`);
  return response.status === 204;
}

export async function revokeApiKey(id: string): Promise<ApiKey | null> {
  const response = await axios.patch(`${getServerUrlWithApi()}/apikeys/${id}/revoke`);
  if (response.status === 200) return response.data;
  return null;
}

export async function reinstateApiKey(id: string): Promise<ApiKey | null> {
  const response = await axios.patch(`${getServerUrlWithApi()}/apikeys/${id}/reinstate`);
  if (response.status === 200) return response.data;
  return null;
}

export async function getApiKeyLogs(id: string, limit = 100) {
  const response = await axios.get(`${getServerUrlWithApi()}/apikeys/${id}/logs?limit=${limit}`);
  if (response.status === 200) {
    return response.data;
  }
  return [];
}
/** ORGANIZATION calls */

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  members?: OrganizationMember[];
}

export interface OrganizationMember {
  userId: string;
  orgId: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
  };
}


export async function getOrgs(): Promise<Organization[]> {
  const response = await axios.get(`${getServerUrlWithApi()}/orgs`);
  if (response.status === 200) {
    return response.data;
  }
  return [];
}

export async function getOrgDetail(orgId: string): Promise<Organization | null> {
  const response = await axios.get(`${getServerUrlWithApi()}/orgs/${orgId}`);
  if (response.status === 200) {
    return response.data;
  }
  return null;
}

export async function createOrg(name: string): Promise<Organization | null> {
  const response = await axios.post(`${getServerUrlWithApi()}/orgs`, { name });
  if (response.status === 201) {
    return response.data;
  }
  return null;
}

export async function updateOrg(orgId: string, name: string): Promise<Organization | null> {
  const response = await axios.put(`${getServerUrlWithApi()}/orgs/${orgId}`, { name });
  if (response.status === 200) {
    return response.data;
  }
  return null;
}

export async function deleteOrg(orgId: string): Promise<boolean> {
  const response = await axios.delete(`${getServerUrlWithApi()}/orgs/${orgId}`);
  return response.status === 204;
}

export async function getOrgMembers(orgId: string): Promise<OrganizationMember[]> {
  const response = await axios.get(`${getServerUrlWithApi()}/orgs/${orgId}/members`);
  if (response.status === 200) {
    return response.data;
  }
  return [];
}

export async function addOrgMember(orgId: string, email: string, role: string): Promise<OrganizationMember | null> {
  const response = await axios.post(`${getServerUrlWithApi()}/orgs/${orgId}/members`, { email, role });
  if (response.status === 201) {
    return response.data;
  }
  return null;
}


export async function updateOrgMemberRole(orgId: string, userId: string, role: string): Promise<OrganizationMember | null> {
  const response = await axios.put(`${getServerUrlWithApi()}/orgs/${orgId}/members/${userId}`, { role });
  if (response.status === 200) {
    return response.data;
  }
  return null;
}

export async function removeOrgMember(orgId: string, userId: string): Promise<boolean> {
  const response = await axios.delete(`${getServerUrlWithApi()}/orgs/${orgId}/members/${userId}`);
  return response.status === 204;
}

/** PROJECT calls */

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    email: string;
  };
  orgs?: {
    org: {
      id: string;
      name: string;
    };
  }[];
}



export async function getProjects(): Promise<Project[]> {
  const response = await axios.get(`${getServerUrlWithApi()}/projects`);
  if (response.status === 200) {
    return response.data;
  }
  return [];
}

export async function createProject(payload: { name: string }): Promise<Project | null> {
  const response = await axios.post(`${getServerUrlWithApi()}/projects`, payload);
  if (response.status === 201) {
    return response.data;
  }
  return null;
}

export async function getOrgProjects(orgId: string): Promise<Project[]> {
  const response = await axios.get(`${getServerUrlWithApi()}/orgs/${orgId}/projects`);
  if (response.status === 200) {
    return response.data;
  }
  return [];
}

export async function getPersonalProjects(): Promise<Project[]> {
  const response = await axios.get(`${getServerUrlWithApi()}/projects/personal`);
  if (response.status === 200) {
    return response.data;
  }
  return [];
}

export async function transferProjectToOrg(projectId: string, orgId: string): Promise<boolean> {
  const response = await axios.post(`${getServerUrlWithApi()}/projects/${projectId}/orgs`, { orgId });
  return response.status === 201;
}

export async function revokeOrgFromProject(projectId: string, orgId: string): Promise<boolean> {
  const response = await axios.delete(`${getServerUrlWithApi()}/projects/${projectId}/orgs/${orgId}`);
  return response.status === 204;
}

export async function updateProject(projectId: string, payload: { name: string }): Promise<Project | null> {
  const response = await axios.put(`${getServerUrlWithApi()}/projects/${projectId}`, payload);
  if (response.status === 200) {
    return response.data;
  }
  return null;
}

// ── Datasources ──────────────────────────────────────────────────────────────

export type DatasourceItem = {
  id: string;
  name?: string;
  description?: string;
  data?: any;
  publish: boolean;
  isTrasposed: boolean;
  remoteUrl?: string;
  isRemote: boolean;
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function getDatasources(): Promise<DatasourceItem[]> {
  const response = await axios.get(`${getServerUrlWithApi()}/datasources`);
  if (response.status === 200) return response.data;
  return [];
}

export async function getDatasource(id: string): Promise<DatasourceItem | null> {
  const response = await axios.get(`${getServerUrlWithApi()}/datasources/${id}`);
  if (response.status === 200) return response.data;
  return null;
}

export async function createDatasource(payload: {
  name: string;
  description?: string;
}): Promise<{ id: string } | null> {
  const response = await axios.post(`${getServerUrlWithApi()}/datasources`, {
    ...payload,
    data: [],
    publish: true,
    isRemote: false,
  });
  if (response.status === 201) return { id: response.data.id };
  return null;
}

export async function upsertDatasource(payload: any, id?: string): Promise<{ id: string } | null> {
  const lockKey = id ? `upsert:datasource:${id}` : "upsert:datasource:new";
  return withMutationGuard(lockKey, async () => {
    const url = id
      ? `${getServerUrlWithApi()}/datasources/${id}`
      : `${getServerUrlWithApi()}/datasources`;
    const response = await (id ? axios.put(url, payload) : axios.post(url, payload));
    if (response.status === 200 || response.status === 201) {
      return response.data as { id: string };
    }
    return null;
  });
}

export async function deleteDatasource(id: string): Promise<boolean> {
  const response = await axios.delete(`${getServerUrlWithApi()}/datasources/${id}`);
  return response.status === 204;
}

// ── Admin ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  ownedProjects: { id: string; name: string }[];
  projectMember: { project: { id: string; name: string } }[];
  memberships: { org: { name: string; projects: { project: { id: string; name: string } }[] } }[];
}

export async function adminGetUsers(): Promise<AdminUser[]> {
  const response = await axios.get(`${getServerUrlWithApi()}/admin/users`);
  if (response.status === 200) return response.data;
  return [];
}

export async function adminDeleteUser(id: string): Promise<boolean> {
  const response = await axios.delete(`${getServerUrlWithApi()}/admin/users/${id}`);
  return response.status === 200;
}

export async function adminActivateUser(id: string): Promise<boolean> {
  const response = await axios.post(`${getServerUrlWithApi()}/admin/users/${id}/activate`);
  return response.status === 200;
}

export async function adminResendActivation(id: string): Promise<boolean> {
  const response = await axios.post(`${getServerUrlWithApi()}/admin/users/${id}/resend-activation`);
  return response.status === 200;
}

export async function adminResetPassword(id: string): Promise<boolean> {
  const response = await axios.post(`${getServerUrlWithApi()}/admin/users/${id}/reset-password`);
  return response.status === 200;
}



