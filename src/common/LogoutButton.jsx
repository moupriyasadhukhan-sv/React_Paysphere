// import useLogout from "../hooks/useLogout";

// export default function LogoutButton({
//   className = "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded",
//   redirectTo = "/login",
//   children = "Logout",
// }) {
//   const logout = useLogout(redirectTo);
//   return (
//     <button onClick={logout} className={className}>
//       {children}
//     </button>
//   );
// }

import useLogout from "../hooks/useLogout";
 
export default function LogoutButton({
  className = "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded",
  redirectTo = "/login",
  children = "Logout",
}) {
  const logout = useLogout(redirectTo);
  return (
    <button onClick={logout} className={className}>
      {children}
    </button>
  );
}
 