

import React, { useMemo, useState } from 'react';
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  X,
  Utensils,
  ArrowRight,
} from 'lucide-react';

import { useWasibu } from '../../context/WasibuContext';
import {
  MenuItem,
  PaymentMethod,
  PaymentStatus,
} from '../../types/wasibu';

type OrderPayload = {
  items: {
    menuId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  tableNumber: string;
  customerName: string;
  notes: string;
};

type Props = {
  menus?: MenuItem[];
  tableNumber?: string;
  createOrder: (order: OrderPayload) => void | Promise<void>;
};

const categories = [
  'Semua',
  'Makanan',
  'Minuman',
  'Cemilan',
  'Paket Hemat',
];

const formatRupiah = (price: number) =>
  `Rp${price.toLocaleString('id-ID')}`;

const PesananUser: React.FC<Props> = ({
  menus = [],
  tableNumber = '',
  createOrder,
}) => {
  const { menuItems } = useWasibu();

  // Mengambil data menu yang sama dengan halaman Admin.
  const availableMenus = menuItems.length > 0 ? menuItems : menus;

  const [category, setCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [showCart, setShowCart] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [table, setTable] = useState(tableNumber);
  const [notes, setNotes] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('Tunai');
  const [submitting, setSubmitting] = useState(false);

  const [popup, setPopup] = useState({
  show: false,
  title: '',
  message: '',
  type: 'success' as 'success' | 'error',
});

  const filteredMenus = useMemo(() => {
    return availableMenus.filter((item) => {
      const matchCategory =
        category === 'Semua' ||
        (category === 'Paket Hemat'
          ? item.category === 'Paket Hemat' ||
            item.category === 'Cemilan'
          : item.category === category);

      const keyword = search.toLowerCase();

      const matchSearch =
        item.name.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword);

      return (
        matchCategory &&
        matchSearch &&
        item.status === 'Tersedia'
      );
    });
  }, [availableMenus, category, search]);

  const cartItems = availableMenus.filter(
    (item) => (cart[item.id] || 0) > 0
  );

  const totalItems = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * cart[item.id],
    0
  );

  const addToCart = (id: number) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decreaseCart = (id: number) => {
    setCart((prev) => {
      const next = { ...prev };

      if ((next[id] || 0) <= 1) {
        delete next[id];
      } else {
        next[id] -= 1;
      }

      return next;
    });
  };

 const showPopup = (
  title: string,
  message: string,
  type: 'success' | 'error' = 'success'
) => {
  setPopup({
    show: true,
    title,
    message,
    type,
  });
};

const handleCheckout = async () => {
  if (!customerName.trim()) {
    showPopup('Nama Belum Diisi', 'Silakan isi nama pelanggan terlebih dahulu.', 'error');
    return;
  }

  if (!table.trim()) {
    showPopup('Nomor Meja Belum Diisi', 'Silakan isi nomor meja terlebih dahulu.', 'error');
    return;
  }

  if (cartItems.length === 0) {
    showPopup('Keranjang Kosong', 'Silakan pilih menu terlebih dahulu.', 'error');
    return;
  }

  setSubmitting(true);

  try {
    await createOrder({
      items: cartItems.map((item) => ({
        menuId: String(item.id),
        name: item.name,
        price: item.price,
        quantity: cart[item.id],
      })),
      total: totalPrice,
      paymentMethod: payment,
      paymentStatus: 'Belum Bayar',
      tableNumber: table,
      customerName: customerName,
      notes: notes,
    });

    setCart({});
    setCustomerName('');
    setNotes('');
    setShowCart(false);

    showPopup(
      'Pesanan Berhasil!',
      'Pesanan kamu berhasil dikirim. Silakan tunggu, pesanan sedang diproses.'
    );
  } catch (error) {
    console.error('Gagal membuat pesanan:', error);

    showPopup(
      'Pesanan Gagal!',
      'Pesanan gagal dikirim. Silakan coba beberapa saat lagi.',
      'error'
    );
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-gray-800">

      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF5722] text-white">
              <Utensils size={23} />
            </div>

            <div>
              <h1 className="text-xl font-black text-gray-900">
                WASIBU<span className="text-[#FF5722]">.</span>
              </h1>
              <p className="text-[10px] font-medium text-gray-500">
                Warung Si Bungsu
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCart(true)}
            className="relative flex items-center gap-2 rounded-xl bg-[#FF5722] px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-[#E64A19]"
          >
            <ShoppingBag size={18} />
            Keranjang

            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1 text-xs font-black text-[#FF5722]">
              {totalItems}
            </span>
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-7">

        {/* BANNER */}
        <section className="relative mb-9 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#F4511E] to-[#FF8A50] px-7 py-10 text-white shadow-lg md:px-12 md:py-14">

          <div className="relative z-10 max-w-xl">
            <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-xs font-bold">
              SELAMAT DATANG DI WASIBU
            </span>

            <h2 className="text-3xl font-black leading-tight md:text-5xl">
              Makan Enak,
              <br />
              Hati Senang!
            </h2>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/90 md:text-base">
              Pilih menu favoritmu dan nikmati hidangan lezat
              dari Warung Si Bungsu.
            </p>

            <button
              onClick={() =>
                document.getElementById('daftar-menu')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#F4511E] hover:bg-orange-50"
            >
              Lihat Menu <ArrowRight size={17} />
            </button>
          </div>

          <div className="pointer-events-none absolute -right-12 -top-20 h-72 w-72 rounded-full border-[35px] border-white/10" />

          <div className="pointer-events-none absolute right-10 top-8 hidden text-8xl opacity-20 md:block">
            🍜
          </div>

        </section>

        {/* DAFTAR MENU */}
        <section id="daftar-menu">

          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#FF5722]">
                Pilihan terbaik
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-900 md:text-3xl">
                Menu Kami
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Temukan makanan dan minuman favoritmu.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-orange-100 bg-white px-4 py-3 md:w-80">
              <Search size={18} className="text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari menu..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

          </div>

          {/* KATEGORI */}
          <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-xl px-5 py-3 text-sm font-bold transition ${
                  category === item
                    ? 'bg-[#FF5722] text-white shadow-md'
                    : 'border border-orange-100 bg-white text-gray-600 hover:bg-orange-50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* KARTU MENU */}
          {filteredMenus.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-orange-200 bg-white py-16 text-center">
              <div className="text-4xl">🍽️</div>

              <p className="mt-3 font-bold text-gray-700">
                Menu tidak ditemukan
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Coba pilih kategori atau kata pencarian lain.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

              {filteredMenus.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="relative h-36 overflow-hidden bg-orange-50 sm:h-48">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#FF5722] shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-3 sm:p-4">

                    <h3 className="line-clamp-1 text-sm font-extrabold text-gray-900 sm:text-base">
                      {item.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 min-h-8 text-[11px] leading-relaxed text-gray-400">
                      {item.description || 'Menu lezat dari Warung Si Bungsu.'}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-2">

                      <span className="text-sm font-black text-[#FF5722] sm:text-base">
                        {formatRupiah(item.price)}
                      </span>

                      <button
                        onClick={() => addToCart(item.id)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF5722] text-white hover:bg-[#E64A19]"
                        title="Tambah ke keranjang"
                      >
                        <Plus size={19} />
                      </button>

                    </div>

                    {(cart[item.id] || 0) > 0 && (
                      <p className="mt-2 text-[11px] font-bold text-emerald-600">
                        {cart[item.id]} item di keranjang
                      </p>
                    )}

                  </div>
                </article>
              ))}

            </div>
          )}

        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-12 border-t border-orange-100 bg-white px-5 py-7 text-center">
        <p className="font-black text-gray-900">
          WASIBU<span className="text-[#FF5722]">.</span>
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Warung Si Bungsu · Terima kasih telah memesan!
        </p>
      </footer>

      {/* KERANJANG */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">

          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-lg font-black">
                  Keranjang Pesanan
                </h2>

                <p className="text-xs text-gray-400">
                  {totalItems} item dipilih
                </p>
              </div>

              <button
                onClick={() => setShowCart(false)}
                className="rounded-xl bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">

              {cartItems.length === 0 ? (
                <div className="py-16 text-center">
                  <ShoppingBag
                    className="mx-auto text-gray-300"
                    size={45}
                  />

                  <p className="mt-3 font-bold text-gray-600">
                    Keranjang masih kosong
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Tambahkan menu favoritmu terlebih dahulu.
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 border-b border-gray-100 pb-4"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-bold">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs font-bold text-[#FF5722]">
                        {formatRupiah(item.price)}
                      </p>

                      <div className="mt-2 flex items-center gap-3">

                        <button
                          onClick={() => decreaseCart(item.id)}
                          className="rounded-lg bg-gray-100 p-1.5"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="text-sm font-bold">
                          {cart[item.id]}
                        </span>

                        <button
                          onClick={() => addToCart(item.id)}
                          className="rounded-lg bg-orange-50 p-1.5 text-[#FF5722]"
                        >
                          <Plus size={14} />
                        </button>

                        <button
                          onClick={() =>
                            setCart((prev) => {
                              const next = { ...prev };
                              delete next[item.id];
                              return next;
                            })
                          }
                          className="ml-auto text-red-400"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </div>
                  </div>
                ))
              )}

              {cartItems.length > 0 && (
                <div className="space-y-3 pt-3">

                  <h3 className="font-black">
                    Data Pemesanan
                  </h3>

                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nama pelanggan"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#FF5722]"
                  />

                  <input
                    value={table}
                    onChange={(e) => setTable(e.target.value)}
                    placeholder="Nomor meja"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#FF5722]"
                  />

                  <select
                    value={payment}
                    onChange={(e) =>
                      setPayment(e.target.value as PaymentMethod)
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#FF5722]"
                  >
                    <option value="Tunai">Tunai</option>
                    <option value="QRIS">QRIS</option>
                    <option value="Debit/Kartu">Debit/Kartu</option>
                    <option value="E-Wallet">E-Wallet</option>
                  </select>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Catatan pesanan (opsional)"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#FF5722]"
                  />

                </div>
              )}

            </div>

            <div className="border-t border-gray-100 p-5">

              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500">
                  Total Pembayaran
                </span>

                <span className="text-xl font-black text-[#FF5722]">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || submitting}
                className="w-full rounded-xl bg-[#FF5722] py-3.5 text-sm font-black text-white transition hover:bg-[#E64A19] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? 'Mengirim Pesanan...' : 'Kirim Pesanan'}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* POPUP NOTIFIKASI */}
{popup.show && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm">
    <div className="w-full max-w-sm animate-in zoom-in-95 rounded-3xl bg-white p-7 text-center shadow-2xl">

      <div
        className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
          popup.type === 'success'
            ? 'bg-green-100 text-green-600'
            : 'bg-red-100 text-red-600'
        }`}
      >
        {popup.type === 'success' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <X size={40} />
        )}
      </div>

      <h2 className="mt-5 text-xl font-black text-gray-900">
        {popup.title}
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-gray-500">
        {popup.message}
      </p>

      <button
        onClick={() =>
          setPopup((prev) => ({ ...prev, show: false }))
        }
        className={`mt-7 w-full rounded-xl py-3.5 text-sm font-black text-white shadow-md transition ${
          popup.type === 'success'
            ? 'bg-[#FF5722] hover:bg-[#E64A19]'
            : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        OK
      </button>

    </div>
  </div>
)}

    </div>
  );
};

export default PesananUser;

