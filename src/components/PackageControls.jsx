import React, { useState, useRef, useEffect } from "react";

function PackageControls({
  filter,
  setFilter,
  invoicedFilter,
  setInvoicedFilter,
  viaFilter,
  setViaFilter,
  cabangFilter,
  setCabangFilter,
  bermasalahFilter,
  setBermasalahFilter,
  selectMode,
  setSelectMode,
  setSelectedPackages,
  hideSelectButton = false,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const popoverRef = useRef(null);

  const handleToggleSelect = () => {
    setSelectMode(!selectMode);
    setSelectedPackages([]);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="ddp-controls flex items-center gap-3 relative">
      {/* Input pencarian */}
      <input
        type="text"
        placeholder="Cari nama atau resi..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d] w-48"
      />

      {/* Tombol titik tiga */}
      <button
        onClick={handleToggleFilters}
        className="px-3 py-2 border rounded-lg shadow-sm hover:bg-gray-100 transition"
        title="Filter lainnya"
      >
        ⋮
      </button>

      {/* Popover berisi filter tambahan */}
      {showFilters && (
        <div
          ref={popoverRef}
          className="absolute top-full z-50 left-0 mt-2 bg-white border shadow-lg rounded-2xl p-4 flex flex-col gap-3 w-56"
        >
          {invoicedFilter !== null && (
            <select
              value={invoicedFilter}
              onChange={(e) => setInvoicedFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d] w-full"
            >
              <option value="all">Semua Paket</option>
              <option value="yes">Sudah Invoiced</option>
              <option value="no">Belum Invoiced</option>
            </select>
          )}

          <select
            value={viaFilter}
            onChange={(e) => setViaFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d] w-full"
          >
            <option value="all">Semua Moda</option>
            <option value="Kapal">Kapal</option>
            <option value="Pesawat">Pesawat</option>
          </select>

          <select
            value={cabangFilter}
            onChange={(e) => setCabangFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d] w-full"
          >
            <option value="all">Semua Cabang</option>
            <option value="Remu">Remu</option>
            <option value="Aimas">Aimas</option>
          </select>

          <select
            value={bermasalahFilter}
            onChange={(e) => setBermasalahFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d] w-full"
          >
            <option value="all">Semua</option>
            <option value="yes">Bermasalah</option>
          </select>

        </div>
      )}

      {/* Tombol mode pilih */}
      {!hideSelectButton && selectMode !== undefined && setSelectMode && setSelectedPackages && (
        <button
          className={`px-4 py-2 rounded-lg font-semibold shadow-md transition ${
            selectMode
              ? "bg-[#3e146d] text-white hover:opacity-90"
              : "border hover:bg-gray-100"
          }`}
          onClick={handleToggleSelect}
        >
          {selectMode ? "Batal" : "Pilih"}
        </button>
      )}
    </div>
  );
}

export default PackageControls;