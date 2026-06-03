import { useEffect, useState } from "react";
import SubPageHeader from "../../components/layout/SubPageHeader";
import NewsBanner from "../../components/home/NewsBanner";
import { LoadingState } from "../../components/common/Loading";
import { getInstagramContents } from "../../services/api/content/instagramContentApi";

export default function CustomerContentPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getInstagramContents();
        setItems(data || []);
      } catch (err) {
        console.error("Gagal memuat konten customer:", err);
        setError(err.message || "Konten belum dapat dimuat");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="min-h-dvh bg-gray-50 p-4 lg:px-6 lg:pb-10">
      <div className="mb-5">
        <SubPageHeader title="Konten" />
      </div>

      {loading ? (
        <LoadingState variant="list" rows={3} />
      ) : error ? (
        <div className="rounded-2xl border bg-white p-5 text-center text-sm text-red-500 shadow-sm">
          {error}
        </div>
      ) : (
        <NewsBanner banners={items} isLoading={false} />
      )}
    </div>
  );
}
