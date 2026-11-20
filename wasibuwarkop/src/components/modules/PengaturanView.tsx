import React, { useState } from 'react';
import {
  Store,
  Users,
  CreditCard,
  Printer,
  Clock,
  QrCode,
  Edit2,
  CheckCircle2,
  Smartphone,
  Save,
  Check,
} from 'lucide-react';
import { useWasibu } from '../../context/WasibuContext';
import { QrCodeModal } from '../common/QrCodeModal';

export const PengaturanView: React.FC = () => {
  const { settings, updateSettings, users, openReceiptModal } = useWasibu();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [instagram, setInstagram] = useState(settings.instagram);
  const [openTime, setOpenTime] = useState(settings.openTime);
  const [closeTime, setCloseTime] = useState(settings.closeTime);

  const [paymentTunai, setPaymentTunai] = useState(settings.enabledPayments.tunai);
  const [paymentQris, setPaymentQris] = useState(settings.enabledPayments.qris);
  const [paymentDebit, setPaymentDebit] = useState(settings.enabledPayments.debit);
  const [paymentEwallet, setPaymentEwallet] = useState(settings.enabledPayments.ewallet);

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      storeName,
      address,
      phone,
      instagram,
      openTime,
      closeTime,
      enabledPayments: {
        tunai: paymentTunai,
        qris: paymentQris,
        debit: paymentDebit,
        ewallet: paymentEwallet,
      },
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestPrint = () => {
    // Open a sample test receipt
    openReceiptModal({
      id: 9999,
      orderNumber: '#SB-TEST-001',
      tableNumber: 'Meja 01 (Uji Cetak)',
      customerName: 'Uji Printer Kasir',
      orderTime: '10:30 AM',
      orderDate: '21 Okt 2026',
      source: 'Kasir',
      status: 'Selesai',
      paymentStatus: 'Lunas',
      paymentMethod: 'Tunai',
      referenceNumber: 'TEST-PRINTER',
      items: [
        {
          id: 1,
          menuId: 1,
          menuName: 'Ayam Geprek Sambal Bawang',
          qty: 1,
          price: 20000,
          subtotal: 20000,
        },
        { id: 2, menuId: 12, menuName: 'Es Teh Manis Segar', qty: 1, price: 5000, subtotal: 5000 },
      ],
      notes: 'Struk Percobaan Printer POS Warung Si Bungsu',
      subtotal: 25000,
      discount: 0,
      tax: 0,
      total: 25000,
      cashReceived: 30000,
      cashChange: 5000,
      cashierName: 'Admin',
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="p-6 bg-[#F8F9FA] min-h-[calc(100vh-4rem)] flex flex-col gap-6">
      {/* Header matching Slide 20 */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Pengaturan</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Atur informasi warung dan kebutuhan operasional sistem kasir.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Pengaturan berhasil disimpan ke dalam sistem!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN: Informasi Warung, Metode Pembayaran, Printer Struk */}
          <div className="space-y-6">
            {/* 1. Informasi Warung matching Slide 20 */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-4 text-xs">
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5722] flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Informasi Warung</h3>
                  <p className="text-[10px] text-gray-400">
                    Data utama warung Anda yang akan ditampilkan di sistem &amp; struk.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nama Warung</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Alamat</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-800 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Telepon</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Instagram</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-800 font-mono"
                />
              </div>
            </div>

            {/* 2. Metode Pembayaran matching Slide 20 */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-4 text-xs">
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5722] flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Metode Pembayaran</h3>
                  <p className="text-[10px] text-gray-400">
                    Pilih metode pembayaran yang tersedia di warung Anda.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                <label
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    paymentTunai
                      ? 'border-[#FF5722] bg-orange-50/40'
                      : 'border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={paymentTunai}
                    onChange={(e) => setPaymentTunai(e.target.checked)}
                    className="w-4 h-4 text-[#FF5722] rounded focus:ring-[#FF5722]"
                  />
                  <span className="font-bold text-xs text-gray-800">Tunai</span>
                </label>

                <label
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    paymentQris
                      ? 'border-[#FF5722] bg-orange-50/40'
                      : 'border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={paymentQris}
                    onChange={(e) => setPaymentQris(e.target.checked)}
                    className="w-4 h-4 text-[#FF5722] rounded focus:ring-[#FF5722]"
                  />
                  <span className="font-bold text-xs text-gray-800">QRIS</span>
                </label>

                <label
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    paymentDebit
                      ? 'border-[#FF5722] bg-orange-50/40'
                      : 'border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={paymentDebit}
                    onChange={(e) => setPaymentDebit(e.target.checked)}
                    className="w-4 h-4 text-[#FF5722] rounded focus:ring-[#FF5722]"
                  />
                  <span className="font-bold text-xs text-gray-800">Debit/Kartu</span>
                </label>

                <label
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    paymentEwallet
                      ? 'border-[#FF5722] bg-orange-50/40'
                      : 'border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={paymentEwallet}
                    onChange={(e) => setPaymentEwallet(e.target.checked)}
                    className="w-4 h-4 text-[#FF5722] rounded focus:ring-[#FF5722]"
                  />
                  <span className="font-bold text-xs text-gray-800">E-Wallet</span>
                </label>
              </div>
            </div>

            {/* 3. Printer Struk matching Slide 20 */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-4 text-xs">
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5722] flex items-center justify-center">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Printer Struk</h3>
                  <p className="text-[10px] text-gray-400">
                    Atur printer untuk mencetak struk pembayaran kasir.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50/70 border border-gray-100 rounded-xl">
                <div>
                  <div className="font-bold text-gray-900">Printer Kasir (58mm/80mm)</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Terhubung</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTestPrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold rounded-xl text-xs shadow-xs transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Uji Cetak</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Akun Pengguna, Meja & QR Code, Jam Operasional */}
          <div className="space-y-6">
            {/* 4. Akun Pengguna matching Slide 20 */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-4 text-xs">
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5722] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Akun Pengguna</h3>
                  <p className="text-[10px] text-gray-400">
                    Kelola akun pengguna yang dapat mengakses sistem kasir.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                      <th className="py-2">Nama Pengguna</th>
                      <th className="py-2">Username</th>
                      <th className="py-2">Role</th>
                      <th className="py-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="py-2.5 font-bold text-gray-800">{u.name}</td>
                        <td className="py-2.5 text-gray-500 font-mono">@{u.username}</td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              u.role === 'Admin'
                                ? 'bg-orange-50 text-orange-600 border-orange-200'
                                : 'bg-sky-50 text-sky-600 border-sky-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-2.5 text-center">
                          <button
                            type="button"
                            className="p-1 text-gray-400 hover:text-orange-600 rounded"
                            title="Edit Akun"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Meja & QR Code matching Slide 20 */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-4 text-xs">
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5722] flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Meja &amp; QR Code</h3>
                  <p className="text-[10px] text-gray-400">
                    Atur jumlah meja dan kelola QR Code untuk pemesanan.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 items-center">
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <span className="text-[10px] text-gray-400 block font-semibold">Total meja</span>
                  <span className="text-2xl font-black text-gray-900">10</span>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <span className="text-[10px] text-gray-400 block font-semibold">QR aktif</span>
                  <span className="text-2xl font-black text-gray-900">10</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="h-full flex items-center justify-center gap-2 p-3 bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Lihat QR</span>
                </button>
              </div>
            </div>

            {/* 6. Jam Operasional matching Slide 20 */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-4 text-xs">
              <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5722] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Jam Operasional</h3>
                  <p className="text-[10px] text-gray-400">
                    Atur jam buka dan tutup warung Anda.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Jam Buka</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                    />
                    <Clock className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Jam Tutup</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                    />
                    <Clock className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions matching Slide 20 */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              setStoreName(settings.storeName);
              setAddress(settings.address);
              setPhone(settings.phone);
              setInstagram(settings.instagram);
            }}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold rounded-xl text-xs shadow-sm transition active:scale-95 cursor-pointer"
          >
            Simpan Pengaturan
          </button>
        </div>
      </form>

      {/* QR Code Modal for viewing/printing table QR codes */}
      <QrCodeModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} />
    </div>
  );
};
