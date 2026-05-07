import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, PlayCircle, User, Database } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

const NAV_ITEMS = [
  { id: 'beranda', icon: Home, label: 'BERANDA', path: '/home', roles: ['all'] },
  { id: 'database', icon: Database, label: 'DATABASE', path: '/input', roles: ['general_manager', 'branch_staff'] },
  { id: 'paketku', icon: Package, label: 'PAKETKU', path: '/paketku', roles: ['customer'] },
  { id: 'konten', icon: PlayCircle, label: 'KONTEN', path: '/konten', roles: ['customer'] },
  { id: 'profil', icon: User, label: 'PROFIL', path: '/profil', roles: ['all'] },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { role } = useAuth();

  // filter menu berdasarkan role
  const filteredNav = NAV_ITEMS.filter((item) => {
    if (item.roles.includes('all')) return true;
    return item.roles.includes(role);
  });

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
      <div className="grid grid-cols-4">
        {filteredNav.map((item) => {
          const isActive =
            pathname === item.path || pathname.startsWith(item.path + '/');
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
