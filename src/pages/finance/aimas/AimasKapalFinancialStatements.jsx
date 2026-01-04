import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchFinanceTotalApi,
  fetchFinanceFinishedApi,
  fetchFinanceUnfinishedApi,
  fetchFinanceFinishedGroupedApi,
} from "../../../utils/api";

const PAYMENT_METHODS = ["Qris", "Transfer Bank", "Tunai"];

const AimasKapalFinancialStatements = () => {
  const { batchId } = useParams();
  const [data, setData] = useState({
    total: 0,
    finished: 0,
    unfinished: 0,
  });
  const [finishedGrouped, setFinishedGrouped] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const kode = "JKSOQB";

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        const [totalRes, finishedRes, unfinishedRes, finishedGroupedRes] =
          await Promise.all([
            fetchFinanceTotalApi(batchId, kode),
            fetchFinanceFinishedApi(batchId, kode),
            fetchFinanceUnfinishedApi(batchId, kode),
            fetchFinanceFinishedGroupedApi(batchId, kode),
          ]);

        setData({
          total: Number(totalRes.data?.total) || 0,
          finished: Number(finishedRes.data?.total) || 0,
          unfinished: Number(unfinishedRes.data?.total) || 0,
        });

        setFinishedGrouped(finishedGroupedRes.data?.grouped || []);
      } catch (err) {
        console.error("Gagal ambil data finance:", err);
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    if (batchId) fetchFinanceData();
  }, [batchId]);

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-white">
      <h2 className="text-2xl font-bold text-[#3e146d] mb-6">{batchId}</h2>

      {/* Summary cards */}
      <div className="flex flex-col gap-6 w-full max-w-2xl">
        <div className="card p-6 rounded-3xl shadow-lg hover:shadow-xl transition text-center bg-white w-full max-w-2xl mx-auto">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Selesai</h4>
          <p className="text-[#3e146d] font-bold text-xl">
            Rp {data.finished.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="card p-6 rounded-3xl shadow-lg hover:shadow-xl transition text-center bg-white w-full max-w-2xl mx-auto">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Tertahan</h4>
          <p className="text-[#3e146d] font-bold text-xl">
            Rp {data.unfinished.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="card p-6 rounded-3xl shadow-lg hover:shadow-xl transition text-center bg-white w-full max-w-2xl mx-auto">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Total Keseluruhan</h4>
          <p className="text-[#3e146d] font-bold text-xl">
            Rp {data.total.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Grouped payment method cards */}
      {finishedGrouped.length > 0 && (
        <div className="mt-8 w-full max-w-2xl flex flex-col gap-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Total per Payment Method</h4>
          {PAYMENT_METHODS.map((method) => {
            const item = finishedGrouped.find((d) => d.payment_method === method);
            return (
              <div
                key={method}
                className="card p-6 rounded-3xl shadow-lg hover:shadow-xl transition text-center bg-white w-full max-w-2xl mx-auto"
              >
                <h5 className="text-lg font-semibold text-gray-700 mb-2">{method}</h5>
                <p className="text-[#3e146d] font-bold text-xl">
                  Rp {Number(item?.total_harga || 0).toLocaleString("id-ID")}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AimasKapalFinancialStatements;