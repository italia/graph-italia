import { createBrowserRouter, type RouteObject } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LandingPage from "./pages/about";
import AuthPage from "./pages/auth/AuthPage";
import RecoverPage from "./pages/auth/RecoverPage";
import VerifyPage from "./pages/auth/VerifyPage";
import EditChartPage from "./pages/charts/editChart";
import EditKpiGroupPage from "./pages/charts/EditKpiGroup";
import DashboardEditPage from "./pages/dashboard/DashboardEditPage";
import DashboardsPage from "./pages/dashboard/DashboardListPage";
import EmbedChartPage from "./pages/embed/EmbedChartPage";
import EmbedDashboardPage from "./pages/embed/EmbedDashboardPage";
import PolicyPage from "./pages/gdpr";
import QuickStartPage from "./pages/QuickStartPage";
import RootRoute from "./pages/RootRoute";
import ShowChartPage from "./pages/show/ShowChartPage";
import DashboardViewPage from "./pages/show/ShowDashboardPage";
import TermsPage from "./pages/terms";
import GenerateDataPage from "./pages/utility/GenerateDataPage";
import GeoMapUtilsPage from "./pages/utility/GeoMapUtilsPage";
import LoadDataPage from "./pages/utility/LoadRemoteDataPage";

export const HOME_ROUTE = "/";

// Assertion necessaria per compatibilità React 19 / react-router-dom (element: ReactElement vs ReactNode)
const routes = [
  // Root: landing se non loggato, home Charts se loggato
  {
    path: HOME_ROUTE,
    element: <RootRoute />,
  },
  // Landing page raggiungibile anche da /about
  {
    path: "/about",
    element: <LandingPage />,
  },
  // Guida rapida / Quick Start
  {
    path: "/quickstart",
    element: <QuickStartPage />,
  },
  //PRIVATE PART
  {
    path: "/edit/chart/:id?",
    element: (
      <ProtectedRoute>
        <EditChartPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "edit/kpi/:id?",
    element: (
      <ProtectedRoute>
        <EditKpiGroupPage />
      </ProtectedRoute>
    ),
  },
  // {
  // 	path: "/edit/map/:id?",
  // 	element: (
  // 		<ProtectedRoute>
  // 			<EditPointMapPage />
  // 		</ProtectedRoute>
  // 	),
  // },
  //list dashboard page
  {
    path: "/dashboards",
    element: (
      <ProtectedRoute>
        <DashboardsPage />
      </ProtectedRoute>
    ),
  },
  //edit dashboard page
  {
    path: "/dashboards/:id/edit",
    element: (
      <ProtectedRoute>
        <DashboardEditPage />
      </ProtectedRoute>
    ),
  },
  //PUBLIC PART
  {
    path: "/gdpr",
    element: <PolicyPage />,
  },
  {
    path: "/terms-of-service",
    element: <TermsPage />,
  },
  //AUTH STUFF
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/verify/:uid",
    element: <VerifyPage />,
  },
  {
    path: "/recover-password",
    element: <RecoverPage action={"recover"} />,
  },
  {
    path: "/change-password",
    element: <RecoverPage action={"change"} />,
  },
  //TOOLS
  //load data page
  {
    path: "/load-data",
    element: <LoadDataPage />,
  },
  //generate data page
  {
    path: "/generate-data",
    element: <GenerateDataPage />,
  },
  {
    path: "/geo",
    element: <GeoMapUtilsPage />,
  },

  // DISPLAY PART
  //show chart page
  {
    path: "/charts/:id/view",
    element: <ShowChartPage />,
  },
  //embed chart page
  {
    path: "/charts/:id/embed",
    element: <EmbedChartPage />,
  },
  {
    path: "/dashboards/:id/view",
    element: <DashboardViewPage />,
  },
  {
    path: "/dashboards/:id/embed",
    element: <EmbedDashboardPage />,
  },
] as RouteObject[];

const router = createBrowserRouter(routes);

export default router;
