import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useArchivePackages } from "../../hooks/useArchivePackages";
import { usePackageStatus } from "../../hooks/usePackageStatus";
import { getStatusLabel } from "../../utils/statusLabels";

import PackageControls from "../../components/PackageControls";
import ErrorBoundary from "../../components/ErrorBoundary";
import PackageCard from "../../components/PackageCard";
import DetailPackageModal from "../../components/modals/packages/DetailPackageModal";

function ArchivePackages() {
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viaFilter, setViaFilter] = useState("all");
  const [cabangFilter, setCabangFilter] = useState("all");

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [latestStatuses, setLatestStatuses] = useState({});

  const navigate = useNavigate();
  const { packages, total, page, limit, loading, error, fetchPackages } =
    useArchivePackages();
  const { fetchLatest } = usePackageStatus();

  useEffect(() => {
    const fetchStatuses = async () => {
      const statusesMap = {};
      for (const pkg of packages) {
        try {
          const res = await fetchLatest(pkg.id);
          statusesMap[pkg.id] = res?.latest ? Number(res.latest.status) : null;
        } catch {
          statusesMap[pkg.id] = null;
        }
      }
      setLatestStatuses(statusesMap);
    };

    if (packages.length > 0) fetchStatuses();
  }, [packages, fetchLatest]);

  useEffect(() => {
    fetchPackages({ filter, sortBy, sortOrder, page, limit });
  }, [filter, sortBy, sortOrder, page, limit, fetchPackages]);

  const handleApplyFilterSort = () => {
    fetchPackages({ filter, sortBy, sortOrder, page: 1, limit });
  };

  const toggleSelect = (pkg) => {
    if (selectedPackages.find((p) => p.id === pkg.id)) {
      setSelectedPackages(selectedPackages.filter((p) => p.id !== pkg.id));
    } else {
      setSelectedPackages([...selectedPackages, pkg]);
    }
  };

  const handleCardRightClick = (e, pkg) => {
    e.preventDefault();
    if (!selectMode) setSelectMode(true);
    toggleSelect(pkg);
  };

  const filteredPackages = packages
    .filter((pkg) => (viaFilter === "all" ? true : pkg.via === viaFilter))
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
    });

  return (
    <div className="ddp-container">
      <h2 className="text-2xl font-bold text-[#3e146d] mb-4">Arsip Paket</h2>

      <PackageControls
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        invoicedFilter={null}
        setInvoicedFilter={() => {}}
        viaFilter={viaFilter}
        setViaFilter={setViaFilter}
        cabangFilter={cabangFilter}
        setCabangFilter={setCabangFilter}
        onApply={handleApplyFilterSort}
        hideSelectButton={true} 
      />

      {loading && <p>Loading data arsip...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPackages.map((pkg) => {
          const isSelected = selectedPackages.some((p) => p.id === pkg.id);
          const latestStatus = latestStatuses[pkg.id];
          const statusLabel = getStatusLabel(latestStatus);

          return (
            <ErrorBoundary key={pkg.id}>
              <div
                onClick={() =>
                  selectMode ? toggleSelect(pkg) : setSelectedPackage(pkg)
                }
                onContextMenu={(e) => handleCardRightClick(e, pkg)}
                
              >
                <PackageCard
                  pkg={pkg}
                  invoiceId={pkg.invoice_id || null}
                  isSelected={isSelected}
                  isDisabled={false}
                  statusLabel={statusLabel}
                  className="flex-1"
                />
              </div>
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

export default ArchivePackages;