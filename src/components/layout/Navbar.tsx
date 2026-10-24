
import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  FileCode,
  CheckCircle,
} from 'lucide-react';
import { useWasibu } from '../../context/WasibuContext';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    users,
    login,
    searchQuery,
    setSearchQuery,
    openSourceCodeModal,
    notificationsCount,
    openLogoutConfirm,
  } = useWasibu();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [jakartaTime, setJakartaTime] = useState('');

  // Waktu realtime Asia/Jakarta
  useEffect(() => {
    const updateJakartaTime = () => {
      const now = new Date();

      const date = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(now);

      const time = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);

      setJakartaTime(`${date} • ${time} WIB`);
    };

    updateJakartaTime();

    const interval = window.setInterval(updateJakartaTime, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#18181D] border-b border-[#24242B] px-6 flex items-center justify-between text-white select-none z-10">

      {/* Global Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor pesanan, nomor meja, atau menu..."
            className="w-full bg-[#24242C] text-sm text-gray-200 placeholder-gray-400 pl-10 pr-4 py-2 rounded-xl border border-transparent focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-5 ml-4">

        {/* Realtime Date & Time Asia/Jakarta */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-gray-300 font-medium whitespace-nowrap">
          <span>{jakartaTime || 'Memuat waktu...'}</span>
        </div>

       
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-300 hover:text-white hover:bg-[#24242C] rounded-xl transition"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5" />

            {notificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1E1E24] border border-[#2D2D36] rounded-2xl shadow-2xl p-4 text-xs z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                <span className="font-bold text-gray-200">
                  Notifikasi Pesanan
                </span>
                <span className="text-[10px] text-orange-400 font-medium">
                  3 Baru
                </span>
              </div>

              <div className="space-y-2 mt-3">
                <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-gray-300">
                  <div className="font-bold text-orange-400">
                    Pesanan Baru Masuk!
                  </div>
                  <div className="text-[11px] text-gray-300 mt-0.5">
                    Meja 05 memesan 3 item (Total Rp55.000)
                  </div>
                  <div className="text-[9px] text-gray-500 mt-1">
                    2 menit yang lalu
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-gray-800/50 text-gray-300">
                  <div className="font-semibold text-gray-200">
                    Stok Menipis
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Bawang Merah & Minyak Goreng mendekati batas minimum
                  </div>
                  <div className="text-[9px] text-gray-500 mt-1">
                    15 menit yang lalu
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#24242C] transition"
          >
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
              }
              alt={currentUser?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/40"
            />

            <span className="text-xs font-semibold text-gray-200">
              {currentUser?.role || 'Admin'}
            </span>

            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* User Menu & Role Switcher */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#1E1E24] border border-[#2D2D36] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="p-3 border-b border-gray-800">
                <p className="font-bold text-sm text-white">
                  {currentUser?.name}
                </p>

                <p className="text-xs text-gray-400">
                  @{currentUser?.username}
                </p>

                <div className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 text-[10px] font-bold">
                  Role: {currentUser?.role}
                </div>
              </div>

              {/* Role Switcher */}
              <div className="py-2 border-b border-gray-800">
                <span className="text-[10px] uppercase font-bold text-gray-500 px-3">
                  Ganti Akun Pengujian:
                </span>

                <div className="mt-1 space-y-1">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        login(u.username, 'anypassword');
                        setShowProfileMenu(false);
                      }}
                      className={`w-full px-3 py-1.5 rounded-lg text-left text-xs flex items-center justify-between transition ${
                        currentUser?.id === u.id
                          ? 'bg-[#FF5722] text-white font-semibold'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <span>
                        {u.name} ({u.role})
                      </span>

                      {currentUser?.id === u.id && (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    openLogoutConfirm();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition"
                >
                  Keluar dari Sistem
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
