import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  roles?: string[];
};

function ProtectedRoute({
  children,
  roles = [],
}: Props) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(role || "")) {
    if (role === "WAITER" || role === "CHEF" || role === "CASHIER") {
      return <Navigate to="/orders" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;