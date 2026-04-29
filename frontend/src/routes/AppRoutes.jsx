import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "../pages/employee/LoginPage";
import ErrorPage from "../pages/common/ErrorPage";
import RegisterPage from "../pages/employee/RegisterPage";
import OnboardingApplicationPage from "../pages/employee/OnboardingApplicationPage";
import PersonalInformationPage from "../pages/employee/PersonalInformationPage";
import VisaStatusPage from "../pages/employee/VisaStatusPage";


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

  Frontend route:
  The URL user sees in browser, such as /hr/hiring-management.

  Backend API route:
  The URL frontend calls to get data, such as /api/hr/registration-token.
*/

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<LoginPage />} />

            {/* Register page is public, but RegisterPage must verify token inside the page */}
            <Route path="/register/:token" element={<RegisterPage />} />

            {/* Error routes */}
            <Route path="/access-denied" element={<ErrorPage />} />
            <Route path="/not-found" element={<ErrorPage />} />

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
            {/* Employee routes */}
            <Route
                path="/onboarding"
                element={
                    <ProtectedRoute allowedRoles={["employee"]}>
                        <OnboardingApplicationPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/personal-info"
                element={
                    <ProtectedRoute allowedRoles={["employee"]}>
                        <PersonalInformationPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/visa-status"
                element={
                    <ProtectedRoute allowedRoles={["employee"]}>
                        <VisaStatusPage />
                    </ProtectedRoute>
                }
            />
            {/* Unknown route */}
            <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
    );
}