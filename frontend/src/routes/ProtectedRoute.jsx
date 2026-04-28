import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // If the user is not authenticated, redirect to login.
  // "replace" prevents the protected page from staying in browser history,
  // so clicking the Back button will not return to this blocked page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; 
  }

  return children; // OnboardingApplicationPage
}