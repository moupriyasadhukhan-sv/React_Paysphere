// // import { createContext, useContext, useState } from "react";
// // import { setAuthToken } from "../services/http";

// // const AuthContext = createContext();

// // export const AuthProvider = ({ children }) => {
// //   const [auth, setAuth] = useState({
// //     token: null,
// //     role: null,
// //   });

// //   const login = (token, role) => {
// //     setAuth({ token, role });
// //     setAuthToken(token); // <-- keep token in memory for axios
// //   };

// //   const logout = () => {
// //     setAuth({ token: null, role: null });
// //     setAuthToken(null); // remove token from axios memory
// //   };

// //   const value = { auth, login, logout, isAuthenticated: !!auth.token };
// //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // };

// // export const useAuth = () => useContext(AuthContext);
// // import { createContext, useContext, useState, useEffect } from "react";
// // import { setAuthToken } from "../services/http";

// // const AuthContext = createContext();

// // export const AuthProvider = ({ children }) => {
// //   // 1. Initialize from LocalStorage
// //   const [auth, setAuth] = useState({
// //     token: localStorage.getItem("ps_token"),
// //     role: localStorage.getItem("ps_role"),
// //   });

// //   // 2. Keep Axios headers in sync with the token
// //   useEffect(() => {
// //     if (auth.token) {
// //       setAuthToken(auth.token);
// //     }
// //   }, [auth.token]);

// //   const login = (token, role) => {
// //     // CRITICAL FIX: Normalize role to lowercase to match AppRoutes/ProtectedRoute
// //     const lowerRole = String(role || "").toLowerCase();

// //     // Save to State
// //     setAuth({ token, role: lowerRole });
    
// //     // Save to LocalStorage
// //     localStorage.setItem("ps_token", token);
// //     localStorage.setItem("ps_role", lowerRole);
    
// //     setAuthToken(token);
// //   };

// //   const logout = () => {
// //     setAuth({ token: null, role: null });
// //     setAuthToken(null);
// //     localStorage.removeItem("ps_token");
// //     localStorage.removeItem("ps_role");
// //   };

// //   const value = { 
// //     auth, 
// //     login, 
// //     logout, 
// //     isAuthenticated: !!auth.token 
// //   };

// //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // };

// // export const useAuth = () => useContext(AuthContext);


// // import { createContext, useContext, useState, useEffect } from "react";
// // import { useDispatch } from "react-redux";
// // import { setAuthToken } from "../services/http";
// // import { setCredentials, logout as reduxLogout } from "../stores/authSlice";

// // const AuthContext = createContext();

// // function decodeJwt(token) {
// //   try {
// //     return JSON.parse(atob(token.split(".")[1]));
// //   } catch {
// //     return {};
// //   }
// // }

// // export const AuthProvider = ({ children }) => {
// //   const dispatch = useDispatch();

// //   const [auth, setAuth] = useState({
// //     token: localStorage.getItem("ps_token"),
// //     role: localStorage.getItem("ps_role"),
// //     name: localStorage.getItem("ps_name"),
// //   });

// //   // On mount, rehydrate Redux from localStorage
// //   useEffect(() => {
// //     const token = localStorage.getItem("ps_token");
// //     const role = localStorage.getItem("ps_role");
// //     if (token) {
// //       setAuthToken(token);
// //       const decoded = decodeJwt(token);
// //       const userId = decoded.uid || decoded.sub || null;
// //       const merchantId = decoded.merchantId || null;
// //       dispatch(setCredentials({ accessToken: token, role, userId, merchantId }));
// //     }
// //   }, []);

// //   const login = (token, role, name = "") => {
// //     const normalizedRole = String(role || "").toLowerCase();
// //     setAuth({ token, role: normalizedRole, name });
// //     localStorage.setItem("ps_token", token);
// //     localStorage.setItem("ps_role", normalizedRole);
// //     localStorage.setItem("ps_name", name);
// //     setAuthToken(token);

// //     const decoded = decodeJwt(token);
// //     const userId = decoded.uid || decoded.sub || null;
// //     const merchantId = decoded.merchantId || null;
// //     dispatch(setCredentials({ accessToken: token, role: normalizedRole, userId, merchantId }));
// //   };

// //   const logout = () => {
// //     setAuth({ token: null, role: null, name: null });
// //     setAuthToken(null);
// //     localStorage.removeItem("ps_token");
// //     localStorage.removeItem("ps_role");
// //     localStorage.removeItem("ps_name");
// //     dispatch(reduxLogout());
// //   };

// //   const value = { auth, login, logout, isAuthenticated: !!auth.token };
// //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // };

// // export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setCredentials, logout as reduxLogout } from "../stores/authSlice";
// import { setAuthToken } from "../services/http";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const dispatch = useDispatch();
//   const authState = useSelector((state) => state.auth);

//   // ⭐ On mount: Rehydrate token into HTTP headers and Redux
//   useEffect(() => {
//     const token = localStorage.getItem("ps_token");
//     if (token) {
//       setAuthToken(token); // Set token in axios headers
//     }
//   }, []);

//   const login = (userData) => {
//     const { userId, merchantId, role, name, email, accessToken } = userData;
//     const normalizedRole = String(role || "").toLowerCase();
    
//     // Set token in axios headers if provided
//     if (accessToken) {
//       setAuthToken(accessToken);
//       localStorage.setItem("ps_token", accessToken);
//     }
    
//     dispatch(setCredentials({ userId, merchantId, role: normalizedRole, name, email }));
//   };

//   const logout = () => {
//     dispatch(reduxLogout());
//     setAuthToken(null); // Clear token from axios headers
//     localStorage.removeItem("ps_token"); // Clear token from storage
//   };

//   const value = { 
//     user: authState, 
//     login, 
//     logout, 
//     isAuthenticated: authState.loggedIn 
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);


// import { createContext, useContext } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setCredentials, logout as reduxLogout } from "../stores/authSlice";
 
// const AuthContext = createContext();
 
// export const AuthProvider = ({ children }) => {
//   const dispatch = useDispatch();
//   const authState = useSelector((state) => state.auth);
 
//   const login = (userData) => {
//     const { userId, merchantId, role, name, email } = userData;
//     const normalizedRole = String(role || "").toLowerCase();
//     dispatch(setCredentials({ userId, merchantId, role: normalizedRole, name, email }));
//   };
 
//   const logout = () => {
//     dispatch(reduxLogout());
//     // LocalStorage cleanup is handled inside the Redux action or here
//   };
 
//   const value = {
//     user: authState,
//     login,
//     logout,
//     isAuthenticated: authState.loggedIn
//   };
 
//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
 
// export const useAuth = () => useContext(AuthContext);
//  import { createContext, useContext, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setCredentials, logout as reduxLogout } from "../stores/authSlice";
// import { setAuthToken } from "../services/http";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const dispatch = useDispatch();
//   const authState = useSelector((state) => state.auth);

//   // 🔥 On mount: Restore session from localStorage + try to refresh token
//   // useEffect(() => {
//   //   const isLoggedIn = localStorage.getItem("ps_loggedIn") === "true";
    
//   //   if (isLoggedIn) {
//   //     // User was previously logged in, try to refresh the access token
//   //     refreshTokenSilently();
//   //   }
//   // }, []);

//   // const refreshTokenSilently = async () => {
//   //   try {
//   //     // Import inside function to avoid circular dependencies
//   //     const { default: http } = await import("../services/http");
      
//   //     // Call backend refresh endpoint (uses httpOnly refresh token cookie)
//   //     const response = await http.post("/api/auth/refresh");
      
//   //     if (response.data.accessToken) {
//   //       setAuthToken(response.data.accessToken);
//   //     }
//   //   } catch (err) {
//   //     // Refresh failed, clear session
//   //     console.log("Silent refresh failed, clearing session");
//   //     dispatch(reduxLogout());
//   //   }
//   // };

//   const login = (userData) => {
//     const { accessToken, userId, merchantId, role, name, email } = userData;

//     // Store access token ONLY in memory:
//     setAuthToken(accessToken);

//     // Store user info in Redux + LocalStorage:
//     dispatch(
//       setCredentials({
//         userId,
//         merchantId,
//         role,
//         name,
//         email
//       })
//     );
//   };

//   const logout = () => {
//     setAuthToken(null); // remove memory token
//     dispatch(reduxLogout());
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user: authState,
//         login,
//         logout,
//         isAuthenticated: authState.loggedIn
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout as reduxLogout } from "../stores/authSlice";
import { setAuthToken } from "../services/http";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const login = (userData) => {
    const { accessToken, userId, merchantId, role, name, email } = userData;

    // Store access token ONLY in memory:
    setAuthToken(accessToken);
    
    // Store user info in Redux + LocalStorage:
    dispatch(
      setCredentials({
        userId,
        merchantId,
        role,
        name,
        email
      })
    );
  };

  const logout = () => {
    setAuthToken(null); // remove memory token
    dispatch(reduxLogout());
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState,
        login,
        logout,
        isAuthenticated: authState.loggedIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);