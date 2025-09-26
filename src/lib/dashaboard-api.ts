import * as auth from './auth';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
let headers: HeadersInit | undefined = { 'Content-Type': 'application/json' };

const DASHBOARD_API_PATH = `${SERVER_URL}/dashboards`;

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

/** Get a chart */
export async function getChart(id: string) {
  const response = await fetch(`${SERVER_URL}/charts/${id}`, {
    method: 'GET',
    headers: {
      ...headers,
      // Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
}
export async function getCharts() {
  const response = await fetch(`${SERVER_URL}/charts`, {
    method: 'GET',
    headers: {
      ...headers,
      // Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
}

/* List */
export async function getDashboards() {
  const response = await fetch(DASHBOARD_API_PATH, {
    method: 'GET',
    headers: {
      ...headers,
      // Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
}

export async function findById(id: string) {
  const response = await fetch(`${DASHBOARD_API_PATH}/${id}`, {
    method: 'GET',
    headers: {
      ...headers,
      // Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    const data = await response.json();
    return data as DashboardDetail;
  }

  throw new Error('Server error');
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
  const response = await fetch(`${DASHBOARD_API_PATH}/${id}/slots`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      ...headers,
      // Authorization: `Bearer ${token}`,
    },
  });

  return response.status === 200;
}

export async function deleteDashaboard(id: string) {
  const response = await fetch(`${DASHBOARD_API_PATH}/${id}`, {
    method: 'DELETE',
    headers: {
      ...headers,
      // Authorization: `Bearer ${token}`,
    },
  });

  return response.status === 204;
}

export async function createDashboard(payload: {
  name: string;
  description: string;
}) {
  const body = JSON.stringify(payload);

  const response = await fetch(`${DASHBOARD_API_PATH}`, {
    method: 'POST',
    headers: {
      ...headers,
      // Authorization: `Bearer ${token}`,
    },
    body,
  });

  const { id } = await response.json();

  return { id } as { id: string };
}
