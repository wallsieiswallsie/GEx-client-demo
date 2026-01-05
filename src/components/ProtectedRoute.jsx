import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ForbiddenPage from "../pages/errors/ForbiddenPage";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, initializing } = useAuth();

  if (initializing) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login-customer" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <ForbiddenPage />;
  }

  return children;
}

export default ProtectedRoute;