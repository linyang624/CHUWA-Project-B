import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/employee/LoginPage";
import RegisterPage from "./pages/employee/RegisterPage";
import OnboardingApplicationPage from "./pages/employee/OnboardingApplicationPage";
import PersonalInformationPage from "./pages/employee/PersonalInformationPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import VisaStatusPage from "./pages/employee/VisaStatusPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/:token" element={<RegisterPage />} />
      <Route path="/visa-status" element={<VisaStatusPage />} />

      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingApplicationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/personal-info"
        element={
          <ProtectedRoute>
            <PersonalInformationPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}