import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markAllRead, clearNotifications } from "../../stores/notificationsSlice";

export default function NotificationBell({ darkMode = true }) {
  const dispatch = useDispatch();
  const { items, unread } = useSelector((s) => s.notifications);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => setOpen((v) => !v);

  const panelBg   = darkMode ? "#0d1424" : "#ffffff";
  const border    = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const textMain  = darkMode ? "#e2e8f0" : "#1e293b";
  const textSub   = darkMode ? "rgba(255,255,255,0.4)" : "#64748b";
  const itemHover = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={handleOpen}
        type="button"
        className="relative h-9 w-9 rounded-full flex items-center justify-center transition-colors duration-200"
        style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)" }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={darkMode ? "#94a3b8" : "#475569"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-black text-white"
            style={{ background: "#ef4444", boxShadow: "0 0 8px rgba(239,68,68,0.6)" }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
          style={{ background: panelBg, border: `1px solid ${border}`, top: "100%" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${border}` }}>
            <span className="text-sm font-bold" style={{ color: textMain }}>Notifications</span>
            <div className="flex items-center gap-3">
              <button onClick={() => dispatch(markAllRead())} type="button"
                disabled={unread === 0}
                className="text-xs font-semibold transition-colors"
                style={{ color: unread > 0 ? "#ffffff" : "rgba(255,255,255,0.35)", cursor: unread > 0 ? "pointer" : "default" }}>
                Mark all read
              </button>
              <span style={{ color: "rgba(255,255,255,0.25)" }}>|</span>
              <button onClick={() => dispatch(clearNotifications())} type="button"
                disabled={items.length === 0}
                className="text-xs font-semibold transition-colors"
                style={{ color: items.length > 0 ? "#ffffff" : "rgba(255,255,255,0.35)", cursor: items.length > 0 ? "pointer" : "default" }}>
                Clear all
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto">
            {items.length === 0 ? (
              <div className="py-10 text-center text-sm" style={{ color: textSub }}>No notifications</div>
            ) : (
              items.map((n) => (
                <div key={n.id} className="px-4 py-3 transition-colors duration-150"
                  style={{ borderBottom: `1px solid ${border}`, background: n.read ? "transparent" : (darkMode ? "rgba(16,185,129,0.05)" : "rgba(16,185,129,0.04)") }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = itemHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = n.read ? "transparent" : (darkMode ? "rgba(16,185,129,0.05)" : "rgba(16,185,129,0.04)"))}>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-base">{n.icon || "🔔"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: textMain }}>{n.title}</p>
                      {n.message && <p className="text-xs mt-0.5 leading-snug" style={{ color: textSub }}>{n.message}</p>}
                      <p className="text-[10px] mt-1" style={{ color: textSub }}>
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-400 shrink-0" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
