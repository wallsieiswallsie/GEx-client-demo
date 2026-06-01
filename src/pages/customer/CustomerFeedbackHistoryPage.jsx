import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, MessageSquareText, Paperclip } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import {
  getMyFeedbackDetail,
  getMyFeedbacks,
  statusLabels,
  statusMessages,
} from "../../services/api/customerFeedbackApi";
import { LoadingState } from "../../components/common/Loading";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
    : "-";

function StatusBadge({ status }) {
  const color = {
    new: "bg-blue-50 text-blue-700",
    reviewed: "bg-amber-50 text-amber-700",
    resolved: "bg-emerald-50 text-emerald-700",
  }[status] || "bg-slate-100 text-slate-600";

  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${color}`}>{statusLabels[status] || status}</span>;
}

export default function CustomerFeedbackHistoryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { role } = useAuth();
  const [items, setItems] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        if (id) {
          setDetail(await getMyFeedbackDetail(id));
        } else {
          const data = await getMyFeedbacks({ limit: 50 });
          setItems(data?.feedbacks || []);
        }
      } catch (err) {
        setError(err.message || "Riwayat masukan belum dapat dimuat.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (role !== "customer") {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-dvh bg-gray-50 p-4 pb-28 text-slate-900">
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-black text-slate-950">{id ? "Detail Masukan" : "Riwayat Masukan"}</h1>
          <p className="text-xs text-slate-500">Status dan arsip masukan Anda</p>
        </div>
      </div>

      {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div>}

      {loading ? (
        <LoadingState variant="list" rows={4} />
      ) : id && detail ? (
        <article className="rounded-[24px] border border-white bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-400">{formatDate(detail.created_at)}</p>
              <h2 className="mt-1 text-xl font-black text-slate-950">{detail.category}</h2>
            </div>
            <StatusBadge status={detail.status} />
          </div>
          <p className="mt-4 rounded-2xl bg-violet-50 px-4 py-3 text-sm font-semibold leading-relaxed text-violet-900">
            {statusMessages[detail.status]}
          </p>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-bold text-slate-500">Nomor HP</dt>
              <dd className="mt-1 text-slate-900">{detail.contact_number || "-"}</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">Nomor Resi</dt>
              <dd className="mt-1 text-slate-900">{detail.tracking_number || "-"}</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-500">Isi Masukan</dt>
              <dd className="mt-2 whitespace-pre-wrap leading-relaxed text-slate-800">{detail.message}</dd>
            </div>
          </dl>
          {detail.attachment_url && (
            <a
              href={detail.attachment_url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200 font-bold text-violet-700"
            >
              <Paperclip className="h-5 w-5" />
              Buka Lampiran
            </a>
          )}
        </article>
      ) : items.length === 0 ? (
        <div className="rounded-[24px] border border-white bg-white p-6 text-center shadow-sm">
          <MessageSquareText className="mx-auto h-12 w-12 text-violet-700" />
          <h2 className="mt-4 font-black text-slate-950">Belum ada masukan</h2>
          <p className="mt-2 text-sm text-slate-500">Masukan yang Anda kirim akan tampil di sini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(`/riwayat-masukan/${item.id}`)}
              className="w-full rounded-[20px] border border-white bg-white p-4 text-left shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-400">{formatDate(item.created_at)}</p>
                  <h2 className="mt-1 truncate font-black text-slate-950">{item.category}</h2>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{statusMessages[item.status]}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-violet-700">
                <Eye className="h-4 w-4" />
                Detail
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
