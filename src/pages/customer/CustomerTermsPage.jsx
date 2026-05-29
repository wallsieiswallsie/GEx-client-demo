import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import { getTermsAndConditions } from "../../services/api/content/contentApi";

export default function CustomerTermsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTermsAndConditions()
      .then((data) => {
        setError(null);
        setItems(data || []);
      })
      .catch((err) => {
        console.error("Gagal memuat bantuan customer:", err);
        setError(err.message || "Bantuan belum dapat dimuat");
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-dvh bg-gray-50 p-4">
      <SubPageHeader title="Bantuan" />

      {loading ? (
        <LoadingState variant="list" rows={4} />
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-white p-5 text-center text-sm text-red-500">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border bg-white p-5 text-center text-sm text-gray-400">Belum ada bantuan tersedia</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <details key={item.id} className="rounded-xl border bg-white p-4 shadow-sm" open>
              <summary className="flex cursor-pointer list-none items-center gap-3 font-semibold text-gray-800">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <FileText className="h-4 w-4" />
                </span>
                {item.title}
              </summary>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">{item.content}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
