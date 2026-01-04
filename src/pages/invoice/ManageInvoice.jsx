import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoices } from "../../hooks/useInvoices";
import { useAuth } from "../../context/AuthContext";
import {
  archivePackagesByInvoicesApi,
} from "../../utils/api";
import PaymentMethodModal from "../../components/modals/invoice/PaymentMethodModal";


function InvoicesPage() {
  const { invoices, loading } = useInvoices();
  const { user } = useAuth();
  const userBranch = user?.cabang?.toLowerCase();
  const userRole = user?.role;

  const navigate = useNavigate();
  const [selectMode, setSelectMode] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSelectInvoice = (invId) => {
    if (selectedInvoices.includes(invId)) {
      setSelectedInvoices(selectedInvoices.filter((id) => id !== invId));
    } else {
      setSelectedInvoices([...selectedInvoices, invId]);
    }
  };

  const handleArchive = async () => {
    if (selectedInvoices.length === 0) return;
    setIsModalOpen(true);
  };

  const handlePaymentSubmit = async (paymentMethod) => {
    try {
      const result = await archivePackagesByInvoicesApi({
        invoiceIds: selectedInvoices,
        paymentMethod,
      });
      alert(
        `Metode pembayaran: ${paymentMethod}\nBerhasil diarsipkan: ${result.data.archivedPackageIds.length} paket`
      );
      setIsModalOpen(false);
      setSelectMode(false);
      setSelectedInvoices([]);
    } catch (err) {
      console.error("Gagal arsipkan paket:", err);
      alert(err.message);
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        inv.nama_invoice?.toLowerCase().includes(searchLower) ||
        inv.id?.toString().toLowerCase().includes(searchLower);

      const branch = inv.cabang?.toLowerCase() || "";

      const matchesBranchFilter =
        userRole === "Manager Destination Warehouse" ||
        branchFilter === "semua" ||
        branch === branchFilter.toLowerCase();

      const matchesUserBranch =
        userBranch === "main" || branch === userBranch;

      return matchesSearch && matchesBranchFilter && matchesUserBranch;
    });
  }, [invoices, search, branchFilter, userBranch, userRole]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-10">
      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#3e146d]">Daftar Invoice</h2>
        <button
          onClick={() => navigate("/archived_invoices")}
          className="px-4 py-2 bg-[#3e146d] text-white rounded-xl shadow hover:opacity-90 transition"
        >
          Arsip
        </button>
      </div>

      {/* Filter + Search + Action */}
      <div className="w-full max-w-3xl flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Cari berdasarkan nama atau id invoice"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
        />

        {userRole === "Manager Main Warehouse" && (
          <select
            id="branchFilter"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d] min-w-[140px]"
          >
            <option value="semua">Semua Cabang</option>
            <option value="remu">Remu</option>
            <option value="aimas">Aimas</option>
          </select>
        )}

        {!selectMode ? (
          <button
            onClick={() => setSelectMode(true)}
            className="px-4 py-2 bg-[#3e146d] text-white rounded-xl shadow hover:opacity-90 transition"
          >
            Pilih
          </button>
        ) : (
          <>
            <button
              onClick={handleArchive}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:opacity-90 transition"
            >
              Arsipkan ({selectedInvoices.length})
            </button>
            <button
              onClick={() => {
                setSelectMode(false);
                setSelectedInvoices([]);
              }}
              className="px-4 py-2 bg-gray-300 rounded-xl shadow hover:opacity-90 transition"
            >
              Batal
            </button>
          </>
        )}
      </div>

      {/* Daftar Invoice */}
      {loading ? (
        <p className="text-gray-500">Memuat daftar invoice...</p>
      ) : filteredInvoices.length === 0 ? (
        <p className="text-gray-500">Invoice tidak ditemukan.</p>
      ) : (
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredInvoices.map((inv) => {
            const isSelected = selectedInvoices.includes(inv.id);
            return (
              <div
                key={inv.id}
                className={`p-4 border rounded-2xl shadow-sm hover:shadow-md transition flex flex-col cursor-pointer ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white"
                }`}
                onClick={() => {
                  if (selectMode) {
                    toggleSelectInvoice(inv.id);
                  } else {
                    navigate(`/invoices/${inv.id}`);
                  }
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-[#3e146d] w-1/2">
                    {inv.nama_invoice.toUpperCase()}
                  </h3>
                  <span className="text-gray-500">{inv.id}</span>
                </div>
                <p className="text-gray-700">
                  Jumlah Paket: {inv.package_count}
                </p>
                <h4 className="text-[#3e146d] font-bold">
                  Rp {Number(inv.total_price).toLocaleString("id-ID")}
                </h4>
                {inv.cabang && (
                  <span className="text-gray-500 mt-1">
                    {inv.cabang.toUpperCase()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <PaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
}

export default InvoicesPage;