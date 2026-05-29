import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, PlayCircle, User, Database, FileText, Wallet, Ship } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { canAccessInvoice } from '../../utils/invoiceAccess';
import { canAccessFinance } from '../../utils/financeAccess';

const NAV_ITEMS = [
  { id: 'beranda', icon: Home, label: 'BERANDA', path: '/home', roles: ['all'] },
  { id: 'database', icon: Database, label: 'DATABASE', path: '/input', roles: ['general_manager', 'super_admin', 'branch_staff', 'branch_manager'] },
  { id: 'invoice', icon: FileText, label: 'INVOICE', path: '/invoice', roles: ['invoice'] },
  { id: 'keuangan', icon: Wallet, label: 'KEUANGAN', path: '/keuangan', roles: ['finance'] },
  { id: 'paketku', icon: Package, label: 'PAKETKU', path: '/paketku', roles: ['customer'] },
  { id: 'konten', icon: PlayCircle, label: 'KONTEN', path: '/konten', roles: ['customer'] },
  { id: 'profil', icon: User, label: 'PROFIL', path: '/profil', roles: ['all'] },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, role } = useAuth();

  // filter menu berdasarkan role
  const filteredNav = NAV_ITEMS.filter((item) => {
    if (item.roles.includes('all')) return true;
    if (item.roles.includes('invoice')) return canAccessInvoice(user, role);
    if (item.roles.includes('finance')) return canAccessFinance(user, role);
    return item.roles.includes(role);
  });

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-50 rounded-t-[28px] border-t border-white/80 bg-white shadow-[0_-10px_30px_rgba(17,24,39,0.08)]">
      <div
        className="grid px-2 pb-2 pt-1"
        style={{ gridTemplateColumns: `repeat(${filteredNav.length}, minmax(0, 1fr))` }}
      >
        {filteredNav.map((item) => {
          const isActive =
            pathname === item.path || pathname.startsWith(item.path + '/');
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`relative flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-2xl py-2 transition-colors
                ${isActive ? 'text-[#7B2FF7]' : 'text-gray-400 hover:text-gray-500'}`}
            >
              {isActive && (
                <span className="absolute top-0 h-1 w-7 rounded-full bg-[#7B2FF7]" aria-hidden="true" />
              )}
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.4 : 2} />
              <span className="text-[10px] font-extrabold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
