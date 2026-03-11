import { createBrowserRouter, type RouteObject } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AboutPage from "./pages/about";
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
import PrivateAreePage from "./pages/home";
import QuickStartPage from "./pages/QuickStartPage";
import ShowChartPage from "./pages/show/ShowChartPage";
import DashboardViewPage from "./pages/show/ShowDashboardPage";
import RootRoute from "./pages/Splash";
import TermsPage from "./pages/terms";
import GenerateDataPage from "./pages/utility/GenerateDataPage";
import GeneratePoiPage from "./pages/utility/GeneratePoiPage";
import GeoMapUtilsPage from "./pages/utility/GeoMapUtilsPage";
import LoadDataPage from "./pages/utility/LoadRemoteDataPage";

export const HOME_ROUTE = "/home";
type TMenuItem = { name: string; link: string; translationKey?: string };
export type MenuSubItem = TMenuItem;
export type MenuItem =
  | TMenuItem
  | (TMenuItem & { subMenu: readonly MenuSubItem[] });

const MENU_ITEMS_TRANSLATION_KEYS = "router.menu.items";

export const MENU: readonly MenuItem[] = [
  {
    name: "Charts",
    translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.charts.label`,
    link: HOME_ROUTE || "/",
  },
  {
    name: "Tools",
    translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.tools.label`,
    link: "",
    subMenu: [
      {
        name: "Quick Start",
        translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.tools.subItems.quickStart.label`,
        link: "/quickstart",
      },
      {
        name: "Generate Data",
        translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.tools.subItems.generateData.label`,
        link: "/generate-data",
      },
      {
        name: "Generate Pois",
        translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.tools.subItems.generatePois.label`,
        link: "/generate-poi",
      },
      {
        name: "Load Remote Data",
        translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.tools.subItems.loadRemoteData.label`,
        link: "/load-data",
      },
      {
        name: "Check GeoJSon File",
        translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.tools.subItems.geo.label`,
        link: "/geo",
      },
    ],
  },
];
// Assertion necessaria per compatibilità React 19 / react-router-dom (element: ReactElement vs ReactNode)
const routes = [
  // Root: landing se non loggato, home Charts se loggato
  {
    path: HOME_ROUTE,
    element: <PrivateAreePage />,
  },
  // Root: landing se non loggato, home Charts se loggato
  {
    path: "/",
    element: <RootRoute />,
  },
  // Landing page raggiungibile anche da /about
  {
    path: "/about",
    element: <AboutPage />,
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
    path: "/generate-poi",
    element: <GeneratePoiPage />,
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
