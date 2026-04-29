import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Not logged in: go to login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role: show business error page.
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}