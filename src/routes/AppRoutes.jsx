
// import { Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "../components/ProtectedRoute";

// // Pages
// import Landing from "../pages/landing/Landing";
// import PaymentMethodsPage from "../pages/Dashboards/PaymentMethodsPage"; 
// import AdminDashboard from "../pages/Dashboards/AdminDashboard";
// import RegisterStaff from "../pages/Dashboards/RegisterStaff";
// import MerchantDashboard from "../pages/Dashboards/MerchantDashboard";
// import OpsAdminDashboard from "../pages/Dashboards/OpsAdminDashboard";
// import OpsDashboard from "../pages/Dashboards/OpsDashboard";
// import RiskDashboard from "../pages/Dashboards/RiskDashboard";
// import UserDashboard from "../pages/Dashboards/UserDashboard";
// import WalletDashboard from "../pages/Dashboards/WalletDashboard";
// import Login from "../pages/entrypages/login";
// import Registration from "../pages/entrypages/registration";
// import ShowLimit from "../pages/Limits/ShowLimit";
// import CreateLimit from "../pages/Limits/CreateLimit";
// import UpdateLimit from "../pages/Limits/UpdateLimit";
// import CreateSettlement from "../pages/settlements/CreateSettlement";
// import MerchantSettlements from "../pages/settlements/MerchantSettlements";

// import UserReportPage from "../pages/reports/UserReportPage";
// import MerchantReportPage from "../pages/reports/MerchantReportPage";

// export default function AppRoutes() {
//   return (
//     <Routes>
//       {/* --- PUBLIC ROUTES --- */}
//       <Route path="/" element={<Landing />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Registration />} />

//       {/* --- PROTECTED DASHBOARD ROUTES --- */}
//       {/* FIX: Changed 'allowed' to 'allowedRoles' to match ProtectedRoute.jsx */}
      
//       <Route
//           path="/dashboard/admin"
//           element={
//             <ProtectedRoute allowedRoles={["admin"]}>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="register-staff" element={<RegisterStaff />} />

//           <Route path="limits">
//             <Route path="create" element={<CreateLimit />} />
//             <Route path="update/:limitId" element={<UpdateLimit />} />
//             <Route path=":userId" element={<ShowLimit />} />
//           </Route>

//           <Route
//             path="settlements/merchant/:merchantId"
//             element={<MerchantSettlements />}
//           />

          
//           <Route
//               path="settlements/create/:merchantId"
//               element={<CreateSettlement />}
//             />
//           <Route
//               path="reports/users"
//               element={<UserReportPage />}
//             />

//             <Route
//               path="reports/merchants"
//               element={<MerchantReportPage />}
//             />
//         </Route>


//       <Route
//         path="/dashboard/merchant"
//         element={
//           <ProtectedRoute allowedRoles={["merchant"]}>
//             <MerchantDashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/ops"
//         element={
//           <ProtectedRoute allowedRoles={["ops"]}>
//             <OpsDashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/ops-admin"
//         element={
//           <ProtectedRoute allowedRoles={["admin", "ops"]}>
//             <OpsAdminDashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/risk"
//         element={
//           <ProtectedRoute allowedRoles={["risk"]}>
//             <RiskDashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/user"
//         element={
//           <ProtectedRoute allowedRoles={["user"]}>
//             <UserDashboard />
//           </ProtectedRoute>
//         }
//       />

//       {/* --- MODULES --- */}
//       <Route
//         path="/dashboard/wallet"
//         element={
//           <ProtectedRoute allowedRoles={["user", "merchant"]}>
//             <WalletDashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/payment-methods/add"
//         element={
//           <ProtectedRoute allowedRoles={["user", "merchant", "admin"]}>
//             <PaymentMethodsPage />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/payment-methods"
//         element={
//           <ProtectedRoute allowedRoles={["user", "merchant", "admin"]}>
//             <PaymentMethodsPage />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/admin/limits/create"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <CreateLimit />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/admin/limits/:userId"
//         element={
//           <ProtectedRoute allowedRoles={["admin", "ops", "risk"]}>
//             <ShowLimit />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/admin/limits/update/:limitId"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <UpdateLimit />
//           </ProtectedRoute>
//         }
//       />

//       {/* --- 404 --- */}
//       <Route path="*" element={<div className="p-10 text-center font-bold">404 - Page Not Found</div>} />
//     </Routes>
//   );
// }



import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Pages
import Landing from "../pages/landing/Landing";
import PaymentMethodsPage from "../pages/Dashboards/PaymentMethodsPage"; 
import AdminDashboard from "../pages/Dashboards/AdminDashboard";
import RegisterStaff from "../pages/Dashboards/RegisterStaff";
import MerchantDashboard from "../pages/Dashboards/MerchantDashboard";
import OpsAdminDashboard from "../pages/Dashboards/OpsAdminDashboard";
import OpsDashboard from "../pages/Dashboards/OpsDashboard";
import RiskDashboard from "../pages/Dashboards/RiskDashboard";
import UserDashboard from "../pages/Dashboards/UserDashboard";
import WalletDashboard from "../pages/Dashboards/WalletDashboard";
import Login from "../pages/entrypages/login";
import Registration from "../pages/entrypages/registration";
import ShowLimit from "../pages/Limits/ShowLimit";
import CreateLimit from "../pages/Limits/CreateLimit";
import UpdateLimit from "../pages/Limits/UpdateLimit";
import CreateSettlement from "../pages/settlements/CreateSettlement";
import MerchantSettlements from "../pages/settlements/MerchantSettlements";

import UserReportPage from "../pages/reports/UserReportPage";
import MerchantReportPage from "../pages/reports/MerchantReportPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />

      {/* --- PROTECTED DASHBOARD ROUTES --- */}
      {/* FIX: Changed 'allowed' to 'allowedRoles' to match ProtectedRoute.jsx */}
      
      <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="register-staff" element={<RegisterStaff />} />

          <Route path="limits">
            <Route path="create" element={<CreateLimit />} />
            <Route path="update/:limitId" element={<UpdateLimit />} />
            <Route path=":userId" element={<ShowLimit />} />
          </Route>

          <Route
            path="settlements/merchant/:merchantId"
            element={<MerchantSettlements />}
          />

          
          <Route
              path="settlements/create/:merchantId"
              element={<CreateSettlement />}
            />
          <Route
              path="reports/users"
              element={<UserReportPage />}
            />

            <Route
              path="reports/merchants"
              element={<MerchantReportPage />}
            />
        </Route>


      <Route
        path="/dashboard/merchant"
        element={
          <ProtectedRoute allowedRoles={["merchant"]}>
            <MerchantDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/ops"
        element={
          <ProtectedRoute allowedRoles={["ops"]}>
            <OpsDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/ops-admin"
        element={
          <ProtectedRoute allowedRoles={["admin", "ops"]}>
            <OpsAdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/risk"
        element={
          <ProtectedRoute allowedRoles={["risk"]}>
            <RiskDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/user"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="p2p" element={<UserDashboard />} />
        <Route path="p2m" element={<UserDashboard />} />
        <Route path="refund" element={<UserDashboard />} />
      </Route>

      {/* --- MODULES --- */}
      <Route
        path="/dashboard/wallet"
        element={
          <ProtectedRoute allowedRoles={["user", "merchant"]}>
            <WalletDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/payment-methods/add"
        element={
          <ProtectedRoute allowedRoles={["user", "merchant", "admin"]}>
            <PaymentMethodsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment-methods"
        element={
          <ProtectedRoute allowedRoles={["user", "merchant", "admin"]}>
            <PaymentMethodsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin/limits/create"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateLimit />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin/limits/:userId"
        element={
          <ProtectedRoute allowedRoles={["admin", "ops", "risk"]}>
            <ShowLimit />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin/limits/update/:limitId"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <UpdateLimit />
          </ProtectedRoute>
        }
      />

      {/* --- 404 --- */}
      <Route path="*" element={<div className="p-10 text-center font-bold">404 - Page Not Found</div>} />
    </Routes>
  );
}