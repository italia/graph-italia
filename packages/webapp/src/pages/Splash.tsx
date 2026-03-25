import ProtectedRoute from "../components/auth/ProtectedRoute";
import { useUserStore } from "../lib/store/user_store";
import LandingPage from "./about";
import HomePage from "./private";

/**
 * Su "/" : se non loggato → landing page (con SlimHeader);
 * se loggato → home (Charts).
 */
export default function RootRoute() {
  const { user } = useUserStore();

  if (user) {
    return (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    );
  }

  return <LandingPage />;
}
