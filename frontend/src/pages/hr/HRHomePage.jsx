import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "../pages/common/LoginPage";
import RegisterPage from "../pages/employee/RegisterPage";

import HRHomePage from "../pages/hr/HRHomePage";
import EmployeeProfilesPage from "../pages/hr/EmployeeProfilesPage";
import EmployeeDetailPage from "../pages/hr/EmployeeDetailPage";
import VisaStatusManagementPage from "../pages/hr/VisaStatusManagementPage";
import HiringManagementPage from "../pages/hr/HiringManagementPage";
import RegistrationTokenPage from "../pages/hr/RegistrationTokenPage";
import OnboardingReviewPage from "../pages/hr/OnboardingReviewPage";
import ApplicationDetailPage from "../pages/hr/ApplicationDetailPage";

/*
  AppRoutes controls frontend page routes.

  Frontend route = the URL user sees in browser.
  Backend API route = the URL frontend uses to request backend data.

  Example:
  Frontend page:
  /hr/hiring-management/registration-token

  Backend APIs used inside that page:
  POST /api/hr/registration-token
  GET  /api/hr/registration-tokens
*/

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register/:token" element={<RegisterPage />} />

      {/* HR routes */}
      <Route
        path="/hr/home"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRHomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/employee-profiles"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <EmployeeProfilesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/employee-profiles/:employeeId"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <EmployeeDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/visa-status-management"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <VisaStatusManagementPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/hiring-management"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HiringManagementPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/hiring-management/registration-token"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <RegistrationTokenPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/hiring-management/onboarding-review"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <OnboardingReviewPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/hiring-management/applications/:applicationId"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <ApplicationDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Unknown route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}