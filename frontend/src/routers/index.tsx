import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout.js";
import HomePage from "../pages/home/HomePage.js";
import { ProtectedRoute } from "../components/ProtectedRoute.js";
import { RouteLoadingFallback } from "../components/RouteLoadingFallback.js";

// Lazy-loaded components for optimal bundle splitting and performance
const AdminLoginPage = lazy(() =>
  import("../pages/admin/AdminLoginPage.js").then((m) => ({ default: m.AdminLoginPage })),
);
const AdminLayout = lazy(() =>
  import("../layout/AdminLayout.js").then((m) => ({ default: m.AdminLayout })),
);
const AdminOverviewPage = lazy(() =>
  import("../pages/admin/AdminOverviewPage.js").then((m) => ({ default: m.AdminOverviewPage })),
);
const AdminProjectsPage = lazy(() =>
  import("../pages/admin/AdminProjectsPage.js").then((m) => ({ default: m.AdminProjectsPage })),
);
const AdminSkillsPage = lazy(() =>
  import("../pages/admin/AdminSkillsPage.js").then((m) => ({ default: m.AdminSkillsPage })),
);
const AdminExperiencesPage = lazy(() =>
  import("../pages/admin/AdminExperiencesPage.js").then((m) => ({ default: m.AdminExperiencesPage })),
);
const AdminEducationPage = lazy(() =>
  import("../pages/admin/AdminEducationPage.js").then((m) => ({ default: m.AdminEducationPage })),
);
const AdminCertificatesPage = lazy(() =>
  import("../pages/admin/AdminCertificatesPage.js").then((m) => ({ default: m.AdminCertificatesPage })),
);
const AdminVisitorsPage = lazy(() =>
  import("../pages/admin/AdminVisitorsPage.js").then((m) => ({ default: m.AdminVisitorsPage })),
);

const withLazy = (Component: ReactNode) => (
  <Suspense fallback={<RouteLoadingFallback />}>{Component}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: withLazy(<AdminLoginPage />),
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: withLazy(<AdminLayout />),
        children: [
          {
            index: true,
            element: withLazy(<AdminOverviewPage />),
          },
          {
            path: "projects",
            element: withLazy(<AdminProjectsPage />),
          },
          {
            path: "skills",
            element: withLazy(<AdminSkillsPage />),
          },
          {
            path: "experiences",
            element: withLazy(<AdminExperiencesPage />),
          },
          {
            path: "education",
            element: withLazy(<AdminEducationPage />),
          },
          {
            path: "certificates",
            element: withLazy(<AdminCertificatesPage />),
          },
          {
            path: "visitors",
            element: withLazy(<AdminVisitorsPage />),
          },
        ],
      },
    ],
  },
]);