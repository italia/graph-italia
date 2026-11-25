import React from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { isPasswordAuthEnabled, isPasswordRecoveryEnabled } from "../../lib/api";
import { ROUTES } from "../../router";

interface PasswordAuthGateProps {
  children: React.ReactNode;
  /**
   * Also let the page through when only password recovery is on (SPID/CIE-only
   * instance with the hidden login enabled): "page" for the recovery and
   * change-password pages, "resetLink" for /verify/:uid opened from a reset
   * email (?action=reset) — activation links stay blocked.
   */
  recovery?: "page" | "resetLink";
}

/**
 * Guards the email/password-only pages (activation, password recovery and
 * reset). On a SPID/CIE-only instance (the server's ENABLE_PASSWORD_AUTH, read
 * at startup from GET /config) their endpoints answer 403, so visitors are sent
 * to /login, which offers SPID/CIE instead — except the recovery pages while
 * the server keeps password recovery available.
 */
const PasswordAuthGate: React.FC<PasswordAuthGateProps> = ({ children, recovery }) => {
  const [searchParams] = useSearchParams();
  if (isPasswordAuthEnabled()) return <>{children}</>;
  const recoveryAllowed =
    isPasswordRecoveryEnabled() &&
    (recovery === "page" || (recovery === "resetLink" && searchParams.get("action") === "reset"));
  if (recoveryAllowed) return <>{children}</>;
  return <Navigate to={ROUTES.login} replace />;
};

export default PasswordAuthGate;
