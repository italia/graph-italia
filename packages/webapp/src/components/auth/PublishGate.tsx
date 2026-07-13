import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthGate } from "../../lib/store/user_store";
import { isPublishingEnabled } from "../../lib/api";
import { ROUTES } from "../../router";
import AuthLoading from "./AuthLoading";

interface PublishGateProps {
  children: React.ReactNode;
}

/**
 * Guards the /display/* (public "show") routes. When public publishing is
 * enabled (the default), passes children through unauthenticated exactly as
 * before — these pages read the publish-gated public endpoint themselves.
 * When VITE_ENABLE_PUBLIC_PUBLISHING is disabled on this instance, /display/*
 * is no longer a public share page: it becomes an authenticated-only preview,
 * so anonymous visitors are redirected to /login instead of seeing the chart.
 */
const PublishGate: React.FC<PublishGateProps> = ({ children }) => {
  const gate = useAuthGate();

  if (isPublishingEnabled()) return <>{children}</>;

  if (gate === "loading") return <AuthLoading />;
  if (gate === "anon") return <Navigate to={ROUTES.login} replace />;
  return <>{children}</>;
};

export default PublishGate;
