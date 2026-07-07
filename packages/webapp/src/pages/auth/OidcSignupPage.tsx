import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import SignUp from "../../components/auth/SignUp";
import Layout from "../../components/layout";
import * as api from "../../lib/api";
import { ROUTES } from "../../router";

type Status = "checking" | "form" | "registered";

/**
 * Landing page for the OIDC signup flow. The server redirects here (with `?t=<sub>`)
 * when an OIDC login has no account linked to that `sub`. Before rendering the SignUp
 * form we ask the server — via the still-valid OIDC session — whether this `sub` has
 * already completed registration; if so we bounce back through OIDC login (which now
 * resolves the account by `sub`), otherwise we show the form prefilled with the claims.
 */
function OidcSignupPage() {
  const { t } = useTranslation("pages", { keyPrefix: "auth.oidc" });
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("checking");
  const [defaultEmail, setDefaultEmail] = useState("");
  // The `sub` is carried in the URL for reference; the server trusts the session, not this.
  const sub = new URLSearchParams(window.location.search).get("t");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.getOidcSignupStatus(sub);
        if (!active) return;
        if (res.registered) {
          // Registrazione già completata (es. doppio submit / altra scheda): rifai il
          // login OIDC, che ora troverà l'account per `sub` e aprirà la sessione.
          setStatus("registered");
          setTimeout(() => {
            window.location.href = api.redirectToLoginOidc();
          }, 1200);
        } else {
          setDefaultEmail(res.email || "");
          setStatus("form");
        }
      } catch {
        // Nessuna sessione OIDC valida (401) o errore di rete → torna al login.
        if (active) navigate(ROUTES.login);
      }
    })();
    return () => {
      active = false;
    };
  }, [sub, navigate]);

  return (
    <Layout>
      <div className="flex flex-col min-h-full justify-center items-center px-4 sm:px-6 lg:px-8">
        {status === "checking" && (
          <span
            className="loading loading-spinner loading-lg"
            aria-label={t("loading")}
          />
        )}
        {status === "registered" && (
          <div role="alert" className="alert alert-info mb-2">
            <p className="text-lg">{t("alreadyRegistered")}</p>
          </div>
        )}
        {status === "form" && (
          <SignUp oidc={{ sub: sub ?? undefined, defaultEmail }} />
        )}
      </div>
    </Layout>
  );
}

export default OidcSignupPage;
