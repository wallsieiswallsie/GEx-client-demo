import { useState } from "react";

function InvoiceActions({ onCreate }) {
  const [namaInvoice, setNamaInvoice] = useState("");

  const handleClick = () => {
    if (!namaInvoice.trim()) {
      alert("Nama customer harus diisi!");
      return;
    }
    onCreate(namaInvoice); 
    setNamaInvoice("");
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-2xl p-4 flex gap-3 items-center border border-[#3e146d]/20">
      <input
        type="text"
        placeholder="Nama Customer"
        value={namaInvoice}
        onChange={(e) => setNamaInvoice(e.target.value)}
        className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
      />
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-[#3e146d] text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition"
      >
        +
      </button>
    </div>
  );
}

export default InvoiceActions;