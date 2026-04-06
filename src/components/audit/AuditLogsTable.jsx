import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../utils/api";
import { useIcon } from "../../hooks/useIcon";



function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <span className="ml-1 text-white/20">↕</span>;
  return <span className="ml-1 text-purple-300">{sortDir === "asc" ? "↑" : "↓"}</span>;
}

export default function AuditLogsTable() {
  const [allRows, setAllRows]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [page, setPage]                 = useState(1);
  const LoaderIcon = useIcon("Loader");
  
  const [filterUserId, setFilterUserId] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [sortCol, setSortCol]           = useState("auditId");
  const [sortDir, setSortDir]           = useState("desc");
  const [pageSize, setPageSize]         = useState(4);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const merged = [];
        let pageNumber = 1;
        while (pageNumber <= 100) {
          const res = await api.get("/AuditLogs", {
            params: { pageNumber, pageSize: 50 },
          });
          const body = res?.data;
          const pageRows = Array.isArray(body)
            ? body
            : Array.isArray(body?.data)
            ? body.data
            : Array.isArray(body?.items)
            ? body.items
            : [];
          merged.push(...pageRows);
          if (pageRows.length < 50) break;
          pageNumber++;
        }
        setAllRows(merged);
      } catch (e) {
        setError("Failed to load audit logs.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // filter
  const filtered = useMemo(() => {
    const uid = filterUserId.trim().toLowerCase();
    const act = filterAction.trim().toLowerCase();
    return allRows.filter((r) =>
      (!uid || String(r.userId ?? "").toLowerCase().includes(uid)) &&
      (!act || String(r.action ?? "").toLowerCase().includes(act))
    );
  }, [allRows, filterUserId, filterAction]);

  // sort
  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sortCol === "auditId")      return dir * ((a.auditId ?? 0) - (b.auditId ?? 0));
      if (sortCol === "userId")       return dir * ((a.userId ?? 0) - (b.userId ?? 0));
      if (sortCol === "action")       return dir * String(a.action ?? "").localeCompare(String(b.action ?? ""));
      if (sortCol === "timestampUtc") return dir * (new Date(a.timestampUtc ?? 0) - new Date(b.timestampUtc ?? 0));
      return 0;
    });
  }, [filtered, sortCol, sortDir]);

  // reset page on filter/sort change
  useEffect(() => { setPage(1); }, [filterUserId, filterAction, sortCol, sortDir, pageSize]);

  // paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageSafe   = Math.min(Math.max(1, page), totalPages);
  const current    = useMemo(() => {
    const start = (pageSafe - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, pageSafe, pageSize]);

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  const formatTs = (ts) => {
    if (!ts) return "—";
    try { return new Date(ts).toLocaleString(); } catch { return ts; }
  };

  const thClass = "px-4 py-3 cursor-pointer select-none hover:text-purple-300 transition whitespace-nowrap";

  return (
    <div className="space-y-3">
      {/* Header + Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Audit Logs</h2>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col">
            <label className="text-xs text-slate-300 mb-1">User ID</label>
            <input
              className="border border-white/10 bg-white/10 text-white placeholder-slate-400 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              placeholder="e.g. 43"
              value={filterUserId}
              onChange={(e) => setFilterUserId(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-slate-300 mb-1">Action</label>
            <input
              className="border border-white/10 bg-white/10 text-white placeholder-slate-400 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              placeholder='e.g. "Login"'
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto border border-white/10 rounded-xl bg-white/5 backdrop-blur-lg">
        <table className="min-w-full text-sm text-slate-200">
          <thead className="bg-white/10 text-slate-100">
            <tr className="text-left">
              <th className={thClass} onClick={() => toggleSort("auditId")}>
                Audit ID <SortIcon col="auditId" sortCol={sortCol} sortDir={sortDir} />
              </th>
              <th className={thClass} onClick={() => toggleSort("userId")}>
                User ID <SortIcon col="userId" sortCol={sortCol} sortDir={sortDir} />
              </th>
              <th className={thClass} onClick={() => toggleSort("action")}>
                Action <SortIcon col="action" sortCol={sortCol} sortDir={sortDir} />
              </th>
              <th className={thClass} onClick={() => toggleSort("timestampUtc")}>
                Timestamp <SortIcon col="timestampUtc" sortCol={sortCol} sortDir={sortDir} />
              </th>
            </tr>
          </thead>
          <tbody>
            
          {loading && (
              <tr>
                <td colSpan={4} className="py-10 text-center">
                  <div className="flex items-center justify-center">
                    {LoaderIcon ? (
                      <LoaderIcon className="animate-spin text-blue-500" size={36} />
                    ) : (
                      "Loading..."
                    )}
                  </div>
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr><td colSpan={4} className="px-4 py-6 text-red-400 text-center">{error}</td></tr>
            )}
            {!loading && !error && current.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-slate-400 text-center">No audit records found.</td></tr>
            )}
            {!loading && !error && current.map((row) => (
              <tr
                key={row.auditId ?? `${row.userId}-${row.timestampUtc}`}
                className="border-t border-white/10 hover:bg-white/10 transition"
              >
                <td className="px-4 py-3 font-mono text-purple-300">{row.auditId ?? "—"}</td>
                <td className="px-4 py-3">{row.userId ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-white/10 text-slate-200">
                    {row.action ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{formatTs(row.timestampUtc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pager */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-sm text-slate-400">
          Showing {current.length} of {sorted.length} · Page{" "}
          <span className="text-white font-medium">{pageSafe}</span> / {totalPages}
        </span>
        <div className="flex gap-3">
          <button
            disabled={pageSafe <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition"
          >
            Previous
          </button>
          <button
            disabled={pageSafe >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
