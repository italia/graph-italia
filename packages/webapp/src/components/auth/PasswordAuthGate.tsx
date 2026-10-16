import React from "react";
import { Navigate } from "react-router-dom";
import { isPasswordAuthEnabled } from "../../lib/api";
import { ROUTES } from "../../router";

interface PasswordAuthGateProps {
  children: React.ReactNode;
}

/**
 * Guards the email/password-only pages (activation, password recovery and
 * reset). On a SPID/CIE-only instance (the server's ENABLE_PASSWORD_AUTH, read
 * at startup from GET /config) their endpoints answer 403, so visitors are sent
 * to /login, which offers SPID/CIE instead.
 */
const PasswordAuthGate: React.FC<PasswordAuthGateProps> = ({ children }) => {
  if (!isPasswordAuthEnabled()) return <Navigate to={ROUTES.login} replace />;
  return <>{children}</>;
};

export default PasswordAuthGate;
