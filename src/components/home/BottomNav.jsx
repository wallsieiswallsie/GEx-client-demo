import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, PlayCircle, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'beranda', icon: Home, label: 'BERANDA', path: '/home' },
  { id: 'paketku', icon: Package, label: 'PAKETKU', path: '/paketku' },
  { id: 'konten', icon: PlayCircle, label: 'KONTEN', path: '/konten' },
  { id: 'profil', icon: User, label: 'PROFIL', path: '/profil' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
      <div className="grid grid-cols-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-3 gap-1
                ${isActive ? 'text-violet-600' : 'text-gray-400'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}