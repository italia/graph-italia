import { createBrowserRouter } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/auth/AuthPage";
import DashboardCreatePage from "./pages/dashboard/DashboardCreatePage";
import DashboardEditPage from "./pages/dashboard/DashboardEditPage";
import DashboardsPage from "./pages/dashboard/DashboardListPage";
import DashboardViewPage from "./pages/show/ShowDashboardPage";
import EmbedChartPage from "./pages/embed/EmbedChartPage";
import EmbedDashboardPage from "./pages/embed/EmbedDashboardPage";
import GenerateDataPage from "./pages/utility/GenerateDataPage";
import GeoMapUtilsPage from "./pages/utility/GeoMapUtilsPage";
import HomePage from "./pages/Home";
import LoadDataPage from "./pages/utility/LoadRemoteDataPage";
import ShowChartPage from "./pages/show/ShowChartPage";
import VerifyPage from "./pages/auth/VerifyPage";
import RecoverPage from "./pages/auth/RecoverPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AboutPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/enter",
    element: <AuthPage />,
  },
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
  //show chart page
  {
    path: "/chart/:id",
    element: <ShowChartPage />,
  },
  //embed chart page
  {
    path: "/embed/:id",
    element: <EmbedChartPage />,
  },
  {
    path: "/dashboards/create",
    element: <DashboardCreatePage />,
  },
  {
    path: "/dashboards/:id/edit",
    element: <DashboardEditPage />,
  },
  {
    path: "/dashboards/:id/view",
    element: <DashboardViewPage />,
  },
  {
    path: "/dashboards/:id/embed",
    element: <EmbedDashboardPage />,
  },
  //list dashboard page
  {
    path: "/dashboards",
    element: <DashboardsPage />,
  },
  //create dashboard page
  {
    path: "/geo",
    element: <GeoMapUtilsPage />,
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
]);

export default router;
