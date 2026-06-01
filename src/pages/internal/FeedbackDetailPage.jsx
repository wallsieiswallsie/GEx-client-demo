import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Paperclip, Save } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { LoadingState } from "../../components/common/Loading";
import {
  getInternalFeedbackDetail,
  statusLabels,
  updateInternalFeedbackStatus,
} from "../../services/api/customerFeedbackApi";

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

function InfoRow({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-800">{value || "-"}</dd>
    </div>
  );
}

export default function FeedbackDetailPage() {
  const { role } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");
        setFeedback(await getInternalFeedbackDetail(id));
      } catch (err) {
        setError(err.message || "Detail masukan belum dapat dimuat.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (role !== "general_manager") {
    return <Navigate to="/home" replace />;
  }

  const markAs = async (status) => {
    try {
      setSaving(true);
      setError("");
      setFeedback(await updateInternalFeedbackStatus(id, status));
    } catch (err) {
      setError(err.message || "Status belum dapat diperbarui.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-dvh bg-slate-50 p-4 pb-28 text-slate-900">
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
          <h1 className="text-lg font-black text-slate-950">Detail Feedback</h1>
          <p className="text-xs text-slate-500">Tinjau dan update status masukan</p>
        </div>
      </div>

      {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div>}

      {loading ? (
        <LoadingState variant="list" rows={5} />
      ) : feedback ? (
        <article className="space-y-4 rounded-[24px] border border-white bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-400">{formatDate(feedback.created_at)}</p>
              <h2 className="mt-1 text-xl font-black text-slate-950">{feedback.category}</h2>
            </div>
            <StatusBadge status={feedback.status} />
          </div>

          <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4">
            <InfoRow label="Customer" value={feedback.customer_name} />
            <InfoRow label="Nomor HP" value={feedback.contact_number} />
            <InfoRow label="Nomor Resi" value={feedback.tracking_number} />
            <InfoRow label="Update Status" value={formatDate(feedback.status_updated_at)} />
          </dl>

          <div>
            <h3 className="text-sm font-black text-slate-950">Isi Masukan</h3>
            <p className="mt-2 whitespace-pre-wrap rounded-2xl border border-slate-100 p-4 text-sm leading-relaxed text-slate-700">
              {feedback.message}
            </p>
          </div>

          {feedback.attachment_url && (
            <a
              href={feedback.attachment_url}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200 font-bold text-violet-700"
            >
              <Paperclip className="h-5 w-5" />
              Buka Lampiran
            </a>
          )}

          <div className="grid grid-cols-2 gap-3 border-t border-dashed border-slate-200 pt-4">
            <button
              type="button"
              disabled={saving || feedback.status === "reviewed"}
              onClick={() => markAs("reviewed")}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-amber-500 font-black text-white disabled:bg-slate-300"
            >
              <Save className="h-4 w-4" />
              Reviewed
            </button>
            <button
              type="button"
              disabled={saving || feedback.status === "resolved"}
              onClick={() => markAs("resolved")}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 font-black text-white disabled:bg-slate-300"
            >
              <Save className="h-4 w-4" />
              Resolved
            </button>
          </div>
        </article>
      ) : null}
    </div>
  );
}
