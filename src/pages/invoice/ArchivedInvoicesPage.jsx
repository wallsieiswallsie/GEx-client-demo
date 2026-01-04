import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApi, fetchArchivedInvoicesApi } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

function ArchivedInvoicesPage() {
  const { request } = useApi();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userBranch = user?.cabang?.toLowerCase();
  const userRole = user?.role;

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("semua");

  useEffect(() => {
    const loadArchivedInvoices = async () => {
      setLoading(true);
      try {
        const res = await request(fetchArchivedInvoicesApi);
        setInvoices(res.data || []);
      } catch (err) {
        console.error("Gagal ambil invoice arsip:", err);
      } finally {
        setLoading(false);
      }
    };

    loadArchivedInvoices();
  }, [request]);

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
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#3e146d]">Invoice Arsip</h2>
      </div>

      {/* Filter + Search */}
      <div className="w-full max-w-3xl flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Cari berdasarkan nama atau id invoice"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
        />

        {userRole !== "Manager Destination Warehouse" && (
          <select
            id="branchFilter"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-4 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d] min-w-[140px]"
          >
            <option value="semua">Semua Cabang</option>
            <option value="remu">Remu</option>
            <option value="aimas">Aimas</option>
          </select>
        )}
      </div>

      {/* List Invoice */}
      {loading ? (
        <p className="text-gray-500">Memuat invoice arsip...</p>
      ) : filteredInvoices.length === 0 ? (
        <p className="text-gray-500">Invoice tidak ditemukan.</p>
      ) : (
        <div className="w-full max-w-3xl flex flex-col gap-3">
          {filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              className="p-4 border rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer bg-white"
              onClick={() =>
                navigate(`/invoices/${inv.id}`, { state: { archived: true } })
              }
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-[#3e146d] w-1/2">
                  {inv.nama_invoice.toUpperCase()}
                </h3>
                <span className="text-gray-500">{inv.id}</span>
              </div>
              <p className="text-gray-700 mb-1">
                Jumlah Paket: {inv.package_count}
              </p>
              <h4 className="text-[#3e146d] font-bold mb-1">
                Rp {Number(inv.total_price).toLocaleString("id-ID")}
              </h4>
              {inv.cabang && (
                <span className="text-gray-500">{inv.cabang.toUpperCase()}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArchivedInvoicesPage;