import { useState } from 'react';
import { LogOut } from 'lucide-react';
import LogoutConfirmationModal from '../common/LogoutConfirmationModal';

export default function Header({ onLogout, children, variant = 'default' }) {
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

    if (variant === 'profile') {
        return (
            <header
                className="relative min-h-[240px] overflow-hidden bg-cover bg-center px-6 pt-9 text-white"
                style={{ backgroundImage: "url('/images/header_background/profil.png')" }}
            >
                <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
                <div className="relative z-10 flex items-start justify-between gap-4">
                    <div className="pt-1">
                        <p className="text-lg font-semibold leading-none text-white/95">Akun</p>
                        <h1 className="mt-3 text-4xl font-extrabold leading-none tracking-normal text-white">
                            Profil
                        </h1>
                    </div>

                    <button
                        id="btn-logout"
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white shadow-lg shadow-black/10 backdrop-blur-[10px] transition hover:bg-white/20 active:scale-95"
                        aria-label="Keluar dari akun"
                        title="Logout"
                    >
                        <LogOut className="h-7 w-7" strokeWidth={2.2} />
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

    return (
        <header className="flex items-center justify-between gap-3 px-4 pt-5 pb-3 bg-white sticky top-0 z-40 border-b border-gray-50">
            <div className="shrink-0">
                <GexLogo size={55} />
            </div>

            {children && (
                <div className="min-w-0 flex-1">
                    {children}
                </div>
            )}

            <div className="flex shrink-0 items-center gap-3">
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
