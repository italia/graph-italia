import { createBrowserRouter, type RouteObject } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AboutPage from "./pages/about";
import AuthPage from "./pages/auth/AuthPage";
import OidcSignupPage from "./pages/auth/OidcSignupPage";
import RecoverPage from "./pages/auth/RecoverPage";
import VerifyPage from "./pages/auth/VerifyPage";
import EditChartPage from "./pages/private/EditChart";
import EditDataSourcePage from "./pages/private/EditDataSource";
import EditMapPage from "./pages/private/EditMap";
import EditKpiGroupPage from "./pages/private/EditKpiGroup";
import DashboardEditPage from "./pages/private/EditDashboard";
import EmbedChartPage from "./pages/embed/EmbedChartPage";
import EmbedDashboardPage from "./pages/embed/EmbedDashboardPage";
import PolicyPage from "./pages/gdpr";
import DocsPage from "./pages/DocsPage";
import PrivateAreaPage from "./pages/private";
import EditApiKeysPage from "./pages/private/EditApiKeys";
import EditOrgsPage from "./pages/private/EditOrgs";
import EditSettingsPage from "./pages/private/EditSettings";
import GodModeOnPage from "./pages/private/GodModeOn";
import AdminRoute from "./components/auth/AdminRoute";
import PublishGate from "./components/auth/PublishGate";
import EmbedGate from "./components/embed/EmbedGate";
import QuickStartPage from "./pages/QuickStartPage";


import ShowChartPage from "./pages/display/ShowChartPage";
import DashboardViewPage from "./pages/display/ShowDashboardPage";
import RootRoute from "./pages/Splash";
import TermsPage from "./pages/terms";
import GenerateDataPage from "./pages/utils/GenerateDataPage";
import GeneratePoiPage from "./pages/utils/GeneratePoiPage";
import GeoMapUtilsPage from "./pages/utils/GeoMapUtilsPage";
import LoadDataPage from "./pages/utils/LoadRemoteDataPage";

const MENU_ITEMS_TRANSLATION_KEYS = "menu.items" as const;

export const HOME_ROUTE = "/private/home";

/** Centralised route map. Use these everywhere instead of hardcoded strings. */
export const ROUTES = {
  // Public / misc
  root: "/",
  about: "/about",
  quickStart: "/quickstart",
  docs: (section?: string) => `/docs${section ? `/${section}` : ""}`,
  gdpr: "/gdpr",
  terms: "/terms-of-service",
  // Auth
  login: "/login",
  oidcSignup: "/oidc/signup",
  recoverPassword: "/recover-password",
  changePassword: "/change-password",
  verify: (uid: string) => `/verify/${uid}`,
  // Private – home
  home: HOME_ROUTE,
  // Private – editors (id optional → new item)
  editChart: (id?: string) => `/private/edit/chart${id ? `/${id}` : ""}`,
  editKpi: (id?: string) => `/private/edit/kpi${id ? `/${id}` : ""}`,
  editMap: (id?: string) => `/private/edit/map${id ? `/${id}` : ""}`,
  editDashboard: (id: string) => `/private/edit/dashboard/${id}`,
  editDataSource: (id?: string) => `/private/edit/datasource${id ? `/${id}` : ""}`,
  editApiKeys: "/private/edit/apikeys",
  editOrgs: "/private/edit/orgs",
  editSettings: "/private/edit/settings",
  godModeOn: "/private/god-mode-on",
  // Display / embed
  viewChart: (id: string) => `/display/charts/${id}`,
  embedChart: (id: string) => `/embed/charts/${id}`,
  viewDashboard: (id: string) => `/display/dashboards/${id}`,
  embedDashboard: (id: string) => `/embed/dashboards/${id}`,
  // Tools
  loadData: "/load-data",
  generateData: "/generate-data",
  generatePoi: "/generate-poi",
  geo: "/geo",
};



type TMenuItem = {
  name: string;
  link: string;
  requireAuth?: boolean;
  translationKey?: `${typeof MENU_ITEMS_TRANSLATION_KEYS}.${string}.label`;
};
export type MenuSubItem = TMenuItem;
export type MenuItem =
  | TMenuItem
  | (TMenuItem & { subMenu: readonly MenuSubItem[] });

export const MENU: readonly MenuItem[] = [
  // {
  //   name: "Charts",
  //   translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.charts.label`,
  //   link: ROUTES.home,
  // },
  {
    name: "Examples",
    requireAuth: false,
    translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.examples.label`,
    link: ROUTES.loadData,
  },
  {
    name: "Tools",
    requireAuth: false,
    translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.tools.label`,
    link: "",
    subMenu: [
      {
        name: "Generate Data",
        translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.tools.subItems.generateData.label`,
        link: ROUTES.generateData,
      },
      {
        name: "Generate Pois",
        translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.tools.subItems.generatePois.label`,
        link: ROUTES.generatePoi,
      },
    ],
  },
  {
    name: "Documentation",
    requireAuth: false,
    translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.docs.label`,
    link: ROUTES.docs(),
  },
  {
    name: "Settings",
    requireAuth: true,
    translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.settings.label`,
    link: "",
    subMenu: [
      {
        name: "API Keys",
        translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.settings.subItems.apikeys.label`,
        link: ROUTES.editApiKeys,
      },
      {
        name: "Organizations",
        translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.settings.subItems.orgs.label`,
        link: ROUTES.editOrgs,
      },
      {
        name: "Account Settings",
        translationKey: `${MENU_ITEMS_TRANSLATION_KEYS}.settings.subItems.accountSettings.label`,
        link: ROUTES.editSettings,
      },
    ],
  },
];


// Assertion necessaria per compatibilità React 19 / react-router-dom (element: ReactElement vs ReactNode)
const routes = [
  // Root: landing se non loggato, home Charts se loggato
  {
    path: HOME_ROUTE,
    element: (
      <ProtectedRoute>
        <PrivateAreaPage />
      </ProtectedRoute>
    ),
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
  // Documentazione
  {
    path: "/docs/:section?",
    element: <DocsPage />,
  },
  //PRIVATE PART
  {
    path: "/private/edit/chart/:id?",
    element: (
      <ProtectedRoute>
        <EditChartPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/private/edit/kpi/:id?",
    element: (
      <ProtectedRoute>
        <EditKpiGroupPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/private/edit/map/:id?",
    element: (
      <ProtectedRoute>
        <EditMapPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/private/edit/dashboard/:id",
    element: (
      <ProtectedRoute>
        <DashboardEditPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/private/edit/datasource/:id?",
    element: (
      <ProtectedRoute>
        <EditDataSourcePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/private/edit/apikeys",
    element: (
      <ProtectedRoute>
        <EditApiKeysPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/private/edit/orgs",
    element: (
      <ProtectedRoute>
        <EditOrgsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/private/edit/settings",
    element: (
      <ProtectedRoute>
        <EditSettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/private/god-mode-on",
    element: (
      <AdminRoute>
        <GodModeOnPage />
      </AdminRoute>
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
    path: "/oidc/signup",
    element: <OidcSignupPage />,
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

  // DISPLAY / EMBED PART
  {
    path: "/display/charts/:id",
    element: (
      <PublishGate>
        <ShowChartPage />
      </PublishGate>
    ),
  },
  {
    path: "/embed/charts/:id",
    element: (
      <EmbedGate>
        <EmbedChartPage />
      </EmbedGate>
    ),
  },
  {
    path: "/display/dashboards/:id",
    element: (
      <PublishGate>
        <DashboardViewPage />
      </PublishGate>
    ),
  },
  {
    path: "/embed/dashboards/:id",
    element: (
      <EmbedGate>
        <EmbedDashboardPage />
      </EmbedGate>
    ),
  },
] as RouteObject[];

const router = createBrowserRouter(routes);

export default router;
