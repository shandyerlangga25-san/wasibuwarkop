
import React, { useState, useMemo, useEffect } from 'react';
import {
  Printer,
  Eye,
  Calendar,
  X,
} from 'lucide-react';
import { useWasibu } from '../../context/WasibuContext';
import { Order } from '../../types/wasibu';

// Rentang tanggal otomatis berdasarkan waktu Asia/Jakarta
const getJakartaDateRange = () => {
  const now = new Date();

  const month = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    month: 'short',
  }).format(now);

  const year = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
  }).format(now);

  const today = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(now);

  return `01 ${month} ${year} – ${today}`;
};

export const RiwayatPesananView: React.FC = () => {
  const { orderHistory, openReceiptModal, searchQuery } = useWasibu();

  const [selectedHistoryOrder, setSelectedHistoryOrder] =
    useState<Order | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState(getJakartaDateRange);

  const [sourceFilter, setSourceFilter] = useState('Semua');
  const [paymentFilter, setPaymentFilter] = useState('Semua');

  // Sinkronkan pesanan terpilih ketika orderHistory berubah.
  useEffect(() => {
    if (orderHistory.length === 0) {
      setSelectedHistoryOrder(null);
      setIsDetailModalOpen(false);
      return;
    }

    setSelectedHistoryOrder((current) => {
      if (!current) return orderHistory[0];

      const updatedOrder = orderHistory.find(
        (order) => order.id === current.id
      );

      return updatedOrder ?? orderHistory[0];
    });
  }, [orderHistory]);

  // Perbarui tanggal sesuai waktu Jakarta.
  useEffect(() => {
    const updateDateRange = () => {
      setDateRange(getJakartaDateRange());
    };

    updateDateRange();

    const interval = window.setInterval(updateDateRange, 60000);

    return () => window.clearInterval(interval);
  }, []);

  // Statistik berdasarkan data riwayat sebenarnya.
  const stats = useMemo(() => {
    const totalTransactions = orderHistory.length;

    const totalRevenue = orderHistory.reduce(
      (total, order) => total + order.total,
      0
    );

    const qrCount = orderHistory.filter(
      (order) => order.source === 'QR'
    ).length;

    const cashierCount = orderHistory.filter(
      (order) => order.source === 'Kasir'
    ).length;

    return {
      totalTransactions,
      totalRevenue,
      qrCount,
      cashierCount,
    };
  }, [orderHistory]);

  // Filter riwayat pesanan.
  const filteredHistory = useMemo(() => {
    return orderHistory.filter((order) => {
      if (
        sourceFilter !== 'Semua' &&
        order.source !== sourceFilter
      ) {
        return false;
      }

      if (
        paymentFilter !== 'Semua' &&
        order.paymentMethod !== paymentFilter
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();

        const matchNumber = order.orderNumber
          .toLowerCase()
          .includes(query);

        const matchTable = order.tableNumber
          .toLowerCase()
          .includes(query);

        const matchCustomer = (order.customerName || '')
          .toLowerCase()
          .includes(query);

        const matchItem = order.items.some((item) =>
          item.menuName.toLowerCase().includes(query)
        );

        if (
          !matchNumber &&
          !matchTable &&
          !matchCustomer &&
          !matchItem
        ) {
          return false;
        }
      }

      return true;
    });
  }, [orderHistory, sourceFilter, paymentFilter, searchQuery]);

  const formatRupiah = (amount: number) =>
    `Rp${amount.toLocaleString('id-ID')}`;

  const handleSelectOrder = (order: Order) => {
    setSelectedHistoryOrder(order);
  };

  const handleOpenDetail = (order: Order) => {
    setSelectedHistoryOrder(order);
    setIsDetailModalOpen(true);
  };

  const handlePrintReceipt = (order: Order) => {
    openReceiptModal(order);
  };

  return (
    <div className="p-6 bg-[#F8F9FA] min-h-[calc(100vh-4rem)] flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Riwayat Pesanan
        </h1>

        <p className="text-xs text-gray-500 mt-0.5">
          Daftar pesanan yang telah selesai dan transaksi sebelumnya
          yang dapat ditinjau serta dicetak ulang struknya.
        </p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500">
              Total Transaksi
            </span>
            <div className="text-2xl font-black text-gray-900 mt-1">
              {stats.totalTransactions}
            </div>
          </div>

          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5722] flex items-center justify-center">
            🧾
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-sky-600">
              Total Pendapatan
            </span>
            <div className="text-2xl font-black text-gray-900 mt-1">
              {formatRupiah(stats.totalRevenue)}
            </div>
          </div>

          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            💰
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-purple-600">
              Pesanan QR
            </span>
            <div className="text-2xl font-black text-gray-900 mt-1">
              {stats.qrCount}
            </div>
          </div>

          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            📱
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600">
              Pesanan Kasir
            </span>
            <div className="text-2xl font-black text-gray-900 mt-1">
              {stats.cashierCount}
            </div>
          </div>

          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            🏪
          </div>
        </div>
      </div>

      {/* Konten utama */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Daftar Riwayat */}
        <div className="xl:col-span-7 bg-white rounded-2xl shadow-xs border border-gray-100 p-5 flex flex-col">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Daftar Riwayat Pesanan
          </h2>

          {/* Filter */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{dateRange}</span>
            </div>

            <select
              value={sourceFilter}
              onChange={(event) => setSourceFilter(event.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 px-3 py-1.5 focus:outline-none"
            >
              <option value="Semua">Semua Sumber</option>
              <option value="QR">QR Code</option>
              <option value="Kasir">Kasir</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 px-3 py-1.5 focus:outline-none"
            >
              <option value="Semua">Semua Pembayaran</option>
              <option value="QRIS">QRIS</option>
              <option value="Tunai">Tunai</option>
              <option value="Debit/Kartu">Debit/Kartu</option>
              <option value="E-Wallet">E-Wallet</option>
            </select>
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-semibold">
                  <th className="py-2.5 px-2">No. Pesanan</th>
                  <th className="py-2.5 px-2">Tanggal</th>
                  <th className="py-2.5 px-2">Nama Pelanggan</th>
                  <th className="py-2.5 px-2">Meja</th>
                  <th className="py-2.5 px-2">Sumber</th>
                  <th className="py-2.5 px-2">Pembayaran</th>
                  <th className="py-2.5 px-2">Total</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-8 text-center text-gray-400"
                    >
                      {orderHistory.length === 0
                        ? 'Belum ada pesanan yang selesai.'
                        : 'Tidak ada riwayat pesanan yang sesuai filter.'}
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((order) => {
                    const isSelected =
                      selectedHistoryOrder?.id === order.id;

                    return (
                      <tr
                        key={order.id}
                        onClick={() => handleSelectOrder(order)}
                        className={`hover:bg-orange-50/40 cursor-pointer transition ${
                          isSelected ? 'bg-orange-50/70' : ''
                        }`}
                      >
                        <td className="py-3 px-2 font-semibold text-gray-900 whitespace-nowrap">
                          {order.orderNumber}
                        </td>

                        <td className="py-3 px-2 text-gray-500 whitespace-nowrap">
                          {order.orderDate}
                        </td>

                        <td className="py-3 px-2 font-medium text-gray-800">
                          {order.customerName || '-'}
                        </td>

                        <td className="py-3 px-2 text-orange-600 font-semibold">
                          {order.tableNumber}
                        </td>

                        <td className="py-3 px-2 text-gray-600">
                          {order.source === 'QR' ? 'QR' : 'Kasir'}
                        </td>

                        <td className="py-3 px-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 text-gray-700 whitespace-nowrap">
                            {order.paymentMethod}
                          </span>
                        </td>

                        <td className="py-3 px-2 font-bold text-gray-900 whitespace-nowrap">
                          {formatRupiah(order.total)}
                        </td>

                        <td className="py-3 px-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            {order.status}
                          </span>
                        </td>

                        <td className="py-3 px-2 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleOpenDetail(order);
                              }}
                              className="p-1 text-gray-400 hover:text-orange-600"
                              title="Lihat detail"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handlePrintReceipt(order);
                              }}
                              className="p-1 text-gray-400 hover:text-orange-600"
                              title="Cetak ulang struk"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Informasi jumlah data */}
          <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 text-xs text-gray-500">
            <span>
              Menampilkan {filteredHistory.length} dari {orderHistory.length} pesanan
            </span>
            <span>Data riwayat</span>
          </div>
        </div>

        {/* Detail riwayat */}
        <div className="xl:col-span-5 bg-white rounded-2xl shadow-xs border border-gray-100 p-5 flex flex-col">
          {selectedHistoryOrder ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[11px] font-semibold text-gray-400">
                    No. Pesanan
                  </span>
                  <div className="text-base font-black text-gray-900 mt-0.5">
                    {selectedHistoryOrder.orderNumber}
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {selectedHistoryOrder.status}
                </span>
              </div>

              <div className="space-y-2 py-3 border-b border-gray-100 text-xs text-gray-600">
                <div className="flex justify-between gap-3">
                  <span>Nama Pelanggan</span>
                  <span className="font-bold text-gray-900 text-right">
                    {selectedHistoryOrder.customerName || '-'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Meja</span>
                  <span className="font-bold text-orange-600">
                    {selectedHistoryOrder.tableNumber}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span>Tanggal Pesanan</span>
                  <span className="text-right">
                    {selectedHistoryOrder.orderDate}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Waktu Pesanan</span>
                  <span>{selectedHistoryOrder.orderTime}</span>
                </div>

                <div className="flex justify-between">
                  <span>Sumber Pesanan</span>
                  <span>
                    {selectedHistoryOrder.source === 'QR'
                      ? 'QR Code'
                      : 'Kasir Manual'}
                  </span>
                </div>
              </div>

              <div className="py-3 border-b border-gray-100 text-xs space-y-2">
                <h4 className="font-bold text-gray-800">
                  Informasi Pembayaran
                </h4>

                <div className="flex justify-between gap-3 text-gray-600">
                  <span>Metode Pembayaran</span>
                  <span className="font-bold text-gray-900">
                    {selectedHistoryOrder.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-gray-600">
                  <span>Status Pembayaran</span>
                  <span className="font-semibold text-emerald-600">
                    {selectedHistoryOrder.paymentStatus}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-gray-600">
                  <span>Referensi</span>
                  <span className="font-mono text-right break-all">
                    {selectedHistoryOrder.referenceNumber || '-'}
                  </span>
                </div>
              </div>

              <div className="py-3 border-b border-gray-100 text-xs">
                <h4 className="font-bold text-gray-800 mb-3">
                  Item Pesanan
                </h4>

                {selectedHistoryOrder.items.map((item, index) => (
                  <div
                    key={item.id ?? index}
                    className="flex justify-between items-start gap-3 mb-2 text-gray-700"
                  >
                    <div>
                      <span className="font-medium text-gray-900">
                        {item.menuName}
                      </span>
                      <span className="text-gray-400 text-[11px] ml-1.5">
                        x{item.qty}
                      </span>
                    </div>

                    <span className="font-semibold whitespace-nowrap">
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex justify-between items-baseline text-sm font-extrabold text-gray-900">
                <span>Total</span>
                <span className="text-[#FF5722] text-lg">
                  {formatRupiah(selectedHistoryOrder.total)}
                </span>
              </div>

              {selectedHistoryOrder.notes && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs">
                  <span className="font-bold text-amber-800 block">
                    Catatan
                  </span>
                  <p className="text-gray-700 mt-1">
                    {selectedHistoryOrder.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-5 mt-auto">
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(true)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
                >
                  <Eye className="w-4 h-4" />
                  Lihat Detail
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintReceipt(selectedHistoryOrder)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Ulang Struk
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-gray-400">
              <p className="font-semibold">Belum ada riwayat pesanan.</p>
              <p className="mt-1">
                Pesanan akan muncul di sini setelah statusnya Selesai.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal detail */}
      {isDetailModalOpen && selectedHistoryOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Detail Riwayat Pesanan
                </h3>
                <p className="text-xs text-gray-500">
                  Informasi lengkap pesanan yang dipilih.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label="Tutup detail"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">No. Pesanan</span>
                  <span className="font-bold text-[#FF5722]">
                    {selectedHistoryOrder.orderNumber}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">Nama Pelanggan</span>
                  <span className="font-semibold text-gray-800 text-right">
                    {selectedHistoryOrder.customerName || '-'}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">Meja</span>
                  <span className="font-bold text-orange-600">
                    {selectedHistoryOrder.tableNumber}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">Sumber Pesanan</span>
                  <span>
                    {selectedHistoryOrder.source === 'QR' ? 'QR Code' : 'Kasir'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">Tanggal</span>
                  <span className="text-right">
                    {selectedHistoryOrder.orderDate}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">Waktu</span>
                  <span>{selectedHistoryOrder.orderTime}</span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">Status</span>
                  <span className="font-bold text-emerald-600">
                    {selectedHistoryOrder.status}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">Pembayaran</span>
                  <span className="font-semibold">
                    {selectedHistoryOrder.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            <h4 className="text-xs font-bold text-gray-900 mb-2">
              Item Pesanan
            </h4>

            <div className="border border-gray-100 rounded-2xl overflow-x-auto mb-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold">
                    <th className="py-2.5 px-3">No.</th>
                    <th className="py-2.5 px-3">Menu</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Harga</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {selectedHistoryOrder.items.map((item, index) => (
                    <tr key={item.id ?? index}>
                      <td className="py-2 px-3 text-gray-400">
                        {index + 1}
                      </td>
                      <td className="py-2 px-3 font-medium text-gray-900">
                        {item.menuName}
                      </td>
                      <td className="py-2 px-3 text-center font-bold">
                        {item.qty}
                      </td>
                      <td className="py-2 px-3 text-right text-gray-500 whitespace-nowrap">
                        {formatRupiah(item.price)}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-gray-900 whitespace-nowrap">
                        {formatRupiah(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-baseline text-base font-extrabold text-gray-900 pb-4 border-b border-gray-100">
              <span>Total</span>
              <span className="text-[#FF5722] text-xl">
                {formatRupiah(selectedHistoryOrder.total)}
              </span>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              <span className="font-bold text-gray-700 block">Catatan:</span>
              <p className="italic mt-0.5">
                {selectedHistoryOrder.notes || 'Tidak ada catatan tambahan.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 mt-4">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={() => handlePrintReceipt(selectedHistoryOrder)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Printer className="w-4 h-4" />
                Cetak Ulang Struk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
