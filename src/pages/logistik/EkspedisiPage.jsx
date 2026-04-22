import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import SubPageHeader from "../../components/layout/SubPageHeader";

export default function EkspedisiPage() {
    const [data] = useState([
        { id: 1, name: "JNE" },
        { id: 2, name: "J&T" },
        { id: 3, name: "SiCepat" },
    ]);

    return (
        <div className="min-h-dvh bg-gray-50 p-4">

            {/* HEADER */}
            <div className="mb-5">
                <SubPageHeader
                    title="Ekspedisi"
                    rightAction={
                        <button className="flex items-center gap-1 bg-violet-600 text-white px-3 py-1.5 rounded-lg text-sm shadow-sm">
                            <Plus size={16} />
                            Tambah
                        </button>
                    }
                />

                <p className="text-xs text-gray-500 mt-1 ml-[42px]">
                    Kelola daftar ekspedisi untuk pengiriman paket
                </p>
            </div>

            {/* SEARCH */}
            <div className="relative mb-5">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Cari ekspedisi..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
            </div>

            {/* LIST */}
            <div className="flex flex-col gap-3">

                {data.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white px-4 py-3 rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition"
                    >
                        {/* LEFT */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 text-sm font-bold">
                                {item.name[0]}
                            </div>

                            <span className="font-medium text-sm text-gray-800">
                                {item.name}
                            </span>
                        </div>

                        {/* RIGHT */}
                        <div className="flex gap-2">
                            <button className="p-2 rounded-lg hover:bg-blue-50">
                                <Pencil className="w-4 h-4 text-blue-500" />
                            </button>

                            <button className="p-2 rounded-lg hover:bg-red-50">
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                        </div>
                    </div>
                ))}

            </div>

            {/* EMPTY STATE (OPTIONAL UI) */}
            {data.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mb-3"></div>
                    Belum ada data ekspedisi
                </div>
            )}

        </div>
    );
}