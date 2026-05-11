import React from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../../lib/store/user_store";
import { ROUTES } from "../../router";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user } = useUserStore();

  if (!user) return <Navigate to={ROUTES.login} replace />;
  if (user.role !== "ADMIN") return <Navigate to={ROUTES.home} replace />;

  return <>{children}</>;
};

export default AdminRoute;
