import ProtectedRoute from "../components/auth/ProtectedRoute";
import AuthLoading from "../components/auth/AuthLoading";
import { useAuthGate } from "../lib/store/user_store";
import LandingPage from "./about";
import HomePage from "./private";

/**
 * Su "/" : se non loggato → landing page (con SlimHeader);
 * se loggato → home (Charts).
 * Durante l'idratazione dal cookie mostra uno spinner per non far lampeggiare
 * la landing prima che la sessione sia risolta.
 */
export default function RootRoute() {
  const gate = useAuthGate();

  if (gate === "loading") return <AuthLoading />;

  if (gate === "authed") {
    return (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    );
  }

  return <LandingPage />;
}
