import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBranches, deleteBranch } from "../../../services/logistik/branchApi";

export default function GudangPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getAllBranches();
            setData(res || []);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin hapus data gudang ini?")) return;

        try {
            await deleteBranch(id);
            fetchData();
        } catch (err) {
            alert(err.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="font-bold text-lg">Gudang</h1>
                <button
                    onClick={() => navigate("/gudang/create")}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                    + Tambah
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full text-sm border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">Kode</th>
                            <th className="p-2">Alamat</th>
                            <th className="p-2">Kota</th>
                            <th className="p-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center p-3">
                                    Tidak ada data
                                </td>
                            </tr>
                        ) : (
                            data.map((b) => (
                                <tr key={b.id} className="border-t">
                                    <td className="p-2">{b.branch_code}</td>
                                    <td className="p-2">{b.address}</td>
                                    <td className="p-2">{b.city}</td>
                                    <td className="p-2 space-x-2">
                                        <button
                                            onClick={() => navigate(`/gudang/edit/${b.id}`)}
                                            className="text-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            className="text-red-600"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}