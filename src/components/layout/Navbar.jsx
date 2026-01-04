import React from "react";
import { HiMenu } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/images/logo_gex.png";

function Navbar({ user, onLogout, onToggleSidebar }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah kamu yakin ingin logout?");
    if (confirmLogout) {
      onLogout();
    }
  };

  return (
    <nav className="navbar fixed bg-white">
      {/* === KIRI === */}
      <div className="navbar-left">

        {/* ✅ Jika user login → tampilkan burger */}
        {user ? (
          <button
            className="burger-btn md:hidden"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <HiMenu size={26} />
          </button>
        ) : (
          /* ✅ Jika user belum login → tampilkan logo */
          <img src={logo} alt="Logo" className="h-8" />
        )}

        {/* ✅ Bagian kiri desktop (hanya muncul saat login) */}
        {user && (
          <div className="hidden md:flex items-center gap-2">
            <button className="back-btn" onClick={handleBack}>
              &lt;
            </button>

            {/* ❌ Logo hilang ketika login (sesuai permintaan) */}
            {/* <img src={logo} alt="Logo" className="h-8" /> */}

            <span className="text-sm text-gray-600 font-medium">
              #BahagianyaOngkirMurah
            </span>
          </div>
        )}
      </div>

      {/* === KANAN === */}
      <div className="navbar-right">
        {!user ? (
          // ✅ Jika belum login → tombol Login
          <button
            onClick={() => navigate("/login-customer")}
            className="px-4 py-2 text-[#3e146d] rounded-lg text-sm font-semibold"
          >
            Login
          </button>
        ) : (
          <>
            {/* ✅ Jika login → tampilkan data user */}
            <div className="user-info text-right">
              <p className="name text-sm font-semibold text-black">
                {user?.name?.toUpperCase()}
              </p>
              <p className="role text-xs text-gray-500">{user.role}</p>
              <p className="branch text-xs text-gray-400">
                {user?.cabang?.toUpperCase()}
              </p>
            </div>

            <button
              className="logout-icon-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <FiLogOut size={24} />
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;