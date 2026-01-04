import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import DetailPackageModal from "../../components/modals/packages/DetailPackageModal";
import AddPackageToInvoiceModal from "../../components/modals/invoice/AddPackageToInvoiceModal";
import { useInvoiceDetail } from "../../hooks/useInvoiceDetail";
import {
  removePackageFromInvoiceApi,
  addPackagesByResiToInvoiceApi,
} from "../../utils/api";

function InvoiceDetailPage() {
  const { id } = useParams();
  const { invoice, loading, error } = useInvoiceDetail(id);
  const [invoiceData, setInvoiceData] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [showAddResiModal, setShowAddResiModal] = useState(false);
  const [resiList, setResiList] = useState("");

  const longPressTimer = useRef(null);
  const LONG_PRESS_THRESHOLD = 500;

  useEffect(() => {
    if (invoice) setInvoiceData(invoice);
  }, [invoice]);

  if (loading) return <p className="text-gray-500">Loading detail invoice...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!invoiceData) return <p className="text-gray-500">Invoice tidak ditemukan.</p>;

  const toggleSelect = (pkg) => {
    if (selectedPackages.find((p) => p.id === pkg.id)) {
      setSelectedPackages(selectedPackages.filter((p) => p.id !== pkg.id));
      if (selectedPackages.length === 1) setSelectMode(false);
    } else {
      setSelectedPackages([...selectedPackages, pkg]);
    }
  };

  const handleLongPress = (pkg) => {
    if (!selectMode) {
      setSelectMode(true);
      toggleSelect(pkg);
    }
  };

  const handleMouseDown = (pkg) => {
    if (!selectMode) {
      longPressTimer.current = setTimeout(() => handleLongPress(pkg), LONG_PRESS_THRESHOLD);
    }
  };
  const handleMouseUp = () => clearTimeout(longPressTimer.current);
  const handleMouseLeave = () => clearTimeout(longPressTimer.current);
  const handleTouchStart = (pkg) => {
    if (!selectMode) {
      longPressTimer.current = setTimeout(() => handleLongPress(pkg), LONG_PRESS_THRESHOLD);
    }
  };
  const handleTouchEnd = () => clearTimeout(longPressTimer.current);

  const handleRemoveSelected = async () => {
    try {
      for (const pkg of selectedPackages) {
        await removePackageFromInvoiceApi(invoiceData.id, pkg.id);
      }
      setInvoiceData((prev) => {
        const updatedPackages = (prev.packages || []).filter(
          (p) => !selectedPackages.some((sp) => sp.id === p.id)
        );
        const updatedTotal = updatedPackages.reduce((sum, p) => sum + Number(p.harga), 0);
        return { ...prev, packages: updatedPackages, total_price: updatedTotal };
      });
      setSelectedPackages([]);
      setSelectMode(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus paket: " + err.message);
    }
  };

  const handleAddPackages = async () => {
    if (!resiList.trim()) {
      alert("Masukkan minimal satu nomor resi.");
      return;
    }

    const resiArray = resiList
      .split(/[\s,;]+/)
      .map((r) => r.trim())
      .filter(Boolean);

    try {
      const result = await addPackagesByResiToInvoiceApi(invoiceData.id, resiArray);
      const addedPackages = result.data?.data?.addedPackages || [];
      const totalPrice = result.data?.data?.total_price;

      if (addedPackages.length > 0) {
        setInvoiceData((prev) => {
          const merged = [...(prev.packages || []), ...addedPackages];
          return { ...prev, packages: merged, total_price: totalPrice };
        });
        alert(`Berhasil menambahkan ${addedPackages.length} paket ke invoice.`);
      }

      setResiList("");
      setShowAddResiModal(false);
    } catch (err) {
      console.error("Gagal menambahkan paket:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat menambahkan paket.";

      let alertMessage = "⚠️ Terjadi kesalahan saat menambahkan paket.\n\n";

      if (message.includes("Tidak ada paket ditemukan")) {
        alertMessage += "Nomor resi berikut tidak ditemukan:\n" + resiArray.join(", ");
      } else if (message.includes("sudah masuk invoice")) {
        const match = message.match(/:(.*)/);
        const resiSudahMasuk = match ? match[1].split(",").map(r => r.trim()) : [];
        alertMessage += "Nomor resi berikut sudah di-invoice:\n" + resiSudahMasuk.join(", ");
      } else if (message.includes("Remu") || message.includes("Aimas")) {
        alertMessage = "Paket dari cabang Remu (QA) dan Aimas (QB) tidak boleh digabung dalam satu invoice.";
      } else {
        alertMessage = message;
      }

      alert(alertMessage);
    }
  };

  const packages = invoiceData.packages || [];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-10">
      <div className="flex justify-between w-full items-start mb-6">
        <div className="w-full max-w-3xl mb-6">
          <h2 className="text-2xl font-bold text-[#3e146d] mb-2">
            {invoiceData.nama_invoice.toUpperCase()}
          </h2>
          <p className="text-gray-500 mb-1">ID: {invoiceData.id}</p>
          <p className="text-gray-700 mb-1">
            Jumlah Paket: {invoiceData.package_count || packages.length}
          </p>
          <p className="text-[#3e146d] font-semibold mb-2">
            Total: Rp {Number(invoiceData.total_price).toLocaleString("id-ID")}
          </p>
        </div>

        <div className="mb-4">
          <button
            onClick={() => setShowAddResiModal(true)}
            className="bg-[#3e146d] text-white rounded-full w-10 h-10 text-lg flex items-center justify-center hover:opacity-90 transition"
          >
            +
          </button>
        </div>
      </div>

      {selectMode && selectedPackages.length > 0 && (
          <div className="w-full max-w-3xl mx-auto mb-4">
            <button
              onClick={handleRemoveSelected}
              className="w-full bg-red-600 text-white py-3 rounded-2xl hover:opacity-90 transition font-semibold"
            >
              Hapus Paket Terpilih ({selectedPackages.length})
            </button>
          </div>
        )}

      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {packages.map((pkg) => {
          const isSelected = selectedPackages.some((p) => p.id === pkg.id);
          return (
            <div
              key={pkg.id}
              onClick={() =>
                selectMode ? toggleSelect(pkg) : setSelectedPackage(pkg)
              }
              onContextMenu={(e) => {
                e.preventDefault();
                handleLongPress(pkg);
              }}
              onMouseDown={() => handleMouseDown(pkg)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart(pkg)}
              onTouchEnd={handleTouchEnd}
              className={`p-4 border rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer ${
                isSelected ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
              }`}
            >
              <h4 className="text-[#3e146d] font-semibold mb-1">{pkg.nama.toUpperCase()}</h4>
              <p className="text-gray-700 mb-1">{pkg.resi.toUpperCase()}</p>
              <p className="text-gray-700 mb-1">{pkg.berat_dipakai} kg</p>
              <p className="text-gray-700 mb-1">{pkg.via}</p>
              <p className="text-[#3e146d] font-medium">
                Rp {Number(pkg.harga).toLocaleString("id-ID")}
              </p>
            </div>
          );
        })}
      </div>

      <DetailPackageModal
        pkg={selectedPackage}
        invoiceId={invoiceData.id}
        onClose={() => setSelectedPackage(null)}
        onRemoved={(id) =>
          setInvoiceData((prev) => {
            const updatedPackages = (prev.packages || []).filter((p) => p.id !== id);
            const updatedTotal = updatedPackages.reduce(
              (sum, p) => sum + Number(p.harga),
              0
            );
            return { ...prev, packages: updatedPackages, total_price: updatedTotal };
          })
        }
      />

      {showAddResiModal && (
        <AddPackageToInvoiceModal
          resiList={resiList}
          setResiList={setResiList}
          onClose={() => setShowAddResiModal(false)}
          onAdd={handleAddPackages}
        />
      )}
    </div>
  );
}

export default InvoiceDetailPage;
