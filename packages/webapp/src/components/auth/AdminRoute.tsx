import React from "react";
import { Navigate } from "react-router-dom";
import { useUserStore, useAuthGate } from "../../lib/store/user_store";
import { ROUTES } from "../../router";
import AuthLoading from "./AuthLoading";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const gate = useAuthGate();
  const user = useUserStore((s) => s.user);

  // Wait for cookie hydration so a valid admin tab isn't bounced before getUser resolves.
  if (gate === "loading") return <AuthLoading />;
  if (gate === "anon") return <Navigate to={ROUTES.login} replace />;
  if (user?.role !== "ADMIN") return <Navigate to={ROUTES.home} replace />;

  return <>{children}</>;
};

export default AdminRoute;
