
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { auth } = useAuth();
  
//   // 1. Get current values from state or backup storage
//   const token = auth.token || localStorage.getItem("ps_token");
//   const role = auth.role || localStorage.getItem("ps_role");

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }


//   // 2. Normalize everything to lowercase for the comparison
//   const currentRole = String(role || "").toLowerCase();
//   const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

//   // 3. Check permission
//   if (!normalizedAllowed.includes(currentRole)) {
//     console.error(`Access Denied. Role: ${currentRole}, Allowed: ${normalizedAllowed}`);
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
// import { Navigate, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   // Use Redux state directly for the most reliable check
//   const { loggedIn, role } = useSelector((state) => state.auth);
//   const location = useLocation();

//   // 1. Check if user is logged in via the flag (since we don't use tokens in JS anymore)
//   if (!loggedIn) {
//     console.warn("No active session found. Redirecting to login.");
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // 2. Normalize and check roles
//   const currentRole = String(role || "").toLowerCase();
//   const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

//   if (!normalizedAllowed.includes(currentRole)) {
//     console.error(`Access Denied. Role: ${currentRole}, Allowed: ${normalizedAllowed}`);
    
//     // Redirect them to their own dashboard instead of login if they are actually logged in
//     return <Navigate to={`/dashboard/${currentRole}`} replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;

import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { loggedIn: reduxLoggedIn, role: reduxRole } = useSelector(
    (state) => state.auth
  );

  const location = useLocation();

  // 🔥 Fallback to localStorage if Redux is empty after refresh
  const lsLoggedIn = localStorage.getItem("ps_loggedIn") === "true";
  const lsRole = localStorage.getItem("ps_role");

  // Final auth state used for routing:
  const loggedIn = reduxLoggedIn || lsLoggedIn;
  const role = (reduxRole || lsRole || "").toLowerCase();

  // ❌ If not logged in anywhere → redirect to login
  if (!loggedIn) {
    console.warn("No active session found. Redirecting to login.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Normalize allowed roles
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

  // ❌ If user role not allowed → redirect to correct dashboard
  if (!normalizedAllowed.includes(role)) {
    console.error(`Access Denied. Role: ${role}, Allowed: ${normalizedAllowed}`);
    return <Navigate to={`/dashboard/${role}`} replace />;
  }

  return children;
};

export default ProtectedRoute;