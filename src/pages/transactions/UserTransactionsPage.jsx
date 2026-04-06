// src/pages/transactions/UserTransactionsPage.jsx
import { useEffect, useState } from "react";
// import { useAuth } from "../../context/AuthContext.jsx";
import { useSelector } from "react-redux";
import { getUserHistory } from "../../services/transactions/transactionsApi";
import HistoryTable from "../../components/transactions/HistoryTable.jsx";
import TransactionDetailsPanel from "../../components/transactions/TransactionDetailsPanel.jsx";

export default function UserTransactionsPage() {
  // const { auth } = useAuth();
  // const userId = auth?.userId;
   const userId = useSelector((s) => s.auth?.userId);
  // Inline details state
  const [selectedId, setSelectedId] = useState(null);

  // Filters
  const [direction, setDirection] = useState("all");   // sent | received | all
  const [sortBy, setSortBy]       = useState("date");  // date | amount | direction
  const [page, setPage]           = useState(1);
  const [pageSize, setPageSize]   = useState(20);

  // Data
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr]   = useState("");

  async function load() {
    if (!userId) return;
    setBusy(true);
    setErr("");

    try {
      const res = await getUserHistory(userId, {
        direction,
        sortBy,
        page,
        pageSize,
      });
      setData(res);
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.message ||
        "Failed to load transaction history";
      setErr(msg);
      console.error("[Transactions] Error:", e?.response?.data || e);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [userId, direction, sortBy, page, pageSize]);

  return (
    <div className="px-6 py-4">
      <h2 className="text-xl font-semibold mb-1">Transactions</h2>
      <p className="text-slate-500 mb-4">View your transaction history</p>

      {/* Inline details panel */}
      {selectedId && (
        <TransactionDetailsPanel
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <select
          value={direction}
          onChange={(e) => {
            setDirection(e.target.value);
            setPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="sent">Sent</option>
          <option value="received">Received</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="date">Sort: Date (newest)</option>
          <option value="amount">Sort: Amount (high → low)</option>
          <option value="direction">Sort: Direction (sent first)</option>
        </select>

        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Math.min(100, Math.max(1, +e.target.value)));
            setPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <button
          onClick={() => setPage(1)}
          className="ml-1 border rounded px-3 py-1"
        >
          Apply
        </button>
      </div>

      {/* State */}
      {busy && <p>Loading…</p>}
      {err && <p className="text-red-600">Error: {err}</p>}

      {!busy && !err && data && (
        <HistoryTable
          data={data}
          page={page}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() =>
            setPage((p) => (p * data.pageSize < data.total ? p + 1 : p))
          }
          onView={(id) => setSelectedId(id)}
        />
      )}
    </div>
  );
}