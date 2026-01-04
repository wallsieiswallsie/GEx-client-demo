import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchArchivePengantaranApi } from "../../utils/api";

function ArchiveDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Ambil data archive dari backend
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchArchivePengantaranApi();
        const data = res.data || [];
        setDeliveries(data);
        setFilteredDeliveries(data);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data arsip pengantaran");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter invoice berdasarkan invoice_id atau resi paket
  useEffect(() => {
    if (!search) {
      setFilteredDeliveries(deliveries);
    } else {
      const query = search.toLowerCase();
      const filtered = deliveries.filter(
        (inv) =>
          inv.invoice_id.toLowerCase().includes(query) ||
          inv.packages.some((pkg) =>
            pkg.resi.toLowerCase().includes(query)
          )
      );
      setFilteredDeliveries(filtered);
    }
  }, [search, deliveries]);

  if (loading) return <p className="p-6 text-center">Memuat arsip pengantaran...</p>;
  if (error) return <p className="p-6 text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6 min-h-screen bg-white">
      <h2 className="text-2xl font-bold mb-4 text-[#3e146d]">Arsip Pengantaran</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari berdasarkan invoice atau resi paket..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {filteredDeliveries.length === 0 ? (
        <p className="text-center">Tidak ada arsip pengantaran.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {filteredDeliveries.map((inv) => (
            <div key={inv.invoice_id} className="card p-4 rounded-3xl shadow-lg hover:shadow-xl transition bg-white w-full max-w-2xl mx-auto">
              <div
                onClick={() => navigate(`/invoices/${inv.invoice_id}`)}
                className="cursor-pointer"
              >
                <h3 className="font-bold text-lg mb-2">{inv.invoice_id}</h3>
                <p className="mb-1">Total Harga: Rp {Number(inv.total_price).toLocaleString("id-ID")}</p>
                <p className="mb-2">Jumlah Paket: {inv.total_packages}</p>
                
                {inv.packages.length > 0 && (
                  <div className="mt-2 border-t pt-2">
                    {inv.packages.map((pkg) => (
                      <p key={pkg.id} className="text-sm mb-1"></p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArchiveDeliveries;