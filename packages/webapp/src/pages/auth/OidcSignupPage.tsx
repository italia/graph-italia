import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import OidcEmailVerification from "../../components/auth/OidcEmailVerification";
import SignUp from "../../components/auth/SignUp";
import Layout from "../../components/layout";
import * as api from "../../lib/api";
import { broadcastAuth } from "../../lib/authChannel";
import { useUserStore } from "../../lib/store/user_store";
import { HOME_ROUTE, ROUTES } from "../../router";

type Status = "checking" | "email" | "form" | "registered";

/**
 * Landing page for the OIDC signup flow. The server redirects here (with `?t=<sub>`)
 * when a SPID/CIE login matches no account — neither by email nor by a linked `sub`.
 * We ask the server, via the still-valid OIDC session, for the signup state:
 * - already registered → bounce back through OIDC login, which now resolves it;
 * - email not known yet (the IdP sent none) → ask it and confirm it with a code;
 *   if it belongs to an existing account the server links it and logs in;
 * - email known and verified → signup form with the email locked.
 */
function OidcSignupPage() {
  const { t } = useTranslation("pages", { keyPrefix: "auth.oidc" });
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [status, setStatus] = useState<Status>("checking");
  const [email, setEmail] = useState("");
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
          // login OIDC, che ora troverà l'account e aprirà la sessione.
          setStatus("registered");
          setTimeout(() => {
            window.location.href = api.redirectToLoginOidc();
          }, 1200);
        } else if (res.emailVerified) {
          setEmail(res.email);
          setStatus("form");
        } else {
          setStatus("email");
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

  // The verified email belonged to an existing account: the session is open.
  const handleLoggedIn = async () => {
    const user = await api.getUser();
    setUser(user);
    broadcastAuth("login"); // let other open tabs pick up the new session
    navigate(HOME_ROUTE);
  };

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
        {status === "email" && (
          <OidcEmailVerification
            onLoggedIn={handleLoggedIn}
            onVerified={(verifiedEmail) => {
              setEmail(verifiedEmail);
              setStatus("form");
            }}
          />
        )}
        {status === "form" && <SignUp oidc={{ email }} />}
      </div>
    </Layout>
  );
}

export default OidcSignupPage;
