import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  createPengantaranApi, 
  fetchPengantaranApi, 
  activePengantaranApi,
  addPackageStatus,
  addPaymentMethodApi
} from "../../utils/api";
import UpdateActivePackageModal from "../../components/modals/packages/UpdateActivePackageModal";
import PaymentMethodModal from "../../components/modals/invoice/PaymentMethodModal";

export default function ManageDelivery() {
  const { user } = useAuth();
  const userRole = user?.role;

  const [invoiceId, setInvoiceId] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [showModal, setShowModal] = useState(null); 
  const [showPaymentModal, setShowPaymentModal] = useState(false); 
  const navigate = useNavigate();

  const loadDeliveries = async () => {
    try {
      const data = await fetchPengantaranApi();
      setDeliveries(data);
    } catch (err) {
      console.error("Gagal ambil deliveries:", err.message);
    }
  };

  const handleAdd = () => {
    if (!invoiceId) {
      alert("Masukkan Invoice ID terlebih dahulu");
      return;
    }
    setShowPaymentModal(true); 
  };

  const handlePaymentSubmit = async (paymentMethod) => {
    try {
      const response = await createPengantaranApi({ invoice_id: invoiceId });

      if (response.inserted?.length > 0) {
        for (const pkgId of response.inserted) {
          await addPackageStatus(pkgId, 6);
        }
        await addPaymentMethodApi({ invoiceIds: [invoiceId], paymentMethod });
      }

      setInvoiceId("");
      await loadDeliveries();

    } catch (err) {
      alert(err.message);
      console.error("Gagal menambah pengantaran:", err);
    } finally {
      setShowPaymentModal(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-white flex flex-col items-center">
      {/* Input invoice + tombol tambah */}
      {userRole === "Manager Destination Warehouse" && (
        <div className="flex gap-2 mb-6 w-full max-w-3xl">
          <input
            type="text"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
            placeholder="Masukkan Invoice ID"
            className="flex-1 border p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
          />
          <button
            onClick={handleAdd}
            className="bg-[#3e146d] text-white px-4 py-2 rounded-3xl hover:bg-blue-600 transition"
          >
            +
          </button>
        </div>
      )}

      {/* Daftar pengantaran */}
      <div className="w-full max-w-3xl">
        <h2 className="text-xl font-semibold text-[#3e146d] mb-4">Daftar Request</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveries.map((inv) => (
            <div 
              key={inv.id}
              className="p-4 border rounded-2xl shadow-sm hover:shadow-md transition flex flex-col gap-3 bg-white"
            >
              <div 
                onClick={() => navigate(`/invoices/${inv.id}`)} 
                className="cursor-pointer flex flex-col gap-1"
              >
                <h3 className="text-[#3e146d] font-semibold">{inv.nama_invoice?.toUpperCase()}</h3>
                <h4 className="text-gray-600">{inv.id}</h4>
                <p className="text-gray-700">Rp {Number(inv.total_price).toLocaleString("id-ID")}</p>
                <p className="text-gray-500 text-sm">{inv.created_at}</p>
              </div>

            {userRole === "Courier" && (
              <button
                onClick={() => setShowModal(inv.id)}
                className="mt-2 w-full bg-[#3e146d] text-white py-2 rounded-2xl hover:bg-green-700 transition"
              >
                Input Resi Pickup
              </button>
            )}

              {showModal === inv.id && (
                <UpdateActivePackageModal
                  onClose={() => setShowModal(null)}
                  activePengantaranApi={activePengantaranApi}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal Payment Method */}
      <PaymentMethodModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
}