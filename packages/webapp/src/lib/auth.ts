import { useEffect, useState } from "react";

function getItem(name: string) {
  return sessionStorage.getItem(name) || localStorage.getItem(name);
}

function isAuth() {
  const token = getItem("token");
  return token ? true : false;
}

function getAuth() {
  return getItem("token");
}

function saveAuth(token: string, remember: boolean) {
  if (remember) {
    localStorage.setItem("token", token);
  } else {
    sessionStorage.setItem("token", token);
  }
}

function logout() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  try {
    window.location.reload();
  } catch (error) {}
}

function useAuth() {
  const item = getItem("token");
  const [auth, setAuth] = useState(isAuth());
  useEffect(() => {
    setAuth(isAuth());
  }, [item]);
  return auth;
}
