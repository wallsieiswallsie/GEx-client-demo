import { useState } from 'react';
import LogoutConfirmationModal from '../common/LogoutConfirmationModal';

export default function Header({ onLogout }) {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Inline component logo
    function GexLogo({ size = 40 }) {
        return (
            <img
                src="/images/logo_gex.png"
                alt="GEX Logo"
                style={{ height: size * 0.6 }}
                className="object-contain"
            />
        );
    }

    return (
        <header className="flex items-center justify-between px-4 pt-5 pb-3 bg-white sticky top-0 z-40 border-b border-gray-50">
            <GexLogo size={55} />

            <div className="flex items-center gap-3">
                {/* Logout */}
                <button
                    id="btn-logout"
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex items-center justify-center text-red-600 transition hover:text-red-700 hover:opacity-80"
                    aria-label="Keluar dari akun"
                    title="Logout"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </button>
            </div>

            <LogoutConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={onLogout}
            />
        </header>
    );
}
