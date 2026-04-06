
// // import { useNavigate } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";
// // import http from "../services/http";   // <-- add this to call backend
// // // or: import { logoutUser } from "../services/authService";

// // export default function useLogout(redirectTo = "/login") {
// //   const { logout } = useAuth();
// //   const navigate = useNavigate();

  
// // return async () => {
// //     try {
// //       // ⭐ 1) Trigger backend logout (this saves AuditLog)
// //         await http.post("/auth/logout", {}, { withCredentials: true });   
// //        } catch (err) {
// //       console.warn("Logout endpoint failed, continuing logout.", err);
// //     }

// //     // ⭐ 2) Clear frontend session
// //     logout();

// //     // ⭐ 3) Redirect same as before
// //     navigate(redirectTo, { replace: true });
// //   };
// // }

// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useSelector } from "react-redux";
// import http from "../services/http";
 
// export default function useLogout(redirectTo = "/login") {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const { userId, merchantId } = useSelector((s) => s.auth);
 
//   return async () => {
//     try {
//       await http.post("/api/auth/revoke-all");
//     } catch {
//       // proceed regardless
//     }
//     logout();
//     navigate(redirectTo, { replace: true });
//   };
// }
 

// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useSelector } from "react-redux";
// import http from "../services/http";
 
// export default function useLogout(redirectTo = "/login") {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const { userId, merchantId } = useSelector((s) => s.auth);
 
//   return async () => {
//     try {
//       await http.post("/api/auth/revoke-all");
//     } catch {
//       // proceed regardless
//     }
//     logout();
//     navigate(redirectTo, { replace: true });
//   };
// }
 

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";
import http from "../services/http";

export default function useLogout(redirectTo = "/login") {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return async () => {
    try {
      // MUST send credentials so refresh cookie is included
      await http.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.warn("Logout API failed:", err);
    }

    // Clear Redux + localStorage
    logout();

    // Also clear in-memory access token
    const { setAuthToken } = await import("../services/http");
    setAuthToken(null);

    navigate(redirectTo, { replace: true });
  };
}