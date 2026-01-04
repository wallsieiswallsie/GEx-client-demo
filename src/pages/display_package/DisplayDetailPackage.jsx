import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePackages } from "../../hooks/usePackages";
import { createInvoiceApi } from "../../utils/api";
import { usePackageStatus } from "../../hooks/usePackageStatus";
import { getStatusLabel } from "../../utils/statusLabels";

import PackageControls from "../../components/PackageControls";
import ErrorBoundary from "../../components/ErrorBoundary";
import PackageCard from "../../components/PackageCard";
import InvoiceActions from "../../pages/invoice/InvoiceActions";
import DetailPackageModal from "../../components/modals/packages/DetailPackageModal";

function DisplayDetailPackage() {
  const [filter, setFilter] = useState("");
  const [invoicedFilter, setInvoicedFilter] = useState("all");
  const [viaFilter, setViaFilter] = useState("all");
  const [cabangFilter, setCabangFilter] = useState("all");
  const [bermasalahFilter, setBermasalahFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(10);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [latestStatuses, setLatestStatuses] = useState({});

  const navigate = useNavigate();
  const { packages, loading, error, fetchPackages } = usePackages();
  const { fetchLatest } = usePackageStatus();

  const sortedPackages = [...packages].sort((a, b) => b.id - a.id);

  useEffect(() => {
    const fetchStatuses = async () => {
      const statusesMap = {};
      for (const pkg of packages) {
        try {
          const res = await fetchLatest(pkg.id);
          statusesMap[pkg.id] = res?.latest ? Number(res.latest.status) : null;
        } catch (err) {
          console.warn(`Gagal ambil status untuk paket ${pkg.id}:`, err);
          statusesMap[pkg.id] = null;
        }
      }
      setLatestStatuses(statusesMap);
    };

    if (packages.length > 0) {
      fetchStatuses().catch((err) =>
        console.error("Fatal fetchStatuses error:", err)
      );
    }
  }, [packages, fetchLatest]);

  useEffect(() => {
    if (filter !== "") return; // scroll aktif hanya jika sedang cari

    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        setVisibleCount((prev) => prev + 10);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filter]);

  const toggleSelect = (pkg) => {
    if (selectedPackages.find((p) => p.id === pkg.id)) {
      setSelectedPackages(selectedPackages.filter((p) => p.id !== pkg.id));
    } else {
      setSelectedPackages([...selectedPackages, pkg]);
    }
  };

  const handleCreateInvoice = async (namaInvoice) => {
    if (selectedPackages.length === 0) return;
    try {
      await createInvoiceApi({
        packageIds: selectedPackages.map((p) => p.id),
        nama_invoice: namaInvoice,
      });
      alert("Invoice berhasil dibuat!");
      setSelectedPackages([]);
      setSelectMode(false);
      fetchPackages({});
    } catch (err) {
      alert(`Gagal buat invoice: ${err.message}`);
    }
  };

  const filteredPackages = sortedPackages
    .filter((pkg) => {
      if (!filter) return true;
      const lowerFilter = filter.toLowerCase();
      return (
        pkg.nama.toLowerCase().includes(lowerFilter) ||
        pkg.resi.toLowerCase().includes(lowerFilter)
      );
    })
    .filter((pkg) => {
      if (invoicedFilter === "all") return true;
      if (invoicedFilter === "yes") return pkg.invoiced;
      if (invoicedFilter === "no") return !pkg.invoiced;
      return true;
    })
    .filter((pkg) => {
      if (viaFilter === "all") return true;
      return pkg.via === viaFilter;
    })
    .filter((pkg) => {
      if (cabangFilter === "all") return true;

      const kode = pkg.kode?.toUpperCase();
      const cabang =
        kode === "JKSOQA" || kode === "JPSOQA"
          ? "Remu"
          : kode === "JKSOQB" || kode === "JPSOQB"
          ? "Aimas"
          : null;

      return cabang === cabangFilter;
    })
    .filter((pkg) => {
      if (bermasalahFilter === "all") return true;
      if (bermasalahFilter === "yes") return pkg.kode === "Bermasalah";
      return true;
    });

    const limitedPackages = filter === "" ? filteredPackages.slice(0, 30) : filteredPackages;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#3e146d]">Paket Aktif</h2>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
          onClick={() => navigate("/archive_packages")}
        >
          Arsip
        </button>
      </div>

      <div className="w-full max-w-4xl mb-6">
        <PackageControls
          filter={filter}
          setFilter={setFilter}
          invoicedFilter={invoicedFilter}
          setInvoicedFilter={setInvoicedFilter}
          viaFilter={viaFilter}
          setViaFilter={setViaFilter}
          cabangFilter={cabangFilter}
          setCabangFilter={setCabangFilter}
          bermasalahFilter={bermasalahFilter}
          setBermasalahFilter={setBermasalahFilter}
          selectMode={selectMode}
          setSelectMode={setSelectMode}
          setSelectedPackages={setSelectedPackages}
        />
      </div>

      {loading && <p className="text-center text-gray-500">Loading data paket...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {selectMode && selectedPackages.length > 0 && (
        <div className="w-full max-w-4xl mb-4">
          <InvoiceActions onCreate={handleCreateInvoice} />
        </div>
      )}

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {limitedPackages.slice(0, visibleCount).map((pkg) => {
          const isSelected = selectedPackages.some((p) => p.id === pkg.id);
          const isDisabled = pkg.invoiced;

          const latestStatus = latestStatuses[pkg.id];
          const statusLabel = getStatusLabel(latestStatus);

          return (
            <ErrorBoundary key={pkg.id}>
              <PackageCard
                pkg={pkg}
                invoiceId={pkg.invoice_id || null}
                isSelected={isSelected}
                isDisabled={isDisabled}
                statusLabel={statusLabel}
                className="bg-white shadow-lg rounded-2xl border border-[#3e146d]/20 hover:shadow-xl transition cursor-pointer"
                onClick={() =>
                  selectMode
                    ? !isDisabled && toggleSelect(pkg)
                    : setSelectedPackage(pkg)
                }
              />
            </ErrorBoundary>
          );
        })}
      </div>

      {selectedPackage && (
        <DetailPackageModal
          pkg={selectedPackage}
          invoiceId={selectedPackage.invoice_id || null}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </div>
  );
}

export default DisplayDetailPackage;