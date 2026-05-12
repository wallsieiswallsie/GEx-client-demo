import { useEffect, useState } from "react";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import { getDisplayedBranches } from "../../services/api/content/contentApi";

export default function CustomerBranchesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDisplayedBranches()
      .then((data) => setItems(data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-dvh bg-gray-50 p-4">
      <SubPageHeader title="Lokasi Gerai" />

      {loading ? (
        <LoadingState variant="list" rows={4} />
      ) : items.length === 0 ? (
        <div className="rounded-xl border bg-white p-5 text-center text-sm text-gray-400">Belum ada lokasi gerai</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800">{item.branch_name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.address || "-"}</p>
                  {item.phone_number && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-gray-600">
                      <Phone className="h-3 w-3" />
                      {item.phone_number}
                    </p>
                  )}
                  <div className="mt-3 flex gap-2">
                    {item.map_url && <ActionLink href={item.map_url} label="Buka Maps" />}
                    {item.whatsapp_url && <ActionLink href={item.whatsapp_url} label="WhatsApp" />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700"
    >
      {label}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}
