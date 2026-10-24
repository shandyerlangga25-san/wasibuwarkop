import React from 'react';
import { X, LogOut } from 'lucide-react';
import { useWasibu } from '../../context/WasibuContext';

export const LogoutConfirmModal: React.FC = () => {
  const { isLogoutConfirmOpen, closeLogoutConfirm, logout } = useWasibu();

  if (!isLogoutConfirmOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 text-center">
        <button
          onClick={closeLogoutConfirm}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 bg-orange-100 text-[#FF5722] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LogOut className="w-7 h-7 stroke-[2.2]" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Keluar</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed px-2">
          Anda akan keluar dari sistem kasir Warung Si Bungsu. Pastikan seluruh perubahan sudah
          tersimpan. Apakah Anda yakin ingin keluar?
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={closeLogoutConfirm}
            className="flex-1 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 transition text-sm"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={logout}
            className="flex-1 py-3 bg-[#FF5722] hover:bg-[#E64A19] text-white font-semibold rounded-xl transition text-sm shadow-sm"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
};
