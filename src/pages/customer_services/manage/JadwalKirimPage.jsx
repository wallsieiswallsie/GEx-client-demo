import { useState, useEffect } from "react";
import { useCustomerApi } from "../../../hooks/useCustomerApi";
import { MoreVertical, CheckSquare, Square } from "lucide-react";

function JadwalKirimPage() {
  const {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    patchItem,
    deleteItem,
  } = useCustomerApi("jadwalKirim");

  const [namaKapal, setNamaKapal] = useState("");
  const [tanggalClosing, setTanggalClosing] = useState("");
  const [tanggalBerangkat, setTanggalBerangkat] = useState("");
  const [estimasiTiba, setEstimasiTiba] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [localEditId, setLocalEditId] = useState(null);

  // ✅ SORT: paling bawah = tanggal_closing paling jauh
  const sortedItems = [...items].sort(
    (a, b) => new Date(a.tanggal_closing) - new Date(b.tanggal_closing)
  );

  // ✅ Reset form
  const resetForm = () => {
    setNamaKapal("");
    setTanggalClosing("");
    setTanggalBerangkat("");
    setEstimasiTiba("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (!namaKapal.trim()) {
        setMessage("Nama kapal tidak boleh kosong.");
        setSaving(false);
        return;
      }

      const payload = {
        nama_kapal: namaKapal,
        tanggal_closing: tanggalClosing,
        tanggal_berangkat: tanggalBerangkat,
        estimasi_tiba: estimasiTiba,
      };

      if (localEditId) {
        await patchItem(localEditId, payload);
        setMessage("Berhasil memperbarui jadwal kirim.");
        setLocalEditId(null);
      } else {
        await createItem(payload);
        resetForm();
        setMessage("Berhasil menambahkan jadwal kirim.");
      }

      fetchItems();
    } catch (err) {
      setMessage(err.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!confirm("Yakin hapus jadwal kirim yang dipilih?")) return;
    for (const id of selectedIds) await deleteItem(id);
    setSelectedIds([]);
    setSelectionMode(false);
    fetchItems();
  };

  // ✅ Edit hanya 1 item
  const handleEditSelected = () => {
    if (selectedIds.length !== 1) {
      alert("Pilih 1 item saja untuk edit.");
      return;
    }

    const selected = items.find((i) => i.id === selectedIds[0]);

    setLocalEditId(selected.id);
    setNamaKapal(selected.nama_kapal);
    setTanggalClosing(selected.tanggal_closing);
    setTanggalBerangkat(selected.tanggal_berangkat);
    setEstimasiTiba(selected.estimasi_tiba);

    setSelectionMode(false);
    setSelectedIds([]);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-[#3e146d]/20">
        <h2 className="text-2xl font-bold text-center text-[#3e146d] mb-6">
          {localEditId ? "Edit Jadwal Kirim" : "Tambah Jadwal Kirim"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Nama Kapal */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">Nama Kapal</label>
                <input
                type="text"
                placeholder="Nama Kapal"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#3e146d]"
                value={namaKapal}
                onChange={(e) => setNamaKapal(e.target.value)}
                required
                />
            </div>

            {/* Tanggal Closing */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">Tanggal Closing</label>
                <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#3e146d]"
                value={tanggalClosing}
                onChange={(e) => setTanggalClosing(e.target.value)}
                required
                />
            </div>

            {/* Tanggal Berangkat */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">Tanggal Berangkat</label>
                <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#3e146d]"
                value={tanggalBerangkat}
                onChange={(e) => setTanggalBerangkat(e.target.value)}
                />
            </div>

            {/* Estimasi Tiba */}
            <div className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1">Estimasi Tiba</label>
                <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#3e146d]"
                value={estimasiTiba}
                onChange={(e) => setEstimasiTiba(e.target.value)}
                />
            </div>

            <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#3e146d] text-white font-semibold py-2 rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
                {saving
                ? "Menyimpan..."
                : localEditId
                ? "Simpan Perubahan"
                : "Tambah"}
            </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-[#3e146d]">{message}</p>
        )}
        {error && (
          <p className="mt-2 text-center text-sm text-red-500">{error}</p>
        )}
      </div>

      {/* LIST SECTION */}
      {sortedItems.length > 0 && (
        <div className="w-full max-w-md mt-8 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-2 relative">
            <h3 className="text-lg font-semibold text-[#3e146d]">
              Jadwal Kirim
            </h3>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded hover:bg-gray-100"
            >
              <MoreVertical size={20} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 bg-white border shadow-md rounded-lg w-32 z-20">
                <button
                  className="w-full px-3 py-2 hover:bg-gray-100 text-left"
                  onClick={() => {
                    setSelectionMode(true);
                    setMenuOpen(false);
                  }}
                >
                  Edit
                </button>

                <button
                  className="w-full px-3 py-2 hover:bg-gray-100 text-left text-red-600"
                  onClick={() => {
                    setSelectionMode(true);
                    setMenuOpen(false);
                  }}
                >
                  Hapus
                </button>
              </div>
            )}
          </div>

          {selectionMode && (
            <div className="flex gap-2 mb-2">
              <button
                onClick={handleEditSelected}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm"
              >
                Edit Terpilih
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm"
              >
                Hapus Terpilih
              </button>
              <button
                onClick={() => {
                  setSelectionMode(false);
                  setSelectedIds([]);
                }}
                className="px-3 py-2 bg-gray-300 rounded-lg text-sm"
              >
                Batal
              </button>
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-500">Memuat...</p>
          ) : (
            sortedItems.map((item, index) => (
              <div
                key={item.id}
                className="p-3 border rounded-lg shadow-sm hover:shadow-md transition bg-white flex flex-col gap-1"
              >
                <div className="flex gap-2 items-start">
  {selectionMode ? (
    <button onClick={() => toggleSelect(item.id)}>
      {selectedIds.includes(item.id) ? (
        <CheckSquare className="text-[#3e146d]" />
      ) : (
        <Square />
      )}
    </button>
  ) : (
    <span className="font-semibold text-[#3e146d]">
      {index + 1}.
    </span>
  )}

  <div className="flex-1">
    <p className="text-gray-800 font-semibold">
      {item.nama_kapal.toUpperCase()}
    </p>

    {/* Closing */}
    <div className="flex text-sm text-gray-700">
      <span className="w-32 bg-green-100 px-2 py-0.5 rounded my-1">
        Closing
      </span>
      <span className="ml-1">: {item.tanggal_closing.split("T")[0]}</span>
    </div>

    {/* Berangkat */}
    <div className="flex text-sm text-gray-700">
      <span className="w-32 bg-yellow-100 px-2 py-0.5 rounded my-1">
        Berangkat
      </span>
      <span className="ml-1">: {item.tanggal_berangkat.split("T")[0]}</span>
    </div>

    {/* Estimasi Tiba */}
    <div className="flex text-sm text-gray-700">
      <span className="w-32 bg-lime-100 px-2 py-0.5 rounded my-1">
        Estimasi Tiba
      </span>
      <span className="ml-1">: {item.estimasi_tiba.split("T")[0]}</span>
    </div>
  </div>
</div>

              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default JadwalKirimPage;