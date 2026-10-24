import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Package,
  Calendar,
  Layers,
  TrendingDown,
  TrendingUp,
  X,
  History,
  Sliders,
} from 'lucide-react';
import { useWasibu } from '../../context/WasibuContext';
import { StockCategory, StockItem, StockStatus, StockUnit } from '../../types/wasibu';

export const StokBarangView: React.FC = () => {
  const { stockItems, addStock, adjustStock, searchQuery } = useWasibu();

  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('Semua');
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(() => {
    return stockItems.length > 0 ? stockItems[0] : null;
  });

  // Modal Tambah Stok (Slide 17)
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [addAmount, setAddAmount] = useState<number>(5);
  const [addNote, setAddNote] = useState('belanja stok pagi');

  // Modal Penyesuaian Stok
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState<number>(25);
  const [adjustNote, setAdjustNote] = useState('Selisih perhitungan stok fisik');

  // Stats calculation matching Slide 16
  const stats = useMemo(() => {
    const total = stockItems.length;
    const aman = stockItems.filter((s) => s.status === 'Aman').length;
    const menipis = stockItems.filter((s) => s.status === 'Menipis').length;
    const habis = stockItems.filter((s) => s.status === 'Habis').length;
    return { total, aman, menipis, habis };
  }, [stockItems]);

  // Filtered list
  const filteredStockItems = useMemo(() => {
    return stockItems.filter((item) => {
      if (selectedCategoryTab !== 'Semua' && item.category !== selectedCategoryTab) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchName && !matchCat) return false;
      }
      return true;
    });
  }, [stockItems, selectedCategoryTab, searchQuery]);

  // Calculation for Slide 17 preview: Stok setelah ditambah
  const calculatedNewStock = useMemo(() => {
    if (!selectedStock) return 0;
    return selectedStock.currentStock + (Number(addAmount) || 0);
  }, [selectedStock, addAmount]);

  const handleOpenAddModal = (item: StockItem) => {
    setSelectedStock(item);
    setAddAmount(5);
    setAddNote('');
    setIsAddStockModalOpen(true);
  };

  const handleOpenAdjustModal = (item: StockItem) => {
    setSelectedStock(item);
    setAdjustAmount(item.currentStock);
    setAdjustNote('Penyesuaian stok opname');
    setIsAdjustModalOpen(true);
  };

  const handleSaveAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock || addAmount <= 0) return;
    addStock(selectedStock.id, Number(addAmount), addNote);
    setSelectedStock((prev) =>
      prev
        ? {
            ...prev,
            currentStock: prev.currentStock + Number(addAmount),
            status:
              prev.currentStock + Number(addAmount) <= prev.minStock ? 'Menipis' : 'Aman',
          }
        : null
    );
    setIsAddStockModalOpen(false);
  };

  const handleSaveAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;
    adjustStock(selectedStock.id, Number(adjustAmount), adjustNote);
    setSelectedStock((prev) =>
      prev
        ? {
            ...prev,
            currentStock: Number(adjustAmount),
            status:
              Number(adjustAmount) <= 0
                ? 'Habis'
                : Number(adjustAmount) <= prev.minStock
                ? 'Menipis'
                : 'Aman',
          }
        : null
    );
    setIsAdjustModalOpen(false);
  };

  return (
    <div className="p-6 bg-[#F8F9FA] min-h-[calc(100vh-4rem)] flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Stok Barang</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Kelola persediaan stok bahan untuk operasional Warung Si Bungsu.
        </p>
      </div>

      {/* 4 Stat Cards matching Slide 16 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500">Total Barang</span>
            <div className="text-2xl font-black text-gray-900 mt-1">{stats.total}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5722] flex items-center justify-center font-bold">
            📦
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600">Stok Aman</span>
            <div className="text-2xl font-black text-gray-900 mt-1">{stats.aman}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ✓
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600">Stok Menipis</span>
            <div className="text-2xl font-black text-gray-900 mt-1">{stats.menipis}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            ⚠️
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-500">Stok Habis</span>
            <div className="text-2xl font-black text-gray-900 mt-1">{stats.habis}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            ✕
          </div>
        </div>
      </div>

      {/* Main Grid: Left Table & Right Detail Panel matching Slide 16 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Daftar Stok Barang (7 cols) */}
        <div className="xl:col-span-7 bg-white rounded-2xl shadow-xs border border-gray-100 p-5 flex flex-col">
          {/* Category Tabs matching Slide 16 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['Semua', 'Bahan Pokok', 'Protein', 'Bumbu & Sayur', 'Minuman', 'Kemasan'].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategoryTab(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                    selectedCategoryTab === cat
                      ? 'bg-[#FF5722] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Table matching Slide 16 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-semibold">
                  <th className="py-2.5 px-2">Nama Barang</th>
                  <th className="py-2.5 px-2">Kategori</th>
                  <th className="py-2.5 px-2">Satuan</th>
                  <th className="py-2.5 px-2">Stok Saat Ini</th>
                  <th className="py-2.5 px-2">Minimum Stok</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2">Update Terakhir</th>
                  <th className="py-2.5 px-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStockItems.map((item) => {
                  const isSelected = selectedStock?.id === item.id;
                  const statusClass =
                    item.status === 'Aman'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : item.status === 'Menipis'
                      ? 'bg-amber-50 text-amber-600 border-amber-200'
                      : 'bg-rose-50 text-rose-600 border-rose-200';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedStock(item)}
                      className={`hover:bg-orange-50/40 cursor-pointer transition ${
                        isSelected ? 'bg-orange-50/70 font-medium' : ''
                      }`}
                    >
                      <td className="py-3 px-2 font-semibold text-gray-900">{item.name}</td>
                      <td className="py-3 px-2 text-gray-600">{item.category}</td>
                      <td className="py-3 px-2 text-gray-500 font-mono">{item.unit}</td>
                      <td className="py-3 px-2 font-bold text-gray-900">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="py-3 px-2 text-gray-500">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${statusClass}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-400 text-[11px] whitespace-nowrap">
                        {item.lastUpdated}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStock(item);
                            }}
                            className="p-1 text-gray-400 hover:text-orange-600"
                            title="Detail"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAddModal(item);
                            }}
                            className="p-1 text-orange-500 hover:text-orange-700"
                            title="Tambah Stok"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination bar matching Slide 16 */}
          <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 text-xs text-gray-500">
            <span>Menampilkan 1-17 dari 17 barang</span>
            <div className="flex items-center gap-1.5">
              <button className="px-2.5 py-1 rounded bg-[#FF5722] text-white font-bold">1</button>
            </div>
            <span>10 / halaman</span>
          </div>
        </div>

        {/* Right Column: Detail Stok Panel matching Slide 16 (5 cols) */}
        <div className="xl:col-span-5 bg-white rounded-2xl shadow-xs border border-gray-100 p-5 flex flex-col">
          {selectedStock ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">{selectedStock.name}</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                    selectedStock.status === 'Aman'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : selectedStock.status === 'Menipis'
                      ? 'bg-amber-50 text-amber-600 border-amber-200'
                      : 'bg-rose-50 text-rose-600 border-rose-200'
                  }`}
                >
                  {selectedStock.status}
                </span>
              </div>

              {/* Detail fields matching Slide 16 */}
              <div className="space-y-2.5 my-4 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Kategori</span>
                  <span className="font-semibold text-gray-800">{selectedStock.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Satuan</span>
                  <span className="font-semibold text-gray-800">{selectedStock.unit}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Stok Saat Ini</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {selectedStock.currentStock} {selectedStock.unit}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Minimum Stok</span>
                  <span className="font-semibold text-gray-700">
                    {selectedStock.minStock} {selectedStock.unit}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Status</span>
                  <span className="font-bold text-emerald-600">{selectedStock.status}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Lokasi Simpan</span>
                  <span className="font-semibold text-gray-800">{selectedStock.location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Update Terakhir</span>
                  <span className="text-gray-700">{selectedStock.lastUpdated}</span>
                </div>
                <div className="pt-1 text-gray-500">
                  <span className="text-gray-400 block text-[10px]">Catatan</span>
                  <p className="mt-0.5 text-gray-700 italic">{selectedStock.notes}</p>
                </div>
              </div>

              {/* Riwayat Stok Timeline matching Slide 16 */}
              <div className="mt-2 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-900">Riwayat Stok</h4>
                  <span className="text-[10px] text-gray-400">Lihat Semua</span>
                </div>

                <div className="space-y-2">
                  {selectedStock.movements && selectedStock.movements.length > 0 ? (
                    selectedStock.movements.map((m) => (
                      <div
                        key={m.id}
                        className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/60 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              m.type === 'Barang Masuk'
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-rose-100 text-rose-600'
                            }`}
                          >
                            {m.type === 'Barang Masuk' ? '+' : '-'}
                          </span>
                          <div>
                            <span className="font-semibold text-gray-800 block text-[11px]">
                              {m.type}
                            </span>
                            <span className="text-[10px] text-gray-400">{m.note}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`font-bold text-[11px] ${
                              m.amount > 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {m.amount > 0 ? `+${m.amount}` : m.amount} {m.unit}
                          </span>
                          <span className="text-[9px] text-gray-400 block">{m.date}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">Belum ada catatan mutasi stok.</p>
                  )}
                </div>
              </div>

              {/* Bottom Actions matching Slide 16 */}
              <div className="flex items-center gap-3 pt-5 mt-auto">
                <button
                  type="button"
                  onClick={() => handleOpenAdjustModal(selectedStock)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold transition"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Penyesuaian Stok</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAddModal(selectedStock)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Tambah Stok</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-gray-400">Pilih stok dari tabel.</div>
          )}
        </div>
      </div>

      {/* ================= MODAL: Tambah Stok (Slide 17) ================= */}
      {isAddStockModalOpen && selectedStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 lg:p-8 border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Tambah Stok</h3>
              <button
                type="button"
                onClick={() => setIsAddStockModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddStock} className="mt-4 space-y-4 text-xs">
              {/* Nama Barang */}
              <div>
                <label className="block text-gray-500 mb-1">Nama Barang</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900">
                  {selectedStock.name}
                </div>
              </div>

              {/* Stok Saat Ini */}
              <div>
                <label className="block text-gray-500 mb-1">Stok Saat Ini</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700">
                  {selectedStock.currentStock} {selectedStock.unit}
                </div>
              </div>

              {/* Tambah Stok Input matching Slide 17 */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tambah Stok</label>
                <input
                  type="number"
                  min={1}
                  value={addAmount}
                  onChange={(e) => setAddAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Satuan */}
              <div>
                <label className="block text-gray-500 mb-1">Satuan</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-700">
                  {selectedStock.unit}
                </div>
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-gray-500 mb-1">Tanggal</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 flex items-center justify-between">
                  <span>21 Okt 2026</span>
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Catatan (opsional) */}
              <div>
                <label className="block text-gray-500 mb-1">Catatan (opsional)</label>
                <input
                  type="text"
                  value={addNote}
                  onChange={(e) => setAddNote(e.target.value)}
                  placeholder="Contoh: belanja stok pagi"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              {/* Live Preview Box matching Slide 17 */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 block">Stok setelah ditambah:</span>
                  <span className="text-base font-black text-emerald-700">
                    {calculatedNewStock} {selectedStock.unit}
                  </span>
                </div>
              </div>

              {/* Action buttons matching Slide 17 */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddStockModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-bold shadow-sm transition"
                >
                  Simpan Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: Penyesuaian Stok ================= */}
      {isAdjustModalOpen && selectedStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 lg:p-8 border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Penyesuaian Stok Fisik</h3>
              <button
                type="button"
                onClick={() => setIsAdjustModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdjustStock} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-gray-500 mb-1">Nama Barang</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900">
                  {selectedStock.name}
                </div>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Stok Tercatat Sistem</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700">
                  {selectedStock.currentStock} {selectedStock.unit}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Stok Fisik Sebenarnya
                </label>
                <input
                  type="number"
                  min={0}
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Alasan Penyesuaian</label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="Contoh: Selisih stok opname akhir pekan"
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-800"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-bold shadow-sm transition"
                >
                  Simpan Penyesuaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
