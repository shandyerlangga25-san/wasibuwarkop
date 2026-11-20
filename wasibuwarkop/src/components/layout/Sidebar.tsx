import React from 'react';
import {
  ClipboardList,
  RotateCcw,
  Utensils,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { useWasibu, NavTab } from '../../context/WasibuContext';
import { WasibuLogo } from '../common/Logo';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, openLogoutConfirm, currentUser } = useWasibu();

  const menuItems: { id: NavTab; label: string; icon: React.ReactNode; roles?: string[] }[] = [
    {
      id: 'pesanan',
      label: 'Pesanan Aktif',
      icon: <ClipboardList className="w-5 h-5 flex-shrink-0" />,
    },
    {
      id: 'riwayat',
      label: 'Riwayat Pesanan',
      icon: <RotateCcw className="w-5 h-5 flex-shrink-0" />,
    },
    {
      id: 'menu',
      label: 'Menu & Produk',
      icon: <Utensils className="w-5 h-5 flex-shrink-0" />,
    },
    {
      id: 'stok',
      label: 'Stok Barang',
      icon: <Package className="w-5 h-5 flex-shrink-0" />,
    },
    {
      id: 'pelanggan',
      label: 'Pelanggan',
      icon: <Users className="w-5 h-5 flex-shrink-0" />,
    },
    {
      id: 'laporan',
      label: 'Laporan',
      icon: <BarChart3 className="w-5 h-5 flex-shrink-0" />,
      roles: ['Admin', 'Owner'],
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan',
      icon: <Settings className="w-5 h-5 flex-shrink-0" />,
      roles: ['Admin', 'Owner'],
    },
  ];

  return (
    <aside className="w-64 bg-[#18181D] border-r border-[#24242B] flex flex-col justify-between flex-shrink-0 select-none z-20">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-6 flex items-center border-b border-[#24242B]">
          <WasibuLogo variant="dark" size="md" />
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1.5 mt-2">
          {menuItems.map((item) => {
            // Check role permissions if restricted
            if (item.roles && currentUser && !item.roles.includes(currentUser.role)) {
              return null;
            }

            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#FF5722] text-white shadow-md shadow-orange-950/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#23232A]'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Logout */}
      <div className="p-4 border-t border-[#24242B]">
        <button
          type="button"
          onClick={openLogoutConfirm}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
