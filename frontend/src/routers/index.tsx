import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout.js";
import HomePage from "../pages/home/HomePage.js";
import { AdminLoginPage } from "../pages/admin/AdminLoginPage.js";
import { ProtectedRoute } from "../components/ProtectedRoute.js";
import { AdminLayout } from "../layout/AdminLayout.js";
import { AdminOverviewPage } from "../pages/admin/AdminOverviewPage.js";
import { AdminProjectsPage } from "../pages/admin/AdminProjectsPage.js";
import { AdminSkillsPage } from "../pages/admin/AdminSkillsPage.js";
import { AdminExperiencesPage } from "../pages/admin/AdminExperiencesPage.js";
import { AdminEducationPage } from "../pages/admin/AdminEducationPage.js";
import { AdminCertificatesPage } from "../pages/admin/AdminCertificatesPage.js";
import { AdminVisitorsPage } from "../pages/admin/AdminVisitorsPage.js";

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
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminOverviewPage />,
          },
          {
            path: "projects",
            element: <AdminProjectsPage />,
          },
          {
            path: "skills",
            element: <AdminSkillsPage />,
          },
          {
            path: "experiences",
            element: <AdminExperiencesPage />,
          },
          {
            path: "education",
            element: <AdminEducationPage />,
          },
          {
            path: "certificates",
            element: <AdminCertificatesPage />,
          },
          {
            path: "visitors",
            element: <AdminVisitorsPage />,
          },
        ],
      },
    ],
  },
]);