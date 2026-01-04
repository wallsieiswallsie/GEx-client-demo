import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchActivePengantaranApi, archivePengantaranApi } from "../../utils/api";
import UpdateArchivePackageModal from "../../components/modals/packages/UpdateArchivePackageModal";

function ActiveDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchActivePengantaranApi();
        setDeliveries(result.data || []);
      } catch (err) {
        console.error("Error fetching active deliveries:", err);
        setError("Gagal memuat data pengantaran aktif");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p className="text-center p-6">Memuat pengantaran aktif...</p>;
  if (error) return <p className="text-red-500 text-center p-6">{error}</p>;
  if (deliveries.length === 0) return <p className="text-center p-6">Tidak ada pengantaran aktif.</p>;

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-[#3e146d] mb-6">Active Deliveries</h2>
      <div className="grid w-full gap-4 sm:grid-cols-1 md:grid-cols-2 max-w-3xl">
        {deliveries.map((inv) => (
          <div
            key={inv.invoice_id}
            className="card p-6 rounded-3xl shadow-lg hover:shadow-xl transition text-center bg-white w-full max-w-2xl mx-auto"
          >
            <div 
              onClick={() => navigate(`/invoices/${inv.invoice_id}`)} 
              className="cursor-pointer mb-3"
            >
              <h3 className="border px-2 py-1 font-bold mb-1">{inv.invoice_id}</h3>                    
              <p className="border px-2 py-1">
                Rp {Number(inv.total_price)?.toLocaleString("id-ID")}
              </p>
            </div>

            <button
              onClick={() => setShowModal(inv.invoice_id)}
              className="mt-3 w-full bg-[#3e146d] text-white py-2 rounded-3xl hover:bg-green-700 transition"
            >
              Input Resi Selesai
            </button>

            {showModal === inv.invoice_id && (
              <UpdateArchivePackageModal
                onClose={() => setShowModal(null)}
                archivePengantaranApi={archivePengantaranApi}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveDeliveries;