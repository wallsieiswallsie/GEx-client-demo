import React from "react";

function AddPackageToInvoiceModal({ resiList, setResiList, onClose, onAdd }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg">
        <h3 className="text-lg font-semibold text-[#3e146d] mb-2">
          Tambah Paket ke Invoice
        </h3>
        <p className="text-gray-600 mb-3">
          Masukkan daftar resi (pisahkan dengan spasi, koma, atau enter):
        </p>
        <textarea
          value={resiList}
          onChange={(e) => setResiList(e.target.value)}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="py-1 px-3 rounded-md border border-gray-300 hover:bg-gray-100 transition"
          >
            Batal
          </button>
          <button
            onClick={onAdd}
            className="py-1 px-3 rounded-md bg-[#3e146d] text-white hover:bg-green-700 transition"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPackageToInvoiceModal;