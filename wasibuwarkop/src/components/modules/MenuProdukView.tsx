import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Eye,
  Search,
  Filter,
  Image as ImageIcon,
  CheckCircle2,
  X,
  AlertCircle,
  Ban,
  Upload,
} from 'lucide-react';
import { useWasibu } from '../../context/WasibuContext';
import { MenuCategory, MenuItem, MenuStatus } from '../../types/wasibu';
import { ayamGeprekImg } from '../../data/initialData';

export const MenuProdukView: React.FC = () => {
  const { menuItems, addMenuItem, updateMenuItem, toggleMenuStatus, searchQuery } = useWasibu();

  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('Semua');
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(() => {
    return menuItems.length > 0 ? menuItems[0] : null;
  });

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states for Add/Edit
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<MenuCategory>('Makanan');
  const [formPrice, setFormPrice] = useState<number>(20000);
  const [formStatus, setFormStatus] = useState<MenuStatus>('Tersedia');
  const [formCode, setFormCode] = useState('MN001');
  const [formPrepTime, setFormPrepTime] = useState('10-15 menit');
  const [formIngredients, setFormIngredients] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState(ayamGeprekImg);

  // Stats calculation matching Slide 13
  const stats = useMemo(() => {
    const total = 42;
    const makanan = 15;
    const minuman = 14;
    const paketCemilan = 13;
    return { total, makanan, minuman, paketCemilan };
  }, []);

  // Filtered menu
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (selectedCategoryTab !== 'Semua') {
        if (selectedCategoryTab === 'Paket Hemat') {
          if (item.category !== 'Paket Hemat' && item.category !== 'Cemilan') return false;
        } else if (item.category !== selectedCategoryTab) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchCode) return false;
      }
      return true;
    });
  }, [menuItems, selectedCategoryTab, searchQuery]);

  const handleOpenAddModal = () => {
    setFormName('');
    setFormCategory('Makanan');
    setFormPrice(15000);
    setFormStatus('Tersedia');
    setFormCode(`MN0${menuItems.length + 1}`);
    setFormPrepTime('10-15 menit');
    setFormIngredients('');
    setFormDescription('');
    setFormImage(ayamGeprekImg);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setSelectedMenu(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormPrice(item.price);
    setFormStatus(item.status);
    setFormCode(item.code);
    setFormPrepTime(item.preparationTime);
    setFormIngredients(item.ingredients);
    setFormDescription(item.description);
    setFormImage(item.image);
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) return;
    addMenuItem({
      code: formCode || `MN0${Date.now().toString().slice(-3)}`,
      name: formName,
      category: formCategory,
      price: Number(formPrice),
      status: formStatus,
      image: formImage,
      preparationTime: formPrepTime || '10-15 menit',
      ingredients: formIngredients,
      description: formDescription,
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenu) return;
    const updated: MenuItem = {
      ...selectedMenu,
      name: formName,
      category: formCategory,
      price: Number(formPrice),
      status: formStatus,
      code: formCode,
      preparationTime: formPrepTime,
      ingredients: formIngredients,
      description: formDescription,
      image: formImage,
    };
    updateMenuItem(updated);
    setSelectedMenu(updated);
    setIsEditModalOpen(false);
  };

  return (
    <div className="p-6 bg-[#F8F9FA] min-h-[calc(100vh-4rem)] flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Menu &amp; Produk</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola daftar makanan, minuman, cemilan, dan paket hemat Warung Si Bungsu.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Menu</span>
        </button>
      </div>

      {/* 4 Stat Cards matching Slide 13 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500">Total Menu</span>
            <div className="text-2xl font-black text-gray-900 mt-1">{stats.total}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5722] flex items-center justify-center font-bold">
            🍴
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-500">Makanan</span>
            <div className="text-2xl font-black text-gray-900 mt-1">{stats.makanan}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            🍲
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-sky-600">Minuman</span>
            <div className="text-2xl font-black text-gray-900 mt-1">{stats.minuman}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            🥤
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600">Paket &amp; Cemilan</span>
            <div className="text-2xl font-black text-gray-900 mt-1">{stats.paketCemilan}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            🍟
          </div>
        </div>
      </div>

      {/* Main Grid: Left Table & Right Detail Panel matching Slide 13 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Daftar Menu Table (7 cols) */}
        <div className="xl:col-span-7 bg-white rounded-2xl shadow-xs border border-gray-100 p-5 flex flex-col">
          {/* Category Tabs matching Slide 13 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['Semua', 'Makanan', 'Minuman', 'Cemilan', 'Paket Hemat'].map((cat) => (
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
            ))}
          </div>

          {/* Table matching Slide 13 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-semibold">
                  <th className="py-2.5 px-2">Foto</th>
                  <th className="py-2.5 px-2">Nama Menu</th>
                  <th className="py-2.5 px-2">Kategori</th>
                  <th className="py-2.5 px-2">Harga</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMenuItems.map((item) => {
                  const isSelected = selectedMenu?.id === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedMenu(item)}
                      className={`hover:bg-orange-50/40 cursor-pointer transition ${
                        isSelected ? 'bg-orange-50/70 font-medium' : ''
                      }`}
                    >
                      <td className="py-2.5 px-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                        />
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="font-semibold text-gray-900 block">{item.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{item.code}</span>
                      </td>
                      <td className="py-2.5 px-2 text-gray-600">{item.category}</td>
                      <td className="py-2.5 px-2 font-bold text-gray-800">
                        Rp{item.price.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                            item.status === 'Tersedia'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              : 'bg-rose-50 text-rose-600 border-rose-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMenu(item);
                            }}
                            className="p-1 text-gray-400 hover:text-orange-600"
                            title="Lihat"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(item);
                            }}
                            className="p-1 text-orange-500 hover:text-orange-700"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination bar matching Slide 13 */}
          <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 text-xs text-gray-500">
            <span>Menampilkan 1-10 dari {stats.total} menu</span>
            <div className="flex items-center gap-1.5">
              <button className="px-2.5 py-1 rounded bg-[#FF5722] text-white font-bold">1</button>
              <button className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-semibold">2</button>
              <button className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-semibold">3</button>
              <button className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-semibold">4</button>
              <button className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-semibold">5</button>
              <button className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-semibold">›</button>
            </div>
            <span>10 / halaman</span>
          </div>
        </div>

        {/* Right Column: Detail Menu Panel matching Slide 13 (5 cols) */}
        <div className="xl:col-span-5 bg-white rounded-2xl shadow-xs border border-gray-100 p-5 flex flex-col">
          {selectedMenu ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">Detail Menu</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                    selectedMenu.status === 'Tersedia'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : 'bg-rose-50 text-rose-600 border-rose-200'
                  }`}
                >
                  {selectedMenu.status}
                </span>
              </div>

              {/* Photo Showcase */}
              <div className="my-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100 max-h-56">
                <img
                  src={selectedMenu.image}
                  alt={selectedMenu.name}
                  className="w-full h-52 object-cover"
                />
              </div>

              <h2 className="text-xl font-black text-gray-900">{selectedMenu.name}</h2>

              {/* Meta items matching Slide 13 */}
              <div className="space-y-3 mt-4 text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-5 text-gray-400">🍴</span>
                  <div className="flex-1">
                    <span className="text-gray-400 block text-[10px]">Kategori</span>
                    <span className="font-semibold text-gray-800">{selectedMenu.category}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 text-gray-400">🏷️</span>
                  <div className="flex-1">
                    <span className="text-gray-400 block text-[10px]">Harga</span>
                    <span className="font-bold text-gray-900 text-sm">
                      Rp{selectedMenu.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 text-gray-400">📋</span>
                  <div className="flex-1">
                    <span className="text-gray-400 block text-[10px]">Komposisi</span>
                    <span className="text-gray-700 leading-relaxed font-medium">
                      {selectedMenu.ingredients || '-'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-5 text-gray-400">ℹ️</span>
                  <div className="flex-1">
                    <span className="text-gray-400 block text-[10px]">Deskripsi</span>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedMenu.description || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons matching Slide 13 */}
              <div className="space-y-2 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(selectedMenu)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold rounded-xl text-xs shadow-xs transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Menu</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleMenuStatus(selectedMenu.id)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-gray-50 border border-red-200 text-red-600 font-semibold rounded-xl text-xs transition"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>
                    {selectedMenu.status === 'Tersedia' ? 'Nonaktifkan Menu' : 'Aktifkan Kembali Menu'}
                  </span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-gray-400">Pilih menu dari tabel.</div>
          )}
        </div>
      </div>

      {/* ================= MODAL: Tambah Menu (Slide 14) ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tambah Menu</h3>
                <p className="text-xs text-gray-500">
                  Tambahkan produk baru ke daftar menu Warung Si Bungsu.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="mt-4 space-y-4 text-xs">
              {/* Photo upload area */}
              <div className="flex items-center gap-4 p-4 border border-dashed border-gray-300 rounded-2xl bg-gray-50/60">
                <img
                  src={formImage}
                  alt="preview"
                  className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                />
                <div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-50">
                    <Upload className="w-3.5 h-3.5 text-orange-500" />
                    <span>Unggah Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormImage(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                  <p className="text-[10px] text-gray-400 mt-1">Format JPG, PNG (maks. 2MB)</p>
                </div>
              </div>

              {/* Row: Nama Menu & Kategori */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Nama Menu *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Masukkan nama menu"
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Kategori *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as MenuCategory)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Cemilan">Cemilan</option>
                    <option value="Paket Hemat">Paket Hemat</option>
                  </select>
                </div>
              </div>

              {/* Row: Harga & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Harga *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 font-semibold">Rp</span>
                    <input
                      type="number"
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      placeholder="Masukkan harga menu"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Status Menu *</label>
                  <div className="flex items-center gap-4 pt-1.5">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={formStatus === 'Tersedia'}
                        onChange={() => setFormStatus('Tersedia')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-emerald-600">Tersedia</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={formStatus === 'Habis'}
                        onChange={() => setFormStatus('Habis')}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span className="font-semibold text-rose-600">Habis</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Row: Kode Menu & Estimasi Sajian */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Kode Menu (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="Contoh: MN001"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Estimasi Sajian (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(e.target.value)}
                    placeholder="Contoh: 10-15 menit"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Komposisi */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Komposisi *</label>
                <input
                  type="text"
                  value={formIngredients}
                  onChange={(e) => setFormIngredients(e.target.value)}
                  placeholder="Masukkan komposisi bahan (pisahkan dengan koma)"
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-gray-700">Deskripsi *</label>
                  <span className="text-[10px] text-gray-400">
                    {formDescription.length}/300 karakter
                  </span>
                </div>
                <textarea
                  value={formDescription}
                  maxLength={300}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Tulis deskripsi menu..."
                  rows={3}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs resize-none"
                />
              </div>

              {/* Actions matching Slide 14 */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-bold shadow-sm transition"
                >
                  💾 Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: Edit Menu (Slide 15) ================= */}
      {isEditModalOpen && selectedMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Edit Menu</h3>
                <p className="text-xs text-gray-500">
                  Perbarui data produk yang sudah ada di Warung Si Bungsu.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4 text-xs">
              {/* Photo change area */}
              <div className="flex items-center gap-4 p-4 border border-dashed border-gray-300 rounded-2xl bg-gray-50/60">
                <img
                  src={formImage}
                  alt="preview"
                  className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                />
                <div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-50">
                    <Upload className="w-3.5 h-3.5 text-orange-500" />
                    <span>Ganti Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormImage(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                  <p className="text-[10px] text-gray-400 mt-1">Format JPG, PNG (maks. 2MB)</p>
                </div>
              </div>

              {/* Row: Nama & Kategori */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Nama Menu *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Kategori *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as MenuCategory)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Cemilan">Cemilan</option>
                    <option value="Paket Hemat">Paket Hemat</option>
                  </select>
                </div>
              </div>

              {/* Row: Harga & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Harga *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 font-semibold">Rp</span>
                    <input
                      type="number"
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Status Menu *</label>
                  <div className="flex items-center gap-4 pt-1.5">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={formStatus === 'Tersedia'}
                        onChange={() => setFormStatus('Tersedia')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-emerald-600">Tersedia</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={formStatus === 'Habis'}
                        onChange={() => setFormStatus('Habis')}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span className="font-semibold text-rose-600">Habis</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Row: Kode Menu & Estimasi Sajian */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Kode Menu (Opsional)</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Estimasi Sajian (Opsional)</label>
                  <input
                    type="text"
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Komposisi */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Komposisi *</label>
                <input
                  type="text"
                  value={formIngredients}
                  onChange={(e) => setFormIngredients(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-gray-700">Deskripsi *</label>
                  <span className="text-[10px] text-gray-400">
                    {formDescription.length}/300 karakter
                  </span>
                </div>
                <textarea
                  value={formDescription}
                  maxLength={300}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs resize-none"
                />
              </div>

              {/* Actions matching Slide 15 */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-bold shadow-sm transition"
                >
                  💾 Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
