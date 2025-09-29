import axios from 'axios';
axios.defaults.withCredentials = true;

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

let headers: HeadersInit | undefined = { 'Content-Type': 'application/json' };

/** getSuggestions */
export async function getSuggestions(inputData: (string | number)[][]) {
  // const token = auth.getAuth();
  // if (!token) return null;
  const url = `${SERVER_URL}/hints/`;
  const data = JSON.stringify(inputData.slice(0, 5));
  const response = await axios.post(url, data);
  console.log('hints', response.status);
  if (response.status === 401) {
    return logout();
  }
  if (response.status === 200) {
    return response.data;
  }
  return null;
}

/** Upsert */
export async function upsertChart(payload: any, id?: string) {
  // const token = auth.getAuth();
  // if (!token) return null;
  const url = id ? `${SERVER_URL}/charts/${id}` : `${SERVER_URL}/charts/`;
  const method = id ? 'PUT' : 'POST';

  let response = await (method === 'PUT'
    ? axios.put(url, payload)
    : axios.post(url, payload));
  console.log('UPSERT-CHART', response.status);

  // if (response.status === 401) {
  //   return logout();
  // }
  if (response.status === 200) {
    return response.data;
  }

  return null;
}

/** Delete */
export async function deleteChart(id: string) {
  const response = await axios.delete(`${SERVER_URL}/charts/${id}`);
  console.log('deleteChart', response.status);
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
  const response = await axios.get(`${SERVER_URL}/charts`);

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

export async function getUser() {
  const response = await axios(`${SERVER_URL}/auth/user`, {
    method: 'GET',
  });
  console.log('response status', response.status);
  console.log('response data', response.data);
  return response.data;
}

export function logout() {
  return axios.get(`${SERVER_URL}/auth/logout`);
}

/** Login */
export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) {
  const response = await axios.post(`${SERVER_URL}/auth/login`, {
    email,
    password,
  });
  const data = response.data;
  if (response.status === 200) {
    console.log('LOGGED IN', data);
    return true;
  } else {
    console.log('ERROR', data);
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
    const response = await axios.post(`${SERVER_URL}/auth/register`, {
      email,
      password,
    });
    const data = response.data;
    console.log('RESPONSE DATA', data);
    if (response.status === 200) {
      return true;
    }
  } catch (error: any) {
    console.log('REGISTER ERROR', error.message);
    throw error;
  }
}

export async function showChart(id: string) {
  const response = await axios(`${SERVER_URL}/charts/show/${id}`, {
    method: 'GET',
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

export async function verify({ uid, code }: { uid: string; code: string }) {
  try {
    const response = await axios.post(`${SERVER_URL}/auth/verify`, {
      uid,
      code,
    });
    if (response.status === 200) {
      return true;
    }
  } catch (error: any) {
    console.log('verify ERROR', error?.message);
    throw error;
  }
  return false;
}

export async function changePasssword({ password }: { password: string }) {
  try {
    const response = await axios.put(`${SERVER_URL}/auth/pwd`, {
      password,
    });
    if (response.status === 204) {
      return true;
    }
  } catch (error: any) {
    console.log('changePasssword ERROR', error?.message);
    throw error;
  }
}

export async function activate() {
  try {
    const response = await axios.post(`${SERVER_URL}/auth/init`);
    if (response.status === 200) {
      return true;
    }
  } catch (error: any) {
    console.log('changePasssword ERROR', error?.message);
    throw error;
  }
}

export async function recoverPasssword(email: string) {
  try {
    const response = await axios.post(`${SERVER_URL}/auth/recover`, { email });
    if (response.status === 200) {
      return true;
    }
  } catch (error: any) {
    console.log('recoverPasssword ERROR', error?.message);
    throw error;
  }
}
