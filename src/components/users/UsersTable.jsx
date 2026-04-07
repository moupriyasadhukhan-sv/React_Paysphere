import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/http";
import { useNavigate } from "react-router-dom";
import { useIcon } from "../../hooks/useIcon";
const PAGE_SIZE = 4;

async function mapLimit(items, limit, fn) {
  const res = new Array(items.length);
  let idx = 0;
  let act = 0;
  return new Promise((resolve) => {
    const next = () => {
      if (idx >= items.length && act === 0) return resolve(res);
      while (act < limit && idx < items.length) {
        const i = idx++;
        act++;
        Promise.resolve(fn(items[i], i))
          .then((v) => (res[i] = v))
          .catch(() => (res[i] = null))
          .finally(() => { act--; next(); });
      }
    };
    next();
  });
}

export default function UsersTable() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const LoaderIcon = useIcon("Loader");

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    async function loadData() {
      try {
        const res = await api.get("/api/Users", {
          params: { role: "User", page, pageSize: PAGE_SIZE },
        });

        const payload = res?.data;
        const users = Array.isArray(payload?.data) ? payload.data : [];

        if (!mounted) return;

        setTotal(Number.isFinite(payload?.total) ? payload.total : users.length);

        const computedTotalPages = Number.isFinite(payload?.totalPages)
          ? payload.totalPages
          : Number.isFinite(payload?.total)
          ? Math.max(1, Math.ceil(payload.total / PAGE_SIZE))
          : Math.max(1, Math.ceil(users.length / PAGE_SIZE));

        setTotalPages(computedTotalPages);

        const limitsResponse = await api.get("/api/limits");
        const allLimits = Array.isArray(limitsResponse?.data?.data)
          ? limitsResponse.data.data
          : [];

        const merged = users.map(u => {
            const userId = u.userId ?? u.UserID ?? u.userID;
            const foundLimit = allLimits.find(l => l.userID === userId);

            const wd = u.wallet || {}; // wallet already included in response

          return {
            userId,
            name: u.name,
            status: wd.status ?? "Active",
            balance: wd.balance ?? 0,
            limitId: foundLimit ? foundLimit.limitID : null,
          };
    });
        if (mounted) setRows(merged);
      } catch (err) {
        console.error(err);
        if (mounted) { setRows([]); setTotal(0); setTotalPages(1); }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => { mounted = false; };
  }, [page]);

  const pageSafe = Math.max(1, Math.min(page, totalPages || 1));
  const canPrev = useMemo(() => !loading && pageSafe > 1, [loading, pageSafe]);
  const canNext = useMemo(() => !loading && pageSafe < (totalPages || 1), [loading, pageSafe, totalPages]);

  const gotoPrev = () => canPrev && setPage((p) => Math.max(1, p - 1));
  const gotoNext = () => canNext && setPage((p) => Math.min((totalPages || 1), p + 1));

  const currency = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(n || 0);

  return (
    <div>
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-white">User Management</h2>
        <p className="text-sm text-slate-300">View and manage all registered users</p>
      </div>

      <div className="overflow-auto border border-white/10 backdrop-blur-lg rounded-xl bg-white/5">
        <table className="min-w-full text-sm text-slate-200">
          <thead className="bg-white/10 text-slate-100">
            <tr className="text-left">
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Create Limit</th>
              <th className="px-4 py-3">Show Limit</th>
              <th className="px-4 py-3">Update Limit</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
            <tr>
              <td colSpan={7} className="py-10 text-center">
                <div className="flex items-center justify-center">
                  {LoaderIcon ? (
                    <LoaderIcon className="animate-spin text-blue-500" size={40} />
                  ) : (
                    "Loading..."
                  )}
                </div>
              </td>
            </tr>
          )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-slate-400 text-center">No users found.</td>
              </tr>
            )}
            {!loading && rows.map((r) => (
              <tr key={r.userId} className="border-t border-white/10 hover:bg-white/10 transition">
                <td className="px-4 py-3">{r.userId}</td>
                <td className="px-4 py-3">
                  <span className="font-medium text-white">{r.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                    (r.status || "").toLowerCase() === "active"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-slate-500/20 text-slate-300"
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">{currency(r.balance)}</td>
                <td className="px-4 py-3">
                  <button

                    onClick={() => {
                        if (r.limitId) {
                          // limit exists → redirect to update form
                          navigate(`/dashboard/admin/limits/update/${r.limitId}`);
                        } else {
                          // no limit → go to create page
                          navigate(`/dashboard/admin/limits/create?userId=${r.userId}`);
                        }
                      }}
                    className="px-3 py-1.5 rounded-md text-white bg-cyan-500 hover:bg-cyan-600 shadow-[0_0_12px_rgba(0,255,255,0.5)] hover:shadow-[0_0_18px_rgba(0,255,255,0.8)] active:scale-95 transition"
                  >
                    Create Limit
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => navigate(`/dashboard/admin/limits/${encodeURIComponent(r.userId)}`)}
                    className="px-3 py-1.5 rounded-md text-white bg-teal-600 hover:bg-teal-700 shadow-[0_0_10px_rgba(20,184,166,0.5)] hover:shadow-[0_0_15px_rgba(20,184,166,0.8)] active:scale-95 transition px-3 py-1.5 rounded-md text-white bg-teal-600 hover:bg-teal-700 active:scale-95 transition shadow"
                  >
                    Show Limit
                  </button>
                </td>
                <td className="px-4 py-3">
                  {r.limitId ? (
                    <button
                      onClick={() => navigate(`/dashboard/admin/limits/update/${r.limitId}`)}
                      className="px-3 py-1.5 rounded-md text-white bg-yellow-500 hover:bg-yellow-600 shadow-[0_0_10px_rgba(255,200,0,0.5)] hover:shadow-[0_0_15px_rgba(255,200,0,0.8)] active:scale-95 transition"
                    >
                      Update Limit
                    </button>
                  ) : (
                    <span className="text-slate-500 italic text-xs">No limit set</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pager */}
      <div className="flex items-center justify-end gap-3 mt-3">
        <button
          className="px-3 py-1.5 border border-white/10 text-white rounded-md disabled:opacity-40 bg-white/10 hover:bg-white/20 active:scale-95 transition"
          disabled={!canPrev}
          onClick={gotoPrev}
        >
          Previous
        </button>
        <span className="text-sm text-slate-300">
          Page {pageSafe}{totalPages ? ` / ${totalPages}` : ""} • Showing {rows.length} of {Number.isFinite(total) ? total : rows.length}
        </span>
        <button
          className="px-3 py-1.5 border border-white/10 text-white rounded-md disabled:opacity-40 bg-white/10 hover:bg-white/20 active:scale-95 transition"
          disabled={!canNext}
          onClick={gotoNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
