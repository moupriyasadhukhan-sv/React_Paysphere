
// import React, { useState } from "react";

// export default function Sidebar({ brand = "PaySphere", items = [], active, onChange }) {
//   // Track which item is being hovered to apply colors dynamically
//   const [hovered, setHovered] = useState(null);

//   return (
//     <aside 
//       style={{ backgroundColor: '#0A1128' }} 
//       className="h-screen w-64 text-slate-100 flex flex-col border-r border-white/10"
//     >
//       {/* Brand */}
//       <div className="flex items-center gap-2 px-5 h-16 border-b border-white/10">
//         <div 
//           className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-300"
//           style={{ 
//             backgroundColor: '#10B981', 
//             boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)' 
//           }}
//         >
//           <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
//             <path d="M12 2l9 5v10l-9 5-9-5V7l9-5zM7 9.5l5 2.8 5-2.8M7 14.5l5 2.8 5-2.8" />
//           </svg>
//         </div>
//         <span className="font-semibold tracking-wide text-white">{brand}</span>
//       </div>

//       {/* Nav */}
//       <nav className="mt-4 px-3 space-y-1 overflow-y-auto">
//         {items.map((item) => {
//           const isActive = item.key === active;
//           const isHovered = hovered === item.key;
          
//           return (
//             <button
//               key={item.key}
//               onMouseEnter={() => setHovered(item.key)}
//               onMouseLeave={() => setHovered(null)}
//               onClick={() => onChange(item.key)}
//               className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer"
//               style={{ 
//                 // Lighten background on hover or if active
//                 backgroundColor: isActive || isHovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
//                 outline: 'none'
//               }}
//               type="button"
//             >
//               {/* Active/Hover glow bar */}
//               <span
//                 className="absolute left-0 h-6 w-1 rounded-r-full transition-all duration-300"
//                 style={{ 
//                   top: "50%", 
//                   transform: "translateY(-50%)",
//                   // Show bar if active OR hovered
//                   backgroundColor: isActive || isHovered ? '#10B981' : 'transparent',
//                   boxShadow: isActive || isHovered ? '0 0 12px #10B981' : 'none',
//                   opacity: isActive || isHovered ? 1 : 0
//                 }}
//               />

//               {/* Icon */}
//               <span 
//                 className="transition-colors duration-200"
//                 style={{ color: isActive || isHovered ? '#10B981' : '#94a3b8' }}
//               >
//                 {item.icon ?? <DotIcon />}
//               </span>

//               {/* Label */}
//               <span 
//                 className="font-medium transition-colors duration-200" 
//                 style={{ color: isActive || isHovered ? '#FFFFFF' : '#cbd5e1' }}
//               >
//                 {item.label}
//               </span>
//             </button>
//           );
//         })}
//       </nav>

//       <div className="mt-auto mb-4 px-3 text-xs text-slate-500">
//         <span className="opacity-75">© {new Date().getFullYear()} PaYSphere</span>
//       </div>
//     </aside>
//   );
// }

// function DotIcon() {
//   return (
//     <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
//       <circle cx="12" cy="12" r="4" />
//     </svg>
//   );
// }
import React, { useState } from "react";

export default function Sidebar({ brand = "PaySphere", items = [], active, onChange, darkMode = true }) {
  const [hovered, setHovered] = useState(null);

  const bg     = darkMode ? 'linear-gradient(180deg,#060b18 0%,#0a1128 100%)' : 'linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)';
  const border  = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  const labelColor = (highlight, isLogout) => {
    if (isLogout) return highlight ? '#f87171' : (darkMode ? '#64748b' : '#94a3b8');
    return highlight ? (darkMode ? '#ffffff' : '#0f172a') : (darkMode ? '#64748b' : '#94a3b8');
  };

  return (
    <aside
      className="h-screen w-64 flex flex-col shrink-0 transition-colors duration-300"
      style={{ background: bg, borderRight: `1px solid ${border}` }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 h-16" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="h-9 w-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#10b981,#059669)", boxShadow: "0 0 20px rgba(16,185,129,0.45)" }}>
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
          </svg>
        </div>
        <div>
          <span className={`font-black tracking-tight text-base ${darkMode ? 'text-white' : 'text-slate-800'}`}>{brand}</span>
          <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-500/60 leading-none mt-0.5">Secure Payments</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-3 px-3 space-y-0.5 overflow-y-auto flex-1">
        {items.map((item) => {
          const isActive = item.key === active;
          const isHovered = hovered === item.key;
          const highlight = isActive || isHovered;
          const isLogout = item.key === "logout";

          return (
            <button
              key={item.key}
              onMouseEnter={() => setHovered(item.key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onChange(item.key)}
              type="button"
              className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
              style={{
                background: isActive
                  ? (darkMode ? 'linear-gradient(135deg,rgba(16,185,129,0.18),rgba(5,150,105,0.08))' : 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(5,150,105,0.06))')
                  : isHovered ? (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)')
                  : 'transparent',
                outline: 'none',
                border: isActive ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent',
              }}
            >
              {/* Active glow bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full"
                  style={{ background: "#10b981", boxShadow: "0 0 10px #10b981" }} />
              )}

              {/* Icon */}
              <span className="text-base w-5 text-center transition-all duration-200"
                style={{ filter: highlight && !isLogout ? "drop-shadow(0 0 6px #10b981)" : "none",
                  opacity: isLogout && !highlight ? 0.5 : 1 }}>
                {item.icon ?? <DotIcon />}
              </span>

              {/* Label */}
              <span className="font-semibold text-sm transition-colors duration-200"
                style={{ color: labelColor(highlight, isLogout) }}>
                {item.label}
              </span>

              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"
                  style={{ boxShadow: "0 0 6px #10b981" }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4" style={{ borderTop: `1px solid ${border}` }}>
        <p className={`text-[9px] font-black uppercase tracking-widest ${darkMode ? 'text-white/15' : 'text-slate-400'}`}>© {new Date().getFullYear()} PaySphere</p>
      </div>
    </aside>
  );
}

function DotIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}