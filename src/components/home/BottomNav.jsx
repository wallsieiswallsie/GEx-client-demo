import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'beranda',  icon: '🏠', label: 'BERANDA',  path: '/home' },
  { id: 'paketku',  icon: '📦', label: 'PAKETKU',  path: '/paketku' },
  { id: 'konten',   icon: '▶️',  label: 'KONTEN',   path: '/konten' },
  { id: 'profil',   icon: '👤', label: 'PROFIL',   path: '/profil' },
];

/**
 * BottomNav — bottom navigation bar tetap (fixed) sesuai screen.jpg.
 * 4 tab: BERANDA | PAKETKU | KONTEN | PROFIL
 */
export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50"
      style={{ maxWidth: '430px', margin: '0 auto' }}
      aria-label="Navigasi utama"
    >
      <div className="grid grid-cols-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-3 gap-0.5 transition-colors duration-150
                ${isActive
                  ? 'text-violet-600'
                  : 'text-gray-400 hover:text-gray-600'
                }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span
                className={`text-[9px] font-bold tracking-widest mt-0.5
                  ${isActive ? 'text-violet-600' : 'text-gray-400'}`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-violet-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
