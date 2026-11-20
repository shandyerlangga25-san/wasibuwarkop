
import React, { useMemo } from 'react';
import {
  TrendingUp,
  Package,
  Users,
  CreditCard,
  Receipt,
  Download,
  Calendar,
  Utensils,
} from 'lucide-react';
import { useWasibu } from '../../context/WasibuContext';

type OrderData = {
  id?: string | number;
  status?: string;
  total?: number;
  totalPrice?: number;
  totalAmount?: number;
  grandTotal?: number;
  totalHarga?: number;
  amount?: number;
  customer?: string | { name?: string };
  customerName?: string;
  name?: string;
  table?: string | number;
  tableNumber?: string | number;
  createdAt?: string | number | Date;
  orderDate?: string | number | Date;
  date?: string | number | Date;
  timestamp?: string | number | Date;
  time?: string;
  payment?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  source?: string;
  items?: Array<{
    name?: string;
    menuName?: string;
    quantity?: number;
    qty?: number;
    price?: number;
    subtotal?: number;
  }>;
};

export const LaporanView: React.FC = () => {
  const { orderHistory } = useWasibu();

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (value: unknown) => {
    if (value === undefined || value === null || value === '') {
      return '-';
    }

    const date = value instanceof Date
      ? value
      : new Date(value as string | number);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOrderTotal = (order: OrderData): number => {
    const possibleTotal =
      order.total ??
      order.totalPrice ??
      order.totalAmount ??
      order.grandTotal ??
      order.totalHarga ??
      order.amount;

    return Number(possibleTotal) || 0;
  };

  const getCustomer = (order: OrderData): string => {
    if (typeof order.customer === 'string') {
      return order.customer;
    }

    return (
      order.customer?.name ??
      order.customerName ??
      order.name ??
      '-'
    );
  };

  const getOrderDate = (order: OrderData): string => {
    const dateValue =
      order.createdAt ??
      order.orderDate ??
      order.date ??
      order.timestamp;

    if (dateValue !== undefined && dateValue !== null) {
      return formatDate(dateValue);
    }

    return order.time ?? '-';
  };

  // Setiap transaksi selesai menjadi satu baris laporan.
  // orderHistory berubah -> grafik dan tabel dihitung ulang.
  const orders = useMemo(() => {
    const history = (orderHistory ?? []) as OrderData[];

    return history
      .filter((order) => {
        // Riwayat normalnya berisi pesanan selesai.
        // Jika status tersedia, hanya hitung pesanan selesai.
        return !order.status || order.status === 'Selesai';
      })
      .map((order, index) => ({
        ...order,
        reportId: String(order.id ?? `PESANAN-${index + 1}`),
        reportTotal: getOrderTotal(order),
        reportCustomer: getCustomer(order),
        reportDate: getOrderDate(order),
      }))
      .reverse();
  }, [orderHistory]);

  // Akumulasi omset setelah setiap pesanan selesai.
  const reportOrders = useMemo(() => {
    let accumulated = 0;

    return orders.map((order, index) => {
      accumulated += order.reportTotal;

      return {
        ...order,
        number: index + 1,
        accumulated,
      };
    });
  }, [orders]);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.reportTotal,
    0
  );

  const averageOrder = orders.length > 0
    ? totalRevenue / orders.length
    : 0;

  const latestOrder = orders.length > 0
    ? orders[orders.length - 1]
    : null;

  const uniqueCustomers = new Set(
    orders
      .map((order) => order.reportCustomer)
      .filter((name) => name !== '-')
  ).size;

  // Grafik menampilkan akumulasi penjualan setiap transaksi.
  const chart = useMemo(() => {
    const left = 72;
    const rightPadding = 30;
    const top = 38;
    const bottom = 190;
    const pointSpacing = 105;

    const width = Math.max(
      600,
      left + rightPadding + Math.max(orders.length - 1, 0) * pointSpacing
    );

    const maxValue = Math.max(
      ...reportOrders.map((order) => order.accumulated),
      1
    );

    const step = 10 ** Math.floor(Math.log10(maxValue));
    const maxScale = Math.ceil(maxValue / step) * step || 1;

    const points = reportOrders.map((order, index) => ({
      id: order.reportId,
      number: order.number,
      total: order.reportTotal,
      accumulated: order.accumulated,
      x: orders.length === 1
        ? width / 2
        : left + index * pointSpacing,
      y: bottom - (order.accumulated / maxScale) * (bottom - top),
    }));

    const linePath = points
      .map((point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
      )
      .join(' ');

    const areaPath = points.length
      ? `${linePath} L ${points[points.length - 1].x} ${bottom} L ${points[0].x} ${bottom} Z`
      : '';

    const gridLines = [0, 1, 2, 3, 4].map((index) => ({
      y: top + (index / 4) * (bottom - top),
      value: maxScale * (1 - index / 4),
    }));

    return {
      width,
      height: 235,
      left,
      bottom,
      points,
      linePath,
      areaPath,
      gridLines,
    };
  }, [orders.length, reportOrders]);

  const handleExportCsv = () => {
    const headers = [
      'No.',
      'ID Pesanan',
      'Pelanggan',
      'Waktu Pesanan',
      'Harga Pesanan',
      'Akumulasi Penjualan',
      'Pembayaran',
      'Status',
    ];

    const escapeCsv = (value: unknown) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`;

    const rows = reportOrders.map((order) => [
      order.number,
      order.reportId,
      order.reportCustomer,
      order.reportDate,
      order.reportTotal,
      order.accumulated,
      order.paymentMethod ?? order.payment ?? '-',
      order.status ?? 'Selesai',
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'Laporan_Penjualan_Per_Pesanan.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8F9FA] p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Laporan Penjualan
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Pantau nilai penjualan berdasarkan setiap pesanan yang selesai.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          <Download className="w-4 h-4 text-orange-500" />
          Ekspor CSV
        </button>
      </div>

      {/* Statistik transaksi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-500">
                Total Omset
              </p>
              <h2 className="text-xl font-black text-gray-900 mt-2">
                {formatRupiah(totalRevenue)}
              </h2>
              <p className="text-[10px] text-gray-400 mt-2">
                Dari pesanan selesai
              </p>
            </div>
            <CreditCard className="w-6 h-6 text-orange-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-500">
                Pesanan Selesai
              </p>
              <h2 className="text-xl font-black text-gray-900 mt-2">
                {orders.length.toLocaleString('id-ID')}
              </h2>
              <p className="text-[10px] text-gray-400 mt-2">
                Satu transaksi dihitung satu pesanan
              </p>
            </div>
            <Package className="w-6 h-6 text-orange-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-500">
                Rata-rata per Pesanan
              </p>
              <h2 className="text-xl font-black text-gray-900 mt-2">
                {formatRupiah(averageOrder)}
              </h2>
              <p className="text-[10px] text-gray-400 mt-2">
                Omset dibagi jumlah pesanan
              </p>
            </div>
            <Receipt className="w-6 h-6 text-orange-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-500">
                Pelanggan Tercatat
              </p>
              <h2 className="text-xl font-black text-gray-900 mt-2">
                {uniqueCustomers.toLocaleString('id-ID')}
              </h2>
              <p className="text-[10px] text-gray-400 mt-2">
                Berdasarkan nama pelanggan
              </p>
            </div>
            <Users className="w-6 h-6 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Grafik transaksi */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 className="font-bold text-gray-900">
              Grafik Akumulasi Penjualan per Pesanan
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Setiap titik mewakili satu pesanan selesai.
            </p>
          </div>
          <div className="text-xs font-semibold text-orange-600">
            {orders.length} transaksi
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400">
            <Receipt className="w-10 h-10 mb-3" />
            <p className="font-semibold text-sm">
              Belum ada pesanan selesai
            </p>
            <p className="text-xs mt-1">
              Grafik akan terisi setelah pesanan masuk ke riwayat.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <svg
              width="100%"
              style={{ minWidth: `${chart.width}px` }}
              viewBox={`0 0 ${chart.width} ${chart.height}`}
              role="img"
              aria-label="Grafik akumulasi omset berdasarkan setiap pesanan selesai"
            >
              <defs>
                <linearGradient
                  id="orderRevenueGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FF5722" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#FF5722" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {chart.gridLines.map((line, index) => (
                <g key={index}>
                  <line
                    x1={chart.left}
                    y1={line.y}
                    x2={chart.width - 25}
                    y2={line.y}
                    stroke="#E5E7EB"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={chart.left - 10}
                    y={line.y + 3}
                    fontSize="10"
                    textAnchor="end"
                    fill="#9CA3AF"
                  >
                    {line.value.toLocaleString('id-ID', {
                      notation: 'compact',
                      maximumFractionDigits: 1,
                    })}
                  </text>
                </g>
              ))}

              {chart.points.length > 1 && (
                <path
                  d={chart.areaPath}
                  fill="url(#orderRevenueGradient)"
                />
              )}

              {chart.points.length > 1 && (
                <path
                  d={chart.linePath}
                  fill="none"
                  stroke="#FF5722"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {chart.points.map((point) => (
                <g key={`${point.id}-${point.number}`}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    fill="#FF5722"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  >
                    <title>
                      Pesanan #{point.id}
                      {' | '}
                      Nilai: {formatRupiah(point.total)}
                      {' | '}
                      Akumulasi: {formatRupiah(point.accumulated)}
                    </title>
                  </circle>

                  <text
                    x={point.x}
                    y={chart.bottom + 19}
                    fontSize="10"
                    fill="#6B7280"
                    textAnchor="middle"
                  >
                    #{point.id.length > 9
                      ? point.id.slice(-6)
                      : point.id}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-[11px] text-gray-500">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            Akumulasi penjualan
          </span>
          <span>
            Nilai terakhir: <strong className="text-gray-900">
              {formatRupiah(totalRevenue)}
            </strong>
          </span>
        </div>
      </div>

      {/* Detail transaksi */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-gray-900">
              Detail Laporan per Pesanan
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Daftar transaksi yang membentuk total omset pada grafik.
            </p>
          </div>
          <span className="text-xs text-gray-500">
            {orders.length} pesanan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-xs text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="px-3 py-3">No.</th>
                <th className="px-3 py-3">ID Pesanan</th>
                <th className="px-3 py-3">Pelanggan</th>
                <th className="px-3 py-3">Waktu</th>
                <th className="px-3 py-3">Pembayaran</th>
                <th className="px-3 py-3">Harga Pesanan</th>
                <th className="px-3 py-3">Akumulasi</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {reportOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-gray-400"
                  >
                    Belum ada transaksi yang selesai.
                  </td>
                </tr>
              ) : (
                reportOrders.map((order) => (
                  <tr
                    key={`${order.reportId}-${order.number}`}
                    className="hover:bg-orange-50/40"
                  >
                    <td className="px-3 py-3.5 text-gray-600">
                      {order.number}
                    </td>
                    <td className="px-3 py-3.5 font-bold text-gray-900">
                      #{order.reportId}
                    </td>
                    <td className="px-3 py-3.5 text-gray-700">
                      {order.reportCustomer}
                    </td>
                    <td className="px-3 py-3.5 text-gray-600">
                      {order.reportDate}
                    </td>
                    <td className="px-3 py-3.5 text-gray-700">
                      {order.paymentMethod ?? order.payment ?? '-'}
                    </td>
                    <td className="px-3 py-3.5 font-semibold text-gray-900">
                      {formatRupiah(order.reportTotal)}
                    </td>
                    <td className="px-3 py-3.5 font-bold text-orange-600">
                      {formatRupiah(order.accumulated)}
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">
                        Selesai
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {reportOrders.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-orange-50/60">
                  <td
                    colSpan={5}
                    className="px-3 py-4 font-black text-gray-900"
                  >
                    Total Penjualan
                  </td>
                  <td className="px-3 py-4 font-black text-orange-600">
                    {formatRupiah(totalRevenue)}
                  </td>
                  <td className="px-3 py-4 font-black text-orange-600">
                    {formatRupiah(totalRevenue)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Informasi transaksi terakhir */}
      <div className="bg-orange-50/70 border border-orange-100 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-orange-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              Transaksi Terakhir
            </h4>
            {latestOrder ? (
              <p className="text-xs text-gray-600 mt-1">
                Pesanan #{latestOrder.reportId} sebesar{' '}
                <strong>{formatRupiah(latestOrder.reportTotal)}</strong>.
                Total akumulasi penjualan saat ini{' '}
                <strong>{formatRupiah(totalRevenue)}</strong>.
              </p>
            ) : (
              <p className="text-xs text-gray-600 mt-1">
                Belum ada transaksi yang selesai.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
