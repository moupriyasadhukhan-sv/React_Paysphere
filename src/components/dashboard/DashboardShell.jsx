// import React, { useState } from "react";
// import Sidebar from "./Sidebar";
// import NotificationBell from "./NotificationBell";
// import { useSettings } from "../../context/SettingsContext";

// export default function DashboardShell({
//   brand = "PaySphere",
//   navItems = [],
//   defaultKey = "home",
//   variant = "user",
//   onLogout = () => {},
//   onTabChange,
//   userName = "",
//   activeTab,
//   children,
// }) {
//   const [active, setActive] = useState(defaultKey);
//   const { darkMode, t } = useSettings?.() || { darkMode: true, t: { dashboard: 'Dashboard' } };

//   const currentTab = activeTab ?? active;

//   const dark = {
//     shell:   '#080d1a',
//     header:  'rgba(10,17,40,0.95)',
//     section: 'linear-gradient(145deg,#080d1a 0%,#0d1424 60%,#080d1a 100%)',
//     homeCard: 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(6,78,59,0.04))',
//     homeBorder: 'rgba(16,185,129,0.15)',
//     text:    'text-slate-100',
//     subText: 'text-white/40',
//     breadcrumb: 'text-white/40',
//   };
//   const light = {
//     shell:   '#f1f5f9',
//     header:  'rgba(255,255,255,0.95)',
//     section: 'linear-gradient(145deg,#f1f5f9 0%,#e2e8f0 60%,#f1f5f9 100%)',
//     homeCard: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(6,78,59,0.05))',
//     homeBorder: 'rgba(16,185,129,0.25)',
//     text:    'text-slate-800',
//     subText: 'text-slate-500',
//     breadcrumb: 'text-slate-400',
//   };
//   const theme = darkMode ? dark : light;

//   const handleChange = (key) => {
//     if (key === "logout") { onLogout?.(); return; }
//     setActive(key);
//     if (onTabChange) onTabChange(key);
//   };

//   return (
//     <div className={`min-h-screen flex ${theme.text} transition-colors duration-300`} style={{ background: theme.shell }}>
//       <Sidebar brand={brand} items={navItems} active={currentTab} onChange={handleChange} darkMode={darkMode} />

//       <main className="flex-1 flex flex-col overflow-hidden">
//         {/* Top Header */}
//         <header className="h-16 flex items-center justify-between px-8 shrink-0 transition-colors duration-300"
//           style={{ background: theme.header, borderBottom: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)', backdropFilter: 'blur(12px)' }}>
//           <div className="flex items-center gap-3">
//             <span className={`text-sm font-semibold uppercase tracking-widest ${theme.breadcrumb}`}>
//               {variant === 'merchant' ? 'Merchant' : (t?.dashboard || 'Dashboard')}
//             </span>
//             <span className={darkMode ? 'text-white/20' : 'text-slate-300'}>/</span>
//             <span className="text-sm font-bold text-emerald-500 uppercase tracking-wider">{currentTab}</span>
//           </div>
//           <div className="flex items-center gap-3">
//             <NotificationBell darkMode={darkMode} />
//             <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-black"
//               style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 0 16px rgba(16,185,129,0.4)' }}>
//               {userName ? userName.slice(0, 2).toUpperCase() : '--'}
//             </div>
//             {userName && <span className={`text-sm font-semibold ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>{userName}</span>}
//           </div>
//         </header>

//         {/* Content */}
//         <section className="flex-1 overflow-y-auto p-8 transition-colors duration-300" style={{ background: theme.section }}>
//           {currentTab === 'home' ? (
//             <div className="rounded-2xl p-8 border transition-colors duration-300"
//               style={{ background: theme.homeCard, borderColor: theme.homeBorder, boxShadow: '0 8px 32px -8px rgba(16,185,129,0.15)' }}>
//               <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
//                 {t?.welcomeBack || 'Welcome back'}, <span className="text-emerald-500">{userName || '...'}</span>
//               </h2>
//               <p className={`mt-2 ${theme.subText}`}>{t?.managePayments || 'Manage your payments and wallet effortlessly.'}</p>
//             </div>
//           ) : (
//             <div className="animate-in fade-in duration-500">
//               {children ?? <div className={`${theme.subText} italic`}>Section "{currentTab}" coming soon...</div>}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

//--------------------------------

// import React, { useState } from "react";
// import Sidebar from "./Sidebar";
// import NotificationBell from "./NotificationBell";
// import PageTransition from "./PageTransition";
// import { useSettings } from "../../context/SettingsContext";
// import { User } from "lucide-react"; // NEW: Imported the User icon

// export default function DashboardShell({
//   brand = "PaySphere",
//   navItems = [],
//   defaultKey = "home",
//   variant = "user",
//   onLogout = () => {},
//   onTabChange,
//   userName = "",
//   userRole = "user",
//   activeTab,
//   children,
// }) {
//   const [active, setActive] = useState(defaultKey);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [contentVisible, setContentVisible] = useState(true);

//   const { darkMode, t } = useSettings?.() || { darkMode: true, t: { dashboard: 'Dashboard' } };

//   const currentTab = activeTab ?? active;

//   const dark = {
//     shell: '#0f1419',
//     header: 'linear-gradient(180deg, #1a1f2e 0%, #1e2a36 100%)',
//     section: 'linear-gradient(145deg, #0a0e17 0%, #0f1419 60%, #0a0e17 100%)',
//     homeCard: 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(6,78,59,0.04))',
//     homeBorder: 'rgba(42, 180, 134, 0.15)',
//     text: 'text-slate-100',
//     subText: 'text-white/40',
//     breadcrumb: 'text-white/50',
//   };
//   const light = {
//     shell: '#f1f5f9',
//     header: 'rgba(255,255,255,0.95)',
//     section: 'linear-gradient(145deg,#f1f5f9 0%,#e2e8f0 60%,#f1f5f9 100%)',
//     homeCard: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(6,78,59,0.05))',
//     homeBorder: 'rgba(16,185,129,0.25)',
//     text: 'text-slate-800',
//     subText: 'text-slate-500',
//     breadcrumb: 'text-slate-400',
//   };
//   const theme = darkMode ? dark : light;

//   const handleChange = (key) => {
//     if (key === "logout") {
//       onLogout?.();
//       return;
//     }
//     if (key !== currentTab) {
//       setContentVisible(false);
//       setIsTransitioning(true);
//       setActive(key);
//       if (onTabChange) onTabChange(key);
//     }
//   };

//   const handleTransitionComplete = () => {
//     setContentVisible(true);
//   };

//   return (
//     <div className={`flex h-screen overflow-hidden ${theme.text} transition-colors duration-300`} style={{ background: theme.shell }}>
//       <PageTransition isTransitioning={isTransitioning} onComplete={handleTransitionComplete} />
//       <Sidebar brand={brand} items={navItems} active={currentTab} onChange={handleChange} darkMode={darkMode} />

//       <main className="flex-1 flex flex-col overflow-hidden">
//         {/* Top Header */}
//         <header className="h-16 flex items-center justify-between px-8 shrink-0 transition-colors duration-300"
//           style={{ background: theme.header, borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgb(38, 17, 17)', backdropFilter: 'blur(12px)', boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.08)' }}>
//           <div className="flex items-center gap-3">
//             <span className={`text-sm font-semibold uppercase tracking-widest ${theme.breadcrumb}`}>
//               {variant === 'merchant' ? 'Merchant' : (t?.dashboard || 'Dashboard')}
//             </span>
//             <span className={darkMode ? 'text-white/30' : 'text-slate-300'}>/</span>
//             <span className="text-sm font-bold text-emerald-500 uppercase tracking-wider">{currentTab}</span>
//           </div>
//           <div className="flex items-center gap-3">
//             <NotificationBell darkMode={darkMode} />
//             <div className="flex items-center gap-2">
//               {/* NEW: Permanent User Icon Avatar Container */}
//               <div
//                 className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden"
//                 style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 24px rgba(42, 183, 136, 0.6), 0 4px 12px rgba(16,185,129,0.3)' }}
//               >
//                 <User size={18} className="text-white" strokeWidth={2.5} />
//               </div>

//               <div className="flex flex-col ml-1">
//                 {userName && <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{userName}</span>}
//                 {userRole && <span className={`text-xs font-medium uppercase tracking-wide ${darkMode ? 'text-emerald-400/80' : 'text-emerald-600'}`}>{userRole}</span>}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Content */}
//         <section className="flex-1 overflow-y-auto p-8 transition-colors duration-300" style={{ background: theme.section, opacity: contentVisible ? 1 : 0, pointerEvents: contentVisible ? 'auto' : 'none', transition: 'opacity 0.3s ease-in-out' }}>
          
//           <div className="animate-in fade-in duration-500">
//             {/* FIXED: Instead of checking if tab is 'home' and showing a static card, 
//               we now prioritize rendering the 'children' prop.
//             */}
//             {children ? (
//               children
//             ) : (
//               /* Fallback UI if no children are provided */
//               currentTab === 'home' ? (
//                 <div className="rounded-2xl p-8 border transition-colors duration-300"
//                   style={{ background: theme.homeCard, borderColor: theme.homeBorder, boxShadow: '0 8px 32px -5px rgba(36, 161, 120, 0.77)' }}>
//                   <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
//                     {t?.welcome || 'Welcome '}, <span className="text-emerald-300">{userName || '...'}</span>
//                   </h2>
//                   <p className={`mt-2 ${theme.subText}`}>{t?.managePayments || 'Manage your payments and wallet effortlessly.'}</p>
//                 </div>
//               ) : (
//                 <div className={`${theme.subText} italic`}>Section "{currentTab}" coming soon...</div>
//               )
//             )}
//           </div>
          
//         </section>
//       </main>
//     </div>
//   );
// }


// import React, { useState, useEffect, useRef } from "react";
// import Sidebar from "./Sidebar";
// import NotificationBell from "./NotificationBell";
// import PageTransition from "./PageTransition";
// import { useSettings } from "../../context/SettingsContext";
// import { User, LogOut } from "lucide-react"; // NEW: Imported LogOut icon

// export default function DashboardShell({
//   brand = "PaySphere",
//   navItems = [],
//   defaultKey = "home",
//   variant = "user",
//   onLogout = () => {},
//   onTabChange,
//   userName = "",
//   userRole = "user",
//   userEmail = "user@example.com", // NEW: Added userEmail prop
//   activeTab,
//   children,
// }) {
//   const [active, setActive] = useState(defaultKey);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [contentVisible, setContentVisible] = useState(true);
  
//   // NEW: State and ref for the profile dropdown menu
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const profileMenuRef = useRef(null);

//   const { darkMode, t } = useSettings?.() || { darkMode: true, t: { dashboard: 'Dashboard' } };

//   const currentTab = activeTab ?? active;

//   const dark = {
//     shell: '#0f1419',
//     header: 'linear-gradient(180deg, #1a1f2e 0%, #1e2a36 100%)',
//     section: 'linear-gradient(145deg, #0a0e17 0%, #0f1419 60%, #0a0e17 100%)',
//     homeCard: 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(6,78,59,0.04))',
//     homeBorder: 'rgba(42, 180, 134, 0.15)',
//     text: 'text-slate-100',
//     subText: 'text-white/40',
//     breadcrumb: 'text-white/50',
//   };
//   const light = {
//     shell: '#f1f5f9',
//     header: 'rgba(255,255,255,0.95)',
//     section: 'linear-gradient(145deg,#f1f5f9 0%,#e2e8f0 60%,#f1f5f9 100%)',
//     homeCard: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(6,78,59,0.05))',
//     homeBorder: 'rgba(16,185,129,0.25)',
//     text: 'text-slate-800',
//     subText: 'text-slate-500',
//     breadcrumb: 'text-slate-400',
//   };
//   const theme = darkMode ? dark : light;

//   // NEW: Close dropdown when clicking outside of it
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
//         setIsProfileMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleChange = (key) => {
//     if (key === "logout") {
//       onLogout?.();
//       return;
//     }
//     if (key !== currentTab) {
//       setContentVisible(false);
//       setIsTransitioning(true);
//       setActive(key);
//       if (onTabChange) onTabChange(key);
//     }
//   };

//   const handleTransitionComplete = () => {
//     setContentVisible(true);
//   };

//   return (
//     <div className={`flex h-screen overflow-hidden ${theme.text} transition-colors duration-300`} style={{ background: theme.shell }}>
//       <PageTransition isTransitioning={isTransitioning} onComplete={handleTransitionComplete} />
//       <Sidebar brand={brand} items={navItems} active={currentTab} onChange={handleChange} darkMode={darkMode} />

//       <main className="flex-1 flex flex-col overflow-hidden">
//         {/* Top Header */}
//         <header className="h-16 flex items-center justify-between px-8 shrink-0 transition-colors duration-300 z-20 relative"
//           style={{ background: theme.header, borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgb(38, 17, 17)', backdropFilter: 'blur(12px)', boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.08)' }}>
//           <div className="flex items-center gap-3">
//             <span className={`text-sm font-semibold uppercase tracking-widest ${theme.breadcrumb}`}>
//               {variant === 'merchant' ? 'Merchant' : (t?.dashboard || 'Dashboard')}
//             </span>
//             <span className={darkMode ? 'text-white/30' : 'text-slate-300'}>/</span>
//             <span className="text-sm font-bold text-emerald-500 uppercase tracking-wider">{currentTab}</span>
//           </div>

//           <div className="flex items-center gap-4 relative">
//             <NotificationBell darkMode={darkMode} />
            
//             {/* NEW: Profile Dropdown Container */}
//             <div className="relative" ref={profileMenuRef}>
//               {/* Clickable Profile Trigger */}
//               <button 
//                 onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
//                 className={`flex items-center gap-2 p-1.5 -mr-1.5 rounded-xl transition-all duration-200 text-left outline-none ${darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'} ${isProfileMenuOpen ? (darkMode ? 'bg-white/10' : 'bg-black/10') : ''}`}
//               >
//                 <div
//                   className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden shrink-0"
//                   style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 24px rgba(42, 183, 136, 0.6), 0 4px 12px rgba(16,185,129,0.3)' }}
//                 >
//                   <User size={18} className="text-white" strokeWidth={2.5} />
//                 </div>

//                 <div className="flex flex-col pr-1 hidden sm:flex">
//                   {userName && <span className={`text-sm font-semibold leading-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>{userName}</span>}
//                   {userRole && <span className={`text-[10px] font-bold uppercase tracking-widest leading-tight mt-0.5 ${darkMode ? 'text-emerald-400/80' : 'text-emerald-600'}`}>{userRole}</span>}
//                 </div>
//               </button>

//               {/* NEW: Dropdown Menu */}
//               {isProfileMenuOpen && (
//                 <div 
//                   className="absolute right-0 mt-3 w-72 rounded-2xl border shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
//                   style={{ 
//                     background: darkMode ? '#1a1f2e' : '#ffffff',
//                     borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
//                   }}
//                 >
//                   {/* Account Info Header */}
//                   <div className="p-5 flex flex-col items-center text-center border-b" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
//                     <div
//                       className="h-16 w-16 rounded-full flex items-center justify-center overflow-hidden mb-3"
//                       style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}
//                     >
//                       <User size={32} className="text-white" strokeWidth={2} />
//                     </div>
//                     <p className={`text-xs mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{userEmail}</p>
//                     <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>Hi, {userName || 'User'}!</p>
//                   </div>

//                   {/* Actions */}
//                   <div className="p-2">
//                     <button
//                       onClick={() => {
//                         setIsProfileMenuOpen(false);
//                         onLogout?.();
//                       }}
//                       className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-colors
//                         ${darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}
//                       `}
//                     >
//                       <LogOut size={18} strokeWidth={2.5} />
//                       Sign out
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* Content */}
//         <section className="flex-1 overflow-y-auto p-8 transition-colors duration-300" style={{ background: theme.section, opacity: contentVisible ? 1 : 0, pointerEvents: contentVisible ? 'auto' : 'none', transition: 'opacity 0.3s ease-in-out' }}>
          
//           <div className="animate-in fade-in duration-500">
//             {children ? (
//               children
//             ) : (
//               currentTab === 'home' ? (
//                 <div className="rounded-2xl p-8 border transition-colors duration-300"
//                   style={{ background: theme.homeCard, borderColor: theme.homeBorder, boxShadow: '0 8px 32px -5px rgba(36, 161, 120, 0.77)' }}>
//                   <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
//                     {t?.welcome || 'Welcome '}, <span className="text-emerald-300">{userName || '...'}</span>
//                   </h2>
//                   <p className={`mt-2 ${theme.subText}`}>{t?.managePayments || 'Manage your payments and wallet effortlessly.'}</p>
//                 </div>
//               ) : (
//                 <div className={`${theme.subText} italic`}>Section "{currentTab}" coming soon...</div>
//               )
//             )}
//           </div>
          
//         </section>
//       </main>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import PageTransition from "./PageTransition";
import { useSettings } from "../../context/SettingsContext";
import { User, LogOut } from "lucide-react";

export default function DashboardShell({
  brand = "PaySphere",
  navItems = [],
  defaultKey = "home",
  variant = "user",
  onLogout = () => {},
  onTabChange,
  userName = "",
  userRole = "user",
  userEmail = "user@example.com",
  activeTab,
  children,
}) {
  const [active, setActive] = useState(defaultKey);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // State to hold the dynamically fetched email
  const [displayEmail, setDisplayEmail] = useState(userEmail);

  const { darkMode, t } = useSettings?.() || { darkMode: true, t: { dashboard: 'Dashboard' } };

  const currentTab = activeTab ?? active;

  const dark = {
    shell: '#0f1419',
    header: 'linear-gradient(180deg, #1a1f2e 0%, #1e2a36 100%)',
    section: 'linear-gradient(145deg, #0a0e17 0%, #0f1419 60%, #0a0e17 100%)',
    homeCard: 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(6,78,59,0.04))',
    homeBorder: 'rgba(42, 180, 134, 0.15)',
    text: 'text-slate-100',
    subText: 'text-white/40',
    breadcrumb: 'text-white/50',
  };
  const light = {
    shell: '#f1f5f9',
    header: 'rgba(255,255,255,0.95)',
    section: 'linear-gradient(145deg,#f1f5f9 0%,#e2e8f0 60%,#f1f5f9 100%)',
    homeCard: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(6,78,59,0.05))',
    homeBorder: 'rgba(16,185,129,0.25)',
    text: 'text-slate-800',
    subText: 'text-slate-500',
    breadcrumb: 'text-slate-400',
  };
  const theme = darkMode ? dark : light;

  // Make an API call to get the exact user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Get your token from local storage (adjust the key if yours is named differently)
        const token = localStorage.getItem("ps_token") || localStorage.getItem("token");
        const storedEmail = localStorage.getItem("ps_email");
        if (!token) {
          if (storedEmail && storedEmail !== "user@example.com") setDisplayEmail(storedEmail);
          return;
        }

        // REPLACE THIS URL with your actual backend route that returns the user's profile
        const response = await fetch("http://localhost:5000/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Debug log so you can see the response structure in your browser console (F12)
          console.log("API User Data:", data);

          // Update this based on how your backend sends the email back!
          // E.g., if it sends { user: { email: "..." } }, use data.user.email
          if (data.email) {
            setDisplayEmail(data.email);
          } else if (data.user && data.user.email) {
            setDisplayEmail(data.user.email);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user details from API:", error);
      }
    };

    fetchUserDetails();
  }, [userEmail]);

  // Handle clicking outside the profile dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (key) => {
    if (key === "logout") {
      onLogout?.();
      return;
    }
    if (key !== currentTab) {
      setContentVisible(false);
      setIsTransitioning(true);
      setActive(key);
      if (onTabChange) onTabChange(key);
    }
  };

  const handleTransitionComplete = () => {
    setContentVisible(true);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${theme.text} transition-colors duration-100`} style={{ background: theme.shell }}>
      <PageTransition isTransitioning={isTransitioning} onComplete={handleTransitionComplete} />
      <Sidebar brand={brand} items={navItems} active={currentTab} onChange={handleChange} darkMode={darkMode} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 shrink-0 transition-colors duration-300 z-20 relative"
          style={{ background: theme.header, borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgb(38, 17, 17)', backdropFilter: 'blur(12px)', boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.08)' }}>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold uppercase tracking-widest ${theme.breadcrumb}`}>
              {variant === 'merchant' ? 'Merchant' : (t?.dashboard || 'Dashboard')}
            </span>
            <span className={darkMode ? 'text-white/30' : 'text-slate-300'}>/</span>
            <span className="text-sm font-bold text-emerald-500 uppercase tracking-wider">{currentTab}</span>
          </div>

          <div className="flex items-center gap-4 relative">
            <NotificationBell darkMode={darkMode} />
            
            {/* Profile Dropdown Container */}
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center gap-2 p-1.5 -mr-1.5 rounded-xl transition-all duration-200 text-left outline-none ${darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'} ${isProfileMenuOpen ? (darkMode ? 'bg-white/10' : 'bg-black/10') : ''}`}
              >
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden shrink-0"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 24px rgba(42, 183, 136, 0.6), 0 4px 12px rgba(16,185,129,0.3)' }}
                >
                  <User size={18} className="text-white" strokeWidth={2.5} />
                </div>

                <div className="flex flex-col pr-1 hidden sm:flex">
                  {userName && <span className={`text-sm font-semibold leading-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>{userName}</span>}
                  {userRole && <span className={`text-[10px] font-bold uppercase tracking-widest leading-tight mt-0.5 ${darkMode ? 'text-emerald-400/80' : 'text-emerald-600'}`}>{userRole}</span>}
                </div>
              </button>

              {/* Horizontal, Rectangular Dropdown Menu */}
              {isProfileMenuOpen && (
                <div 
                  className="absolute right-0 mt-3 w-80 rounded-xl border shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{ 
                    background: darkMode ? '#1e293b' : '#ffffff',
                    borderColor: darkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'
                  }}
                >
                  <div className="p-4 flex items-center gap-4 border-b" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                    <div
                      className="h-12 w-12 rounded-full flex items-center justify-center overflow-hidden shrink-0"
                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
                    >
                      <User size={24} className="text-white" strokeWidth={2} />
                    </div>
                    
                    <div className="flex flex-col text-left overflow-hidden">
                      <p className={`font-bold text-lg truncate leading-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        Hi, {userName || 'User'}!
                      </p>
                      <p className={`text-sm mt-1 truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {displayEmail}
                      </p>
                    </div>
                  </div>

                  <div className="p-2" style={{ background: darkMode ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.02)' }}>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout?.();
                      }}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors
                        ${darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}
                      `}
                    >
                      <LogOut size={18} strokeWidth={2.5} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="flex-1 overflow-y-auto p-8 transition-colors duration-300" style={{ background: theme.section, opacity: contentVisible ? 1 : 0, pointerEvents: contentVisible ? 'auto' : 'none', transition: 'opacity 0.3s ease-in-out' }}>
          <div className="animate-in fade-in duration-500">
            {children ? (
              children
            ) : (
              currentTab === 'home' ? (
                <div className="rounded-2xl p-8 border transition-colors duration-300"
                  style={{ background: theme.homeCard, borderColor: theme.homeBorder, boxShadow: '0 8px 32px -5px rgba(36, 161, 120, 0.77)' }}>
                  <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    {t?.welcome || 'Welcome '}, <span className="text-emerald-300">{userName || '...'}</span>
                  </h2>
                  <p className={`mt-2 ${theme.subText}`}>{t?.managePayments || 'Manage your payments and wallet effortlessly.'}</p>
                </div>
              ) : (
                <div className={`${theme.subText} italic`}>Section "{currentTab}" coming soon...</div>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  );
}