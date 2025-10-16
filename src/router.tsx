import { createBrowserRouter } from 'react-router-dom';
import AboutPage from './pages';
import AuthPage from './pages/auth/AuthPage';
import DashboardEditPage from './pages/dashboard/DashboardEditPage';
import DashboardsPage from './pages/dashboard/DashboardListPage';
import DashboardViewPage from './pages/show/ShowDashboardPage';
import EmbedChartPage from './pages/embed/EmbedChartPage';
import EmbedDashboardPage from './pages/embed/EmbedDashboardPage';
import GenerateDataPage from './pages/utility/GenerateDataPage';
import GeoMapUtilsPage from './pages/utility/GeoMapUtilsPage';
import HomePage from './pages/charts';
import LoadDataPage from './pages/utility/LoadRemoteDataPage';
import ShowChartPage from './pages/show/ShowChartPage';
import VerifyPage from './pages/auth/VerifyPage';
import RecoverPage from './pages/auth/RecoverPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

const router = createBrowserRouter([
  //PRIVATE PART
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  //list dashboard page
  {
    path: '/dashboards',
    element: (
      <ProtectedRoute>
        <DashboardsPage />
      </ProtectedRoute>
    ),
  },
  //edit dashboard page
  {
    path: '/dashboards/:id/edit',
    element: (
      <ProtectedRoute>
        <DashboardEditPage />
      </ProtectedRoute>
    ),
  },
  //PUBLIC PART
  {
    path: '/',
    element: <AboutPage />,
  },
  //AUTH STUFF
  {
    path: '/login',
    element: <AuthPage />,
  },
  {
    path: '/verify/:uid',
    element: <VerifyPage />,
  },
  {
    path: '/recover-password',
    element: <RecoverPage action={'recover'} />,
  },
  {
    path: '/change-password',
    element: <RecoverPage action={'change'} />,
  },
  //TOOLS
  //load data page
  {
    path: '/load-data',
    element: <LoadDataPage />,
  },
  //generate data page
  {
    path: '/generate-data',
    element: <GenerateDataPage />,
  },
  {
    path: '/geo',
    element: <GeoMapUtilsPage />,
  },

  // DISPLAY PART
  //show chart page
  {
    path: '/charts/:id/view',
    element: <ShowChartPage />,
  },
  //embed chart page
  {
    path: '/charts/:id/embed',
    element: <EmbedChartPage />,
  },
  {
    path: '/dashboards/:id/view',
    element: <DashboardViewPage />,
  },
  {
    path: '/dashboards/:id/embed',
    element: <EmbedDashboardPage />,
  },
]);

export default router;
