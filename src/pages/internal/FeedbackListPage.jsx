import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Download, Eye, MessageSquareText, Search } from "lucide-react";
import SubPageHeader from "../../components/layout/SubPageHeader";
import { useAuth } from "../../context/useAuth";
import { LoadingState } from "../../components/common/Loading";
import {
  downloadInternalFeedbacksCsv,
  getInternalFeedbacks,
  statusLabels,
} from "../../services/api/customerFeedbackApi";

const filters = [
  { key: "all", label: "Semua" },
  { key: "new", label: "New" },
  { key: "reviewed", label: "Reviewed" },
  { key: "resolved", label: "Resolved" },
];

const formatDate = (value) =>
  value ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value)) : "-";

function StatusBadge({ status }) {
  const color = {
    new: "bg-blue-50 text-blue-700",
    reviewed: "bg-amber-50 text-amber-700",
    resolved: "bg-emerald-50 text-emerald-700",
  }[status] || "bg-slate-100 text-slate-600";

  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${color}`}>{statusLabels[status] || status}</span>;
}

export default function FeedbackListPage() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ feedbacks: [], pagination: { total: 0, page: 1, limit: 10 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        setData(await getInternalFeedbacks({ status, search, page, limit: 10 }));
      } catch (err) {
        setError(err.message || "Masukan customer belum dapat dimuat.");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [status, search, page]);

  if (role !== "general_manager") {
    return <Navigate to="/home" replace />;
  }

  const totalPages = Math.max(1, Math.ceil(Number(data.pagination?.total || 0) / Number(data.pagination?.limit || 10)));

  return (
    <div className="min-h-dvh bg-slate-50 p-4 pb-28 text-slate-900">
      <SubPageHeader
        title="Saran & Masukan"
        subtitle="Evaluasi feedback customer lintas cabang"
        rightAction={
          <button
            type="button"
            onClick={() => downloadInternalFeedbacksCsv({ status, search })}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-700 text-white"
            aria-label="Export"
          >
            <Download className="h-5 w-5" />
          </button>
        }
      />

      <div className="mb-4 grid gap-3 rounded-2xl bg-white p-3 shadow-sm">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Cari nama customer atau isi feedback"
            className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          />
        </label>
        <div className="grid grid-cols-4 gap-2">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setStatus(item.key);
                setPage(1);
              }}
              className={`h-10 rounded-xl text-xs font-black ${
                status === item.key ? "bg-violet-700 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div>}

      {loading ? (
        <LoadingState variant="list" rows={5} />
      ) : data.feedbacks.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
          <MessageSquareText className="mx-auto mb-3 h-10 w-10 text-violet-700" />
          Belum ada masukan customer.
        </div>
      ) : (
        <div className="space-y-3">
          {data.feedbacks.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-400">{formatDate(item.created_at)}</p>
                  <h2 className="mt-1 truncate font-black text-slate-950">{item.customer_name}</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{item.category}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{item.message}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <button
                type="button"
                onClick={() => navigate(`/feedbacks/${item.id}`)}
                className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-violet-50 text-sm font-black text-violet-700"
              >
                <Eye className="h-4 w-4" />
                Detail
              </button>
            </article>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="h-11 rounded-xl border bg-white font-bold text-slate-600 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="h-11 rounded-xl bg-violet-700 font-bold text-white disabled:bg-slate-300"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
