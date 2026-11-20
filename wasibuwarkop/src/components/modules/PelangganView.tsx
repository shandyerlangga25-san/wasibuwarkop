import React, { useState, useMemo } from 'react';
import { Users, Eye, Search, Phone, Calendar, ShoppingBag, X } from 'lucide-react';
import { useWasibu } from '../../context/WasibuContext';
import { Customer } from '../../types/wasibu';

export const PelangganView: React.FC = () => {
  const { customers, searchQuery } = useWasibu();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [customers, searchQuery]);

  return (
    <div className="p-6 bg-[#F8F9FA] min-h-[calc(100vh-4rem)] flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Pelanggan</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Data pelanggan tersimpan otomatis dari riwayat transaksi untuk membantu mengenal pelanggan
          Anda.
        </p>
      </div>

      {/* Top Stat Card matching Slide 18 */}
      <div className="w-full sm:w-72 p-5 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#FF5722]">Total Pelanggan</span>
          <div className="text-3xl font-black text-gray-900 mt-1">86</div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5722] flex items-center justify-center font-bold">
          <Users className="w-6 h-6 stroke-[2.2]" />
        </div>
      </div>

      {/* Main Card matching Slide 18 */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-base font-bold text-gray-900">Daftar Pelanggan</h2>

          {/* Search box matching Slide 18 */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama pelanggan..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Table matching Slide 18 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-semibold">
                <th className="py-3 px-4">Nama Pelanggan</th>
                <th className="py-3 px-4">Jumlah Pesanan</th>
                <th className="py-3 px-4">Total Belanja</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className="hover:bg-orange-50/40 cursor-pointer transition"
                >
                  <td className="py-3.5 px-4 font-semibold text-gray-900">{c.name}</td>
                  <td className="py-3.5 px-4 font-medium text-gray-600">{c.orderCount}x</td>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    Rp{c.totalSpent.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCustomer(c);
                      }}
                      className="p-1.5 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50"
                      title="Lihat Detail Profil"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination bar matching Slide 18 */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 text-xs text-gray-500">
          <span>Menampilkan 1-10 dari 86 pelanggan</span>
          <div className="flex items-center gap-1.5">
            <button className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-semibold">‹</button>
            <button className="px-2.5 py-1 rounded bg-[#FF5722] text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-semibold">2</button>
            <button className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-semibold">3</button>
            <button className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-semibold">4</button>
            <button className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-semibold">5</button>
            <button className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-semibold">›</button>
          </div>
          <span>10 / halaman</span>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Profil Pelanggan</h3>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-[#FF5722] font-black text-xl flex items-center justify-center mx-auto mb-2">
                {selectedCustomer.name.slice(0, 2).toUpperCase()}
              </div>
              <h4 className="text-lg font-bold text-gray-900">{selectedCustomer.name}</h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-200 mt-1 inline-block">
                Pelanggan Setia Warung Si Bungsu
              </span>
            </div>

            <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Frekuensi Belanja</span>
                <span className="font-bold text-gray-900">{selectedCustomer.orderCount} kali</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Akumulasi Belanja</span>
                <span className="font-black text-[#FF5722]">
                  Rp{selectedCustomer.totalSpent.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Menu Favorit</span>
                <span className="font-semibold text-gray-800">
                  {selectedCustomer.favoriteMenu || 'Ayam Geprek'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Kunjungan Terakhir</span>
                <span className="text-gray-700">{selectedCustomer.lastOrderDate}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
