export type UserRole = 'Admin' | 'Owner' | 'Kasir';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type OrderStatus = 'Baru' | 'Diproses' | 'Siap Disajikan' | 'Selesai' | 'Dibatalkan';
export type PaymentStatus = 'Belum Bayar' | 'Lunas';
export type PaymentMethod = 'Tunai' | 'QRIS' | 'Debit/Kartu' | 'E-Wallet';
export type OrderSource = 'QR' | 'Kasir';

export interface OrderItem {
  id: number;
  menuId: number;
  menuName: string;
  qty: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string; // e.g. #SB-20261021-001
  tableNumber: string; // e.g. Meja 05
  customerName: string; // e.g. Andi Pratama
  orderTime: string; // e.g. 10:20 AM
  orderDate: string; // e.g. 21 Okt 2026
  source: OrderSource;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  referenceNumber: string; // e.g. QRIS-20261021-001
  items: OrderItem[];
  notes?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  cashReceived?: number;
  cashChange?: number;
  cashierName?: string;
  createdAt: string;
}

export type MenuCategory = 'Makanan' | 'Minuman' | 'Cemilan' | 'Paket Hemat';
export type MenuStatus = 'Tersedia' | 'Habis';

export interface MenuItem {
  id: number;
  code: string;
  name: string;
  category: MenuCategory;
  price: number;
  status: MenuStatus;
  image: string;
  preparationTime: string;
  ingredients: string;
  description: string;
}

export type StockCategory = 'Bahan Pokok' | 'Protein' | 'Bumbu & Sayur' | 'Minuman' | 'Kemasan';
export type StockStatus = 'Aman' | 'Menipis' | 'Habis';
export type StockUnit = 'kg' | 'liter' | 'pack' | 'pcs' | 'galon';

export interface StockMovement {
  id: number;
  type: 'Barang Masuk' | 'Dipakai Dapur' | 'Penyesuaian';
  amount: number;
  unit: StockUnit;
  date: string;
  note: string;
}

export interface StockItem {
  id: number;
  name: string;
  category: StockCategory;
  unit: StockUnit;
  currentStock: number;
  minStock: number;
  status: StockStatus;
  lastUpdated: string;
  location: string;
  notes: string;
  movements: StockMovement[];
}

export interface Customer {
  id: number;
  name: string;
  phone?: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  favoriteMenu?: string;
}

export interface MonthlyReport {
  month: string;
  revenue: number;
  ordersCount: number;
  customersCount: number;
  trend: 'Naik' | 'Stabil' | 'Turun';
}

export interface WarungSettings {
  storeName: string;
  address: string;
  phone: string;
  instagram: string;
  enabledPayments: {
    tunai: boolean;
    qris: boolean;
    debit: boolean;
    ewallet: boolean;
  };
  printerStatus: 'Terhubung' | 'Terputus';
  totalTables: number;
  activeQrs: number;
  openTime: string;
  closeTime: string;
}
