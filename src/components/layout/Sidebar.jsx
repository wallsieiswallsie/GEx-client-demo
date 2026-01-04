import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiX } from "react-icons/hi";

const MENU_ITEMS = [
  { path: "/lacak_paket", label: "Lacak Paket", roles: ["Customer", "Manager Main Warehouse", "Manager Destination Warehouse", "Staff Destination Warehouse", "Courier"] },
  { path: "/manage-customer-services", label: "Manage Service", roles: ["Manager Main Warehouse"] },
  { path: "/register", label: "Manage User", roles: ["Manager Main Warehouse"] },
  { path: "/packages", label: "Database Paket", roles: ["Manager Destination Warehouse", "Manager Main Warehouse", "Staff Destination Warehouse"] },
  { path: "/batches", label: "Batches Pengiriman", roles: ["Manager Destination Warehouse", "Manager Main Warehouse", "Staff Main Warehouse", "Staff Destination Warehouse"] },
  { path: "#", label: "Database Customer", roles: ["Manager Destination Warehouse"] },
  { path: "/invoices", label: "Manage Invoice", roles: ["Manager Destination Warehouse", "Manager Main Warehouse", "Staff Destination Warehouse"] },
  { path: "/selection_pengantaran", label: "Request Pengantaran", roles: ["Manager Destination Warehouse", "Manager Main Warehouse", "Staff Destination Warehouse", "Courier"] },
  { path: "/finance", label: "Keuangan", roles: ["Manager Destination Warehouse", "Manager Main Warehouse"] },
  { path: "/input", label: "Input Data Paket", roles: ["Manager Main Warehouse", "Staff Main Warehouse", "Manager Destination Warehouse", "Staff Destination Warehouse"] },
  { path: "/packages/confirm-select", label: "Konfirmasi Paket Bermasalah", roles: ["Manager Main Warehouse", "Staff Main Warehouse", "Manager Destination Warehouse", "Staff Destination Warehouse"] },
];

export default function Sidebar({ open, setOpen }) {
  const { user } = useAuth();
  const location = useLocation();

  const visibleMenu = useMemo(() => {
    if (!user?.role) return [];
    return MENU_ITEMS.filter((item) => item.roles.includes(user.role));
  }, [user?.role]);

  const accent = "#3e146d";

  return (
    <>
      {/* Overlay hanya tampil di mobile */}
      <div
        className={`
          fixed inset-0 bg-black/40 z-20 md:hidden
          transition-opacity duration-300
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white z-30
          w-64 transition-transform duration-300 overflow-auto

          ${open ? "translate-x-0" : "-translate-x-full"}

          /* Desktop: tetap terbuka */
          md:translate-x-0 md:shadow-lg md:border-r
        `}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Left accent stripe (desktop only) */}
        <div
          className="hidden md:block absolute inset-y-0 left-0 w-1"
          style={{ backgroundColor: accent }}
          aria-hidden
        />

        <div className="relative">
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
          >
            <h2 className="font-semibold text-lg text-gray-800">Menu</h2>

            {/* Tombol close hanya mobile */}
            <button
              className="md:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              <HiX size={20} />
            </button>
          </div>

          <ul className="p-4 space-y-2">
            {visibleMenu.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`
                      block px-3 py-2 rounded-lg text-sm
                      ${isActive
                        ? "text-white"
                        : "text-gray-700 hover:bg-gray-100"}
                    `}
                    style={
                      isActive
                        ? { backgroundColor: accent }
                        : undefined
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
}