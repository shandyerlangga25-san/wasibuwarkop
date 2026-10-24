
import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Printer,
  Copy,
  ChevronDown,
  Clock,
  QrCode,
  User,
  Trash2,
  Check,
  Eye,
  ArrowRight,
  Calendar,
  Filter,
} from 'lucide-react';
import { useWasibu } from '../../context/WasibuContext';
import { Order, OrderStatus, PaymentMethod } from '../../types/wasibu';

const getJakartaDateTime = () => {
  const now = new Date();

  const date = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(now);

  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);

  return { date, time };
};

export const PesananAktifView: React.FC = () => {
  const {
    activeOrders,
    orderHistory,
    selectedOrder,
    setSelectedOrder,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    saveOrderChanges,
    openReceiptModal,
    menuItems,
    searchQuery,
  } = useWasibu();

  const [jakartaDateTime, setJakartaDateTime] = useState(getJakartaDateTime);

  useEffect(() => {
    const updateDateTime = () => setJakartaDateTime(getJakartaDateTime());
    updateDateTime();

    const interval = window.setInterval(updateDateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  // Jika pesanan terpilih sudah tidak aktif, pilih pesanan aktif berikutnya.
  useEffect(() => {
    if (activeOrders.length === 0) {
      if (selectedOrder !== null) setSelectedOrder(null);
      return;
    }

    const latestSelected = selectedOrder
      ? activeOrders.find((order) => order.id === selectedOrder.id)
      : undefined;

    if (!latestSelected) {
      setSelectedOrder(activeOrders[0]);
      return;
    }

    // Perbarui detail jika data pesanan terpilih berubah.
    if (latestSelected !== selectedOrder) {
      setSelectedOrder(latestSelected);
    }
  }, [activeOrders, selectedOrder, setSelectedOrder]);

  const [activeTabFilter, setActiveTabFilter] = useState<'Semua' | OrderStatus>('Semua');
  const [sourceFilter, setSourceFilter] = useState('Semua');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isStatusSuccessOpen, setIsStatusSuccessOpen] = useState(false);
  const [selectedStatusToChange, setSelectedStatusToChange] =
    useState<OrderStatus>('Diproses');
  const [lastChangedOrder, setLastChangedOrder] = useState<Order | null>(null);

  const [newOrderTable, setNewOrderTable] = useState('Meja 03');
  const [newOrderCustomer, setNewOrderCustomer] = useState('Andi Pratama');
  const [newOrderNotes, setNewOrderNotes] = useState('Tanpa cabe, mohon cepat ya');
  const [newOrderPayment, setNewOrderPayment] = useState<PaymentMethod>('Tunai');
  const [newOrderCashReceived, setNewOrderCashReceived] = useState(50000);

  const [newOrderItems, setNewOrderItems] = useState<
    { menuId: number; menuName: string; qty: number; price: number; subtotal: number }[]
  >([
    { menuId: 5, menuName: 'Nasi Goreng Spesial', qty: 1, price: 25000, subtotal: 25000 },
    { menuId: 12, menuName: 'Es Teh Manis', qty: 2, price: 10000, subtotal: 20000 },
  ]);

  const [selectedMenuToAdd, setSelectedMenuToAdd] = useState<number>(
    menuItems[0]?.id ?? 1
  );

  // Statistik pesanan aktif. Pesanan selesai berada di halaman riwayat.
  const stats = useMemo(() => {
    const baru = activeOrders.filter((o) => o.status === 'Baru').length;
    const diproses = activeOrders.filter((o) => o.status === 'Diproses').length;
    const siap = activeOrders.filter((o) => o.status === 'Siap Disajikan').length;

    return {
      total: activeOrders.length,
      baru,
      diproses,
      siap,
      selesaiHariIni: orderHistory.filter((o) => {
        if (o.status !== 'Selesai') return false;

        const today = getJakartaDateTime().date;
        return o.orderDate === today;
      }).length,
    };
  }, [activeOrders, orderHistory]);

  const filteredOrders = useMemo(() => {
    return activeOrders.filter((order) => {
      if (activeTabFilter !== 'Semua' && order.status !== activeTabFilter) {
        return false;
      }

      if (sourceFilter !== 'Semua' && order.source !== sourceFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNumber = order.orderNumber.toLowerCase().includes(q);
        const matchTable = order.tableNumber.toLowerCase().includes(q);
        const matchCustomer = order.customerName.toLowerCase().includes(q);
        const matchItem = order.items.some((item) =>
          item.menuName.toLowerCase().includes(q)
        );

        if (!matchNumber && !matchTable && !matchCustomer && !matchItem) {
          return false;
        }
      }

      return true;
    });
  }, [activeOrders, activeTabFilter, sourceFilter, searchQuery]);

  const handleCopyOrderNumber = async (orderNumber: string) => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopiedId(orderNumber);
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      window.prompt('Salin nomor pesanan berikut:', orderNumber);
    }
  };

  const newOrderSubtotal = useMemo(
    () => newOrderItems.reduce((total, item) => total + item.subtotal, 0),
    [newOrderItems]
  );

  const newOrderTotal = newOrderSubtotal;
  const newOrderChange = Math.max(
    0,
    newOrderCashReceived - newOrderTotal
  );

  const handleAddItemToNewOrder = () => {
    const targetMenu = menuItems.find(
      (menu) => menu.id === Number(selectedMenuToAdd)
    );

    if (!targetMenu || targetMenu.status === 'Habis') return;

    setNewOrderItems((prev) => {
      const existing = prev.find((item) => item.menuId === targetMenu.id);

      if (existing) {
        return prev.map((item) =>
          item.menuId === targetMenu.id
            ? {
                ...item,
                qty: item.qty + 1,
                subtotal: (item.qty + 1) * item.price,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          menuId: targetMenu.id,
          menuName: targetMenu.name,
          qty: 1,
          price: targetMenu.price,
          subtotal: targetMenu.price,
        },
      ];
    });
  };

  const handleUpdateQty = (menuId: number, delta: number) => {
    setNewOrderItems((prev) =>
      prev.map((item) => {
        if (item.menuId !== menuId) return item;

        const nextQty = Math.max(1, item.qty + delta);

        return {
          ...item,
          qty: nextQty,
          subtotal: nextQty * item.price,
        };
      })
    );
  };

  const handleRemoveItem = (menuId: number) => {
    setNewOrderItems((prev) =>
      prev.filter((item) => item.menuId !== menuId)
    );
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newOrderItems.length === 0) {
      window.alert('Tambahkan minimal satu menu ke pesanan.');
      return;
    }

    if (
      newOrderPayment === 'Tunai' &&
      newOrderCashReceived < newOrderTotal
    ) {
      window.alert('Uang tunai yang diterima kurang dari total pembayaran.');
      return;
    }

    const orderDateTime = getJakartaDateTime();

    const created = createOrder({
      tableNumber: newOrderTable,
      customerName: newOrderCustomer.trim() || 'Pelanggan Meja',
      orderTime: orderDateTime.time,
      orderDate: orderDateTime.date,
      source: 'Kasir',
      status: 'Baru',
      paymentStatus: 'Lunas',
      paymentMethod: newOrderPayment,
      referenceNumber: `TRX-${Date.now().toString().slice(-6)}`,
      items: newOrderItems.map((item, index) => ({
        ...item,
        id: Date.now() + index,
      })),
      notes: newOrderNotes,
      subtotal: newOrderSubtotal,
      discount: 0,
      tax: 0,
      total: newOrderTotal,
      cashReceived:
        newOrderPayment === 'Tunai' ? newOrderCashReceived : newOrderTotal,
      cashChange:
        newOrderPayment === 'Tunai' ? newOrderChange : 0,
      cashierName: 'Admin',
    });

    setIsAddOrderOpen(false);
    setSelectedOrder(created);
    openReceiptModal(created);
  };

  const handleOpenStatusModal = () => {
    if (!selectedOrder) return;

    setSelectedStatusToChange(selectedOrder.status);
    setIsStatusModalOpen(true);
  };

  const handleSaveStatusModal = () => {
    if (!selectedOrder) return;

    const changedOrder: Order = {
      ...selectedOrder,
      status: selectedStatusToChange,
      ...(selectedStatusToChange === 'Selesai'
        ? { paymentStatus: 'Lunas' }
        : {}),
    };

    // Context bertanggung jawab memindahkan pesanan selesai ke riwayat.
    updateOrderStatus(selectedOrder.id, selectedStatusToChange);

    setLastChangedOrder(changedOrder);
    setIsStatusModalOpen(false);
    setIsStatusSuccessOpen(true);
  };

  const handleCancelSelectedOrder = () => {
    if (!selectedOrder) return;

    const confirmed = window.confirm(
      `Batalkan pesanan ${selectedOrder.orderNumber}?`
    );

    if (!confirmed) return;

    cancelOrder(selectedOrder.id);
  };

  return (
    <div className="p-6 bg-[#F8F9FA] min-h-[calc(100vh-4rem)] flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Pesanan Aktif
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola semua pesanan dari kasir, QR Code, dan meja.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOrderOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Pesanan Baru</span>
        </button>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {[
          {
            label: 'Total Pesanan Aktif',
            count: stats.total,
            color: 'text-[#FF5722]',
            icon: '📋',
          },
          {
            label: 'Pesanan Baru',
            count: stats.baru,
            color: 'text-sky-600',
            icon: '🆕',
          },
          {
            label: 'Diproses',
            count: stats.diproses,
            color: 'text-amber-600',
            icon: '🍳',
          },
          {
            label: 'Siap Disajikan',
            count: stats.siap,
            color: 'text-emerald-600',
            icon: '🛎️',
          },
          {
            label: 'Selesai Hari Ini',
            count: stats.selesaiHariIni,
            color: 'text-rose-500',
            icon: '🧾',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className={`text-[11px] font-semibold ${stat.color}`}>
                {stat.label}
              </span>
              <div className="text-2xl font-black text-gray-900 mt-1">
                {stat.count}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-bold">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Daftar Pesanan */}
        <div className="xl:col-span-7 bg-white rounded-2xl shadow-xs border border-gray-100 p-5 flex flex-col">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Daftar Pesanan Aktif
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { label: 'Semua', count: stats.total },
              { label: 'Baru', count: stats.baru },
              { label: 'Diproses', count: stats.diproses },
              { label: 'Siap Disajikan', count: stats.siap },
              { label: 'Selesai', count: stats.selesaiHariIni },
            ].map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTabFilter(tab.label as 'Semua' | OrderStatus)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeTabFilter === tab.label
                    ? 'bg-[#FF5722] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Hari ini, {jakartaDateTime.date}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 px-3 py-1.5 pr-8 focus:outline-none"
              >
                <option value="Semua">Semua Sumber</option>
                <option value="QR">Scan QR Meja</option>
                <option value="Kasir">Pesanan Kasir</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2 pointer-events-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-semibold">
                  <th className="py-2.5 px-2">No. Pesanan</th>
                  <th className="py-2.5 px-2">Meja</th>
                  <th className="py-2.5 px-2">Waktu</th>
                  <th className="py-2.5 px-2">Sumber</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2">Pembayaran</th>
                  <th className="py-2.5 px-2">Total</th>
                  <th className="py-2.5 px-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400">
                      Tidak ada pesanan aktif ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;

                    const statusClass =
                      order.status === 'Baru'
                        ? 'bg-sky-50 text-sky-600 border-sky-200'
                        : order.status === 'Diproses'
                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : order.status === 'Siap Disajikan'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : 'bg-rose-50 text-rose-500 border-rose-200';

                    const dotClass =
                      order.status === 'Baru'
                        ? 'bg-blue-500'
                        : order.status === 'Diproses'
                          ? 'bg-amber-500'
                          : order.status === 'Siap Disajikan'
                            ? 'bg-emerald-500'
                            : 'bg-rose-500';

                    const paymentClass =
                      order.paymentMethod === 'QRIS'
                        ? 'bg-purple-50 text-purple-600 border-purple-200'
                        : order.paymentMethod === 'Tunai'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : order.paymentMethod === 'E-Wallet'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200';

                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`hover:bg-orange-50/40 cursor-pointer transition ${
                          isSelected ? 'bg-orange-50/70 font-medium' : ''
                        }`}
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${dotClass}`} />
                            <span className="font-semibold text-gray-900">
                              {order.orderNumber}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-medium text-gray-700">
                          {order.tableNumber}
                        </td>
                        <td className="py-3 px-2 text-gray-500">
                          {order.orderTime.split(' ')[0]}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1 text-[11px] text-gray-600 font-medium">
                            {order.source === 'QR' ? (
                              <>
                                <QrCode className="w-3.5 h-3.5 text-purple-600" />
                                <span>QR</span>
                              </>
                            ) : (
                              <>
                                <User className="w-3.5 h-3.5 text-amber-600" />
                                <span>Kasir</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold border ${statusClass}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold border ${paymentClass}`}>
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-bold text-gray-800">
                          Rp{order.total.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                              }}
                              className="p-1 text-gray-400 hover:text-orange-600 rounded"
                              title="Lihat detail"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                              }}
                              className="p-1 text-gray-400 hover:text-orange-600 rounded"
                              title="Pilih pesanan"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
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

          <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 text-xs text-gray-500">
            <span>
              Menampilkan {filteredOrders.length} dari {activeOrders.length} pesanan
            </span>
            <span className="text-gray-400">10 / halaman</span>
          </div>
        </div>

        {/* Detail Pesanan */}
        <div className="xl:col-span-5 bg-white rounded-2xl shadow-xs border border-gray-100 p-5 flex flex-col">
          {selectedOrder ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[11px] font-semibold text-gray-400">
                    No. Pesanan
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-black text-gray-900">
                      {selectedOrder.orderNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyOrderNumber(selectedOrder.orderNumber)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded"
                      title="Salin nomor pesanan"
                    >
                      {copiedId === selectedOrder.orderNumber ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openReceiptModal(selectedOrder)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Struk
                </button>
              </div>

              <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50/80 rounded-xl mt-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500">Pembayaran:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Status:</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-600 border border-sky-200">
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/40">
                  <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                    <User className="w-3 h-3" />
                    Nama Pelanggan
                  </div>
                  <div className="font-bold text-gray-800 mt-0.5 truncate">
                    {selectedOrder.customerName || '-'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/40">
                  <div className="text-gray-400 text-[10px]">Meja</div>
                  <div className="font-bold text-orange-600 mt-0.5">
                    {selectedOrder.tableNumber}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/40">
                  <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                    <Clock className="w-3 h-3" />
                    Waktu Pesan
                  </div>
                  <div className="font-semibold text-gray-700 mt-0.5">
                    {selectedOrder.orderTime}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {selectedOrder.orderDate}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/40">
                  <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                    <QrCode className="w-3 h-3 text-purple-600" />
                    Sumber Pesanan
                  </div>
                  <div className="font-bold text-gray-800 mt-0.5">
                    {selectedOrder.source === 'QR' ? 'QR Code' : 'Kasir Manual'}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-bold text-gray-800 mb-2">Item Pesanan</h4>
                <div className="border border-gray-100 rounded-xl overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                        <th className="py-2 px-2.5">No.</th>
                        <th className="py-2 px-2.5">Nama Menu</th>
                        <th className="py-2 px-2 text-center">Qty</th>
                        <th className="py-2 px-2.5 text-right">Harga</th>
                        <th className="py-2 px-2.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={item.id || index}>
                          <td className="py-2 px-2.5 text-gray-400">{index + 1}</td>
                          <td className="py-2 px-2.5 font-medium text-gray-800">
                            {item.menuName}
                          </td>
                          <td className="py-2 px-2 text-center font-bold">{item.qty}</td>
                          <td className="py-2 px-2.5 text-right text-gray-500">
                            Rp{item.price.toLocaleString('id-ID')}
                          </td>
                          <td className="py-2 px-2.5 text-right font-semibold text-gray-800">
                            Rp{item.subtotal.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="mt-3 p-2.5 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs">
                  <span className="font-bold text-amber-800 block">Catatan Pesanan:</span>
                  <p className="text-gray-700 italic mt-0.5">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-100 text-xs space-y-1.5">
                <h4 className="font-bold text-gray-800 mb-2">Informasi Pembayaran</h4>
                <div className="flex justify-between text-gray-600">
                  <span>Metode Pembayaran</span>
                  <span className="font-bold text-gray-900">
                    : {selectedOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Status Pembayaran</span>
                  <span className="font-semibold text-emerald-600">
                    : {selectedOrder.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Sumber Pesanan</span>
                  <span>: {selectedOrder.source === 'QR' ? 'QR Code' : 'Kasir'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Referensi</span>
                  <span className="font-mono text-[11px] text-gray-500">
                    : {selectedOrder.referenceNumber}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>Rp{selectedOrder.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Diskon</span>
                    <span>- Rp{selectedOrder.discount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Pajak</span>
                    <span>Rp{selectedOrder.tax.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1.5">
                    <span>Total</span>
                    <span className="text-[#FF5722] text-base">
                      Rp{selectedOrder.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancelSelectedOrder}
                  className="px-3.5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition"
                >
                  Batalkan Pesanan
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => saveOrderChanges(selectedOrder)}
                    className="px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold transition"
                  >
                    Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenStatusModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95"
                  >
                    Proses Pesanan
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-xs text-center">
              <p className="font-semibold">Tidak ada pesanan aktif.</p>
              <p className="mt-1">Buat pesanan baru atau pilih pesanan dari daftar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Tambah Pesanan */}
      {isAddOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tambah Pesanan Baru</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Buat pesanan manual dari kasir.
                </p>
              </div>
              <button type="button" onClick={() => setIsAddOrderOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Sumber Pesanan
                  </label>
                  <div className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                    Kasir
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Nomor Pesanan
                  </label>
                  <div className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-400">
                    Otomatis saat disimpan
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Pilih Meja</label>
                  <select
                    value={newOrderTable}
                    onChange={(e) => setNewOrderTable(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl"
                  >
                    {Array.from({ length: 10 }, (_, index) => {
                      const table = `Meja ${String(index + 1).padStart(2, '0')}`;
                      return <option key={table} value={table}>{table}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Nama Pelanggan
                  </label>
                  <input
                    value={newOrderCustomer}
                    onChange={(e) => setNewOrderCustomer(e.target.value)}
                    placeholder="Nama pelanggan"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Catatan
                </label>
                <input
                  value={newOrderNotes}
                  onChange={(e) => setNewOrderNotes(e.target.value)}
                  placeholder="Catatan pesanan"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-900">Item Pesanan</span>
                  <div className="flex gap-2">
                    <select
                      value={selectedMenuToAdd}
                      onChange={(e) => setSelectedMenuToAdd(Number(e.target.value))}
                      className="text-xs border border-gray-200 rounded-xl px-2.5 py-1.5"
                    >
                      {menuItems.map((menu) => (
                        <option
                          key={menu.id}
                          value={menu.id}
                          disabled={menu.status === 'Habis'}
                        >
                          {menu.name} - Rp{menu.price.toLocaleString('id-ID')}
                          {menu.status === 'Habis' ? ' (Habis)' : ''}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddItemToNewOrder}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FF5722] text-white rounded-xl text-xs font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Tambah
                    </button>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-500">
                        <th className="py-2.5 px-3">Menu</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Subtotal</th>
                        <th className="py-2.5 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {newOrderItems.map((item) => (
                        <tr key={item.menuId}>
                          <td className="py-2.5 px-3 font-medium">{item.menuName}</td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="inline-flex items-center gap-2">
                              <button type="button" onClick={() => handleUpdateQty(item.menuId, -1)}>−</button>
                              <span className="font-bold">{item.qty}</span>
                              <button type="button" onClick={() => handleUpdateQty(item.menuId, 1)}>+</button>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold">
                            Rp{item.subtotal.toLocaleString('id-ID')}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.menuId)}
                              className="text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between text-sm font-extrabold text-[#FF5722] mt-3">
                  <span>Total</span>
                  <span>Rp{newOrderTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Tunai', 'QRIS', 'Debit/Kartu', 'E-Wallet'] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setNewOrderPayment(method)}
                      className={`p-3 rounded-xl border text-xs font-bold ${
                        newOrderPayment === method
                          ? 'border-[#FF5722] bg-orange-50 text-[#FF5722]'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                {newOrderPayment === 'Tunai' && (
                  <div className="grid grid-cols-2 gap-3 mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                    <div>
                      <label className="block text-gray-600 mb-1 font-semibold">
                        Uang Tunai Diterima
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={newOrderCashReceived}
                        onChange={(e) => setNewOrderCashReceived(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-semibold">
                        Kembalian
                      </label>
                      <div className="py-1.5 font-bold text-emerald-600">
                        Rp{newOrderChange.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddOrderOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF5722] text-white rounded-xl text-xs font-bold"
                >
                  Buat Pesanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ubah Status */}
      {isStatusModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 lg:p-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF5722] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Ubah Status Pesanan</h3>
                  <p className="text-xs text-gray-500">Perbarui status pesanan ini.</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsStatusModalOpen(false)}>✕</button>
            </div>

            <div className="grid grid-cols-3 gap-2 my-4 text-xs bg-gray-50 p-3 rounded-2xl">
              <div>
                <span className="text-[10px] text-gray-400 block">No. Pesanan</span>
                <span className="font-bold text-[#FF5722]">{selectedOrder.orderNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Pelanggan</span>
                <span className="font-semibold">{selectedOrder.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Meja</span>
                <span className="font-bold">{selectedOrder.tableNumber}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Pilih Status Pesanan
              </label>
              {([
                { status: 'Baru', desc: 'Pesanan baru diterima' },
                { status: 'Diproses', desc: 'Sedang disiapkan di dapur' },
                { status: 'Siap Disajikan', desc: 'Pesanan sudah siap' },
                { status: 'Selesai', desc: 'Pesanan telah disajikan dan dipindahkan ke riwayat' },
              ] as const).map((option) => {
                const isSelected = selectedStatusToChange === option.status;

                return (
                  <label
                    key={option.status}
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer ${
                      isSelected
                        ? 'border-[#FF5722] bg-orange-50 ring-1 ring-[#FF5722]'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderStatus"
                      checked={isSelected}
                      onChange={() => setSelectedStatusToChange(option.status)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-bold text-xs text-gray-900 block">
                        {option.status}
                      </span>
                      <span className="text-[11px] text-gray-500">{option.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
              <Clock className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-[10px] block">Estimasi Penyelesaian</span>
                <span className="font-bold text-sm">12–15 menit</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100 mt-5">
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveStatusModal}
                className="px-6 py-2.5 bg-[#FF5722] text-white rounded-xl text-xs font-bold"
              >
                Simpan Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Status Berhasil */}
      {isStatusSuccessOpen && lastChangedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Status Pesanan Berhasil Disimpan
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              {lastChangedOrder.status === 'Selesai'
                ? 'Pesanan telah dipindahkan ke riwayat pesanan.'
                : 'Status pesanan telah diperbarui.'}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-2xl border border-gray-100 text-left mb-4">
              <div>
                <span className="text-[10px] text-gray-400 block">No. Pesanan</span>
                <span className="font-bold text-[#FF5722]">
                  {lastChangedOrder.orderNumber}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Pelanggan</span>
                <span className="font-semibold">{lastChangedOrder.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Meja</span>
                <span className="font-bold">{lastChangedOrder.tableNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Status Baru</span>
                <span className="font-bold text-emerald-600">
                  {lastChangedOrder.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsStatusSuccessOpen(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => setIsStatusSuccessOpen(false)}
                className="flex-1 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white font-semibold rounded-xl text-xs"
              >
                Lanjut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
