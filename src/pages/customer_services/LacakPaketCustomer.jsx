import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePackages } from "../../hooks/usePackages";
import ErrorBoundary from "../../components/ErrorBoundary";
import PackageCard from "../../components/PackageCard";
import { usePackageStatus } from "../../hooks/usePackageStatus";
import { getStatusLabel } from "../../utils/statusLabels";
import { Truck, Clock, Shield } from "lucide-react";

import SyaratKetentuanIcon from "../../../public/images/customer_service/syarat_ketentuan.svg";
import JadwalKirimIcon from "../../../public/images/customer_service/jadwal_kirim.svg";
import LokasiKontakIcon  from "../../../public/images/customer_service/lokasi_kontak.svg";
import SeringDitanyakanIcon  from "../../../public/images/customer_service/sering_ditanyakan.svg";

function LacakPaketCustomer() {
  const navigate = useNavigate();
  const [resiQuery, setResiQuery] = useState("");        
  const [searchedResi, setSearchedResi] = useState("");  
  const [latestStatuses, setLatestStatuses] = useState({});
  const [hasSearched, setHasSearched] = useState(false);

  const { packages } = usePackages();
  const { fetchLatest } = usePackageStatus();

  const matchedPackage = packages.find(
    (pkg) => pkg.resi.toLowerCase() === searchedResi.toLowerCase()
  );

  const handleSearch = async () => {
    setHasSearched(true);
    setSearchedResi(resiQuery); 

    const match = packages.find(
      (pkg) => pkg.resi.toLowerCase() === resiQuery.toLowerCase()
    );

    if (!match) {
      setLatestStatuses({});
      return;
    }

    try {
      const res = await fetchLatest(match.id);
      setLatestStatuses({
        [match.id]: res?.latest ? Number(res.latest.status) : null,
      });
    } catch {
      setLatestStatuses({ [match.id]: null });
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#f8f5ff] via-[#faf0ff] to-[#ffeef4] flex flex-col items-center py-10 px-10">
    
    {/* HERO SECTION */}
    <div className="w-full  py-8 px-6">
      <div className="max-w-4xl mx-auto text-left">
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight text-gray-900">
          Kirimanmu Jadi{" "}
        </h1>

        <h1>
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text
                          text-5xl sm:text-6xl font-extrabold leading-tight">
            Mudah & Nyaman
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl leading-relaxed mt-6">
          Nikmati pengiriman yang <strong>Mudah</strong>, <strong>Nyaman</strong>, dan <strong>Transparan</strong>.
          Lacak paketmu melalui kolom di bawah ini menggunakan nomor resi,
          atau nomor pesanan jika layanan kurirmu adalah <em>Instant/Sameday</em>.
        </p>
      </div>
    </div>
    
    {/* BOX LACAK PAKET */}
    <div className="w-full bg-white shadow-xl rounded-2xl p-8 border border-[#3e146d]/10">
      <h2 className="text-3xl font-bold text-center text-[#3e146d] mb-6">
        Lacak Paket 
      </h2>

      <div className="flex flex-col gap-3 mb-4">
        <input
          type="text"
          placeholder="Masukkan nomor resi..."
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
          value={resiQuery}
          onChange={(e) => setResiQuery(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="w-full bg-[#3e146d] text-white font-semibold py-2 rounded-lg shadow-md hover:opacity-90 transition"
        >
          Cari
        </button>
      </div>

      {hasSearched && searchedResi && !matchedPackage && (
        <p className="text-center text-red-500 mt-4">
          Resi tidak ditemukan.
        </p>
      )}

      {hasSearched && matchedPackage && (
        <div className="mt-4">
          <ErrorBoundary>
            <PackageCard
              pkg={matchedPackage}
              invoiceId={matchedPackage.invoice_id || null}
              isSelected={false}
              isDisabled={matchedPackage.invoiced}
              statusLabel={getStatusLabel(latestStatuses[matchedPackage.id])}
            />
          </ErrorBoundary>
        </div>
      )}
    </div>

    {/* 🔹 FEATURE ICON SECTION */}
      <div className="flex justify-center gap-8 mt-12">
        {/* Fast Delivery */}
        <div className="flex flex-col items-center text-center">
          <div className="p-6 bg-blue-100 rounded-full mb-3">
            <Truck className="w-5 h-5 text-blue-600" />
          </div>
          <p className="font-semibold text-gray-800">Fast Delivery</p>
        </div>

        {/* Real-Time Tracking */}
        <div className="flex flex-col items-center text-center">
          <div className="p-6 bg-red-100 rounded-full mb-3">
            <Clock className="w-5 h-5 text-red-500" />
          </div>
          <p className="font-semibold text-gray-800">Real-Time Tracking</p>
        </div>

        {/* Safe & Transparent */}
        <div className="flex flex-col items-center text-center">
          <div className="p-6 bg-gray-100 rounded-full mb-3">
            <Shield className="w-5 h-5 text-gray-600" />
          </div>
          <p className="font-semibold text-gray-800">Safe & Transparent</p>
        </div>
      </div>

    {/* GRID CARD SERVICE */}
      <div className="w-full mt-8 grid grid-cols-2 gap-4">
        {/* CARD: SYARAT & KETENTUAN */}
        <div
          className="p-6 bg-white border border-[#3e146d]/20 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.02] transition flex flex-col items-center text-center"
          onClick={() => navigate("/customer/syarat-ketentuan")}
        >
          <img src={SyaratKetentuanIcon} alt="Syarat Ketentuan" className="w-14 h-14 object-cover rounded-full mb-3" />
          <p className="font-semibold text-[#3e146d]">Syarat & Ketentuan</p>
        </div>

        {/* CARD: JADWAL KIRIM */}
        <div
          className="p-6 bg-white border border-[#3e146d]/20 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.02] transition flex flex-col items-center text-center"
          onClick={() => navigate("/customer/jadwal_kirim")}
        >
          <img src={JadwalKirimIcon} alt="Jadwal Kirim" className="w-14 h-14 object-cover rounded-full mb-3" />
          <p className="font-semibold text-[#3e146d]">Jadwal Kirim</p>
        </div>

        {/* CARD: LOKASI & KONTAK */}
        <div
          className="p-6 bg-white border border-[#3e146d]/20 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.02] transition flex flex-col items-center text-center"
          onClick={() => navigate("/customer/lokasi-kontak")}
        >
          <img src={LokasiKontakIcon} alt="Lokasi Kontak" className="w-14 h-14 object-cover rounded-full mb-3" />
          <p className="font-semibold text-[#3e146d]">Lokasi & Kontak</p>
        </div>

        {/* CARD: SERING DITANYAKAN */}
        <div
          className="p-6 bg-white border border-[#3e146d]/20 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.02] transition flex flex-col items-center text-center"
          onClick={() => navigate("/customer/sering_ditanyakan")}
        >
          <img src={SeringDitanyakanIcon} alt="Sering Ditanyakan" className="w-14 h-14 object-cover rounded-full mb-3" />
          <p className="font-semibold text-[#3e146d]">Sering Ditanyakan</p>
        </div>
      </div>
  </div>
);

}

export default LacakPaketCustomer;