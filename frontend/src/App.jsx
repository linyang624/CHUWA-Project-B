import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OnboardingApplicationPage from "./pages/OnboardingApplicationPage";
import PersonalInformationPage from "./pages/PersonalInformationPage";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/:token" element={<RegisterPage />} />

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