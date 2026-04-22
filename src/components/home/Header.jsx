export default function Header({ initial, onLogout }) {
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
            <GexLogo size={48} />

            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-red-500 flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">{initial}</span>
                </div>

                {/* Logout (polos hitam) */}
                <button
                    id="btn-logout"
                    onClick={onLogout}
                    className="flex items-center justify-center text-black hover:opacity-60 transition"
                    aria-label="Keluar dari akun"
                    title="Logout"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
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
        </header>
    );
}