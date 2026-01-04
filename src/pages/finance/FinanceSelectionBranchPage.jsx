import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const FinanceSelectionBranchPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ambil cabang user
  const userBranch = user?.cabang?.toLowerCase();

  const handleClick = (branch) => {
    navigate(`/finance/${branch.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen p-6 bg-white flex flex-col items-center">
      <h2 className="text-2xl font-bold text-[#3e146d] mb-6">Pilih Cabang</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Card Remu */}
        {(userBranch === "main" || userBranch === "remu") && (
          <div
            onClick={() => handleClick("Remu")}
            className="cursor-pointer p-6 rounded-3xl shadow-lg hover:shadow-xl transition bg-white flex flex-col items-center text-center gap-2"
          >
            <h2 className="text-xl font-semibold text-[#3e146d]">Remu</h2>
            <p className="text-gray-600">Kelola laporan Remu</p>
          </div>
        )}

        {/* Card Aimas */}
        {(userBranch === "main" || userBranch === "aimas") && (
          <div
            onClick={() => handleClick("Aimas")}
            className="cursor-pointer p-6 rounded-3xl shadow-lg hover:shadow-xl transition bg-white flex flex-col items-center text-center gap-2"
          >
            <h2 className="text-xl font-semibold text-[#3e146d]">Aimas</h2>
            <p className="text-gray-600">Kelola laporan Aimas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceSelectionBranchPage;