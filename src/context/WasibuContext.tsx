
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Customer,
  MenuItem,
  MonthlyReport,
  Order,
  OrderStatus,
  StockItem,
  User,
  WarungSettings,
} from '../types/wasibu';
import {
  INITIAL_ACTIVE_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_MENU_ITEMS,
  INITIAL_MONTHLY_REPORTS,
  INITIAL_ORDER_HISTORY,
  INITIAL_SETTINGS,
  INITIAL_STOCK_ITEMS,
  INITIAL_USERS,
} from '../data/initialData';

export type NavTab =
  | 'pesanan'
  | 'riwayat'
  | 'menu'
  | 'stok'
  | 'pelanggan'
  | 'laporan'
  | 'pengaturan';

interface WasibuContextType {
  currentUser: User | null;
  users: User[];
  login: (emailOrUser: string, pass: string) => { success: boolean; message?: string };
  register: (name: string, email: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // Orders
  activeOrders: Order[];
  orderHistory: Order[];
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: number, newStatus: OrderStatus) => void;
  cancelOrder: (orderId: number) => void;
  saveOrderChanges: (order: Order) => void;

  // Menu
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  toggleMenuStatus: (id: number) => void;

  // Stock
  stockItems: StockItem[];
  addStock: (id: number, amount: number, note?: string) => void;
  adjustStock: (id: number, newStock: number, note?: string) => void;

  // Customers & Reports
  customers: Customer[];
  monthlyReports: MonthlyReport[];

  // Settings
  settings: WarungSettings;
  updateSettings: (newSettings: WarungSettings) => void;

  // Modals & UI helpers
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  receiptOrder: Order | null;
  openReceiptModal: (order: Order) => void;
  closeReceiptModal: () => void;
  isHelpModalOpen: boolean;
  openHelpModal: () => void;
  closeHelpModal: () => void;
  isForgotPassModalOpen: boolean;
  openForgotPassModal: () => void;
  closeForgotPassModal: () => void;
  isLogoutConfirmOpen: boolean;
  openLogoutConfirm: () => void;
  closeLogoutConfirm: () => void;
  isSourceCodeModalOpen: boolean;
  openSourceCodeModal: () => void;
  closeSourceCodeModal: () => void;
  notificationsCount: number;
}

const WasibuContext = createContext<WasibuContextType | null>(null);

export const WasibuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('wasibu_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [users] = useState<User[]>(INITIAL_USERS);
  const [activeTab, setActiveTab] = useState<NavTab>('pesanan');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Orders
  const [activeOrders, setActiveOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('wasibu_active_orders');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVE_ORDERS;
  });

  // Order History
  const [orderHistory, setOrderHistory] = useState<Order[]>(() => {
    const saved = localStorage.getItem('wasibu_order_history');
    return saved ? JSON.parse(saved) : INITIAL_ORDER_HISTORY;
  });

  // Selected Order mengikuti data pesanan aktif yang tersimpan
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(() => {
    const saved = localStorage.getItem('wasibu_active_orders');
    const orders: Order[] = saved ? JSON.parse(saved) : INITIAL_ACTIVE_ORDERS;
    return orders[0] ?? null;
  });

  // Menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('wasibu_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  // Stock items
  const [stockItems, setStockItems] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem('wasibu_stock_items');
    return saved ? JSON.parse(saved) : INITIAL_STOCK_ITEMS;
  });

  // Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('wasibu_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  // Reports
  const [monthlyReports] = useState<MonthlyReport[]>(INITIAL_MONTHLY_REPORTS);

  // Settings
  const [settings, setSettings] = useState<WarungSettings>(() => {
    const saved = localStorage.getItem('wasibu_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Modals
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isForgotPassModalOpen, setIsForgotPassModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isSourceCodeModalOpen, setIsSourceCodeModalOpen] = useState(false);

  // Sinkronisasi data ke localStorage
  useEffect(() => {
    localStorage.setItem('wasibu_active_orders', JSON.stringify(activeOrders));
  }, [activeOrders]);

  useEffect(() => {
    localStorage.setItem('wasibu_order_history', JSON.stringify(orderHistory));
  }, [orderHistory]);

  useEffect(() => {
    localStorage.setItem('wasibu_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('wasibu_stock_items', JSON.stringify(stockItems));
  }, [stockItems]);

  useEffect(() => {
    localStorage.setItem('wasibu_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('wasibu_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('wasibu_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('wasibu_user');
    }
  }, [currentUser]);

  // Pastikan pesanan yang dipilih selalu mengikuti data aktif terbaru
  useEffect(() => {
    if (!selectedOrder) return;

    const latestOrder = activeOrders.find((order) => order.id === selectedOrder.id);

    if (latestOrder) {
      if (latestOrder !== selectedOrder) {
        setSelectedOrder(latestOrder);
      }
    } else {
      setSelectedOrder(activeOrders[0] ?? null);
    }
  }, [activeOrders, selectedOrder]);

  // Auth Methods
  const login = (emailOrUser: string, pass: string) => {
    const trimmed = emailOrUser.trim().toLowerCase();

    const found = users.find(
      (u) => u.username.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed
    );

    if (!found) {
      return {
        success: false,
        message: 'Email atau username tidak terdaftar dalam sistem!',
      };
    }

    if (!pass || pass.length < 3) {
      return {
        success: false,
        message: 'Password salah. Silakan coba lagi.',
      };
    }

    setCurrentUser(found);
    return { success: true };
  };

  const register = (name: string, email: string, pass: string) => {
    if (!name || !email || !pass) {
      return {
        success: false,
        message: 'Harap isi semua kolom formulir pendaftaran.',
      };
    }

    if (pass.length < 8) {
      return {
        success: false,
        message: 'Password minimal 8 karakter sesuai ketentuan.',
      };
    }

    const newUser: User = {
      id: Date.now(),
      name,
      username: email.split('@')[0],
      email,
      role: 'Kasir',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    };

    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLogoutConfirmOpen(false);
  };

  // Order Operations
  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>
  ): Order => {
    const newId = Date.now();
    const orderSeq = String(activeOrders.length + orderHistory.length + 1).padStart(3, '0');

    const today = new Date();
    const todayStr = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('');

    const orderNumber = `#SB-${todayStr}-${orderSeq}`;

    const newOrder: Order = {
      ...orderData,
      id: newId,
      orderNumber,
      createdAt: new Date().toISOString(),
    };

    setActiveOrders((prev) => [newOrder, ...prev]);
    setSelectedOrder(newOrder);

    // Update customer stats if name provided
    if (newOrder.customerName && newOrder.customerName !== 'Pelanggan Meja') {
      setCustomers((prev) => {
        const exist = prev.find(
          (c) => c.name.toLowerCase() === newOrder.customerName.toLowerCase()
        );

        if (exist) {
          return prev.map((c) =>
            c.id === exist.id
              ? {
                  ...c,
                  orderCount: c.orderCount + 1,
                  totalSpent: c.totalSpent + newOrder.total,
                }
              : c
          );
        }

        return [
          {
            id: Date.now(),
            name: newOrder.customerName,
            orderCount: 1,
            totalSpent: newOrder.total,
            lastOrderDate: new Date().toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            favoriteMenu: newOrder.items[0]?.menuName || 'Ayam Geprek',
          },
          ...prev,
        ];
      });
    }

    return newOrder;
  };

  // Perbaikan utama: pesanan selesai dipindahkan ke riwayat
  const updateOrderStatus = (orderId: number, newStatus: OrderStatus) => {
    const order = activeOrders.find((item) => item.id === orderId);

    if (!order) return;

    if (newStatus === 'Selesai') {
      const finishedOrder: Order = {
        ...order,
        status: 'Selesai',
        paymentStatus: 'Lunas',
      };

      // Hindari duplikasi berdasarkan ID pesanan
      setOrderHistory((prev) => [
        finishedOrder,
        ...prev.filter((item) => item.id !== orderId),
      ]);

      // Hapus pesanan dari daftar pesanan aktif
      const remainingOrders = activeOrders.filter((item) => item.id !== orderId);
      setActiveOrders(remainingOrders);

      // Pilih pesanan aktif berikutnya, jika ada
      setSelectedOrder((current) => {
        if (current?.id !== orderId) {
          return current;
        }

        return remainingOrders[0] ?? null;
      });

      return;
    }

    const updatedOrder: Order = {
      ...order,
      status: newStatus,
    };

    setActiveOrders((prev) =>
      prev.map((item) => (item.id === orderId ? updatedOrder : item))
    );

    setSelectedOrder((current) =>
      current?.id === orderId ? updatedOrder : current
    );
  };

  const cancelOrder = (orderId: number) => {
    const remainingOrders = activeOrders.filter((item) => item.id !== orderId);

    setActiveOrders(remainingOrders);

    setSelectedOrder((current) => {
      if (current?.id !== orderId) {
        return current;
      }

      return remainingOrders[0] ?? null;
    });
  };

  const saveOrderChanges = (updated: Order) => {
    setActiveOrders((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );

    setSelectedOrder((current) =>
      current?.id === updated.id ? updated : current
    );
  };

  // Menu Operations
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = { ...item, id: Date.now() };
    setMenuItems((prev) => [newItem, ...prev]);
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((menu) => (menu.id === item.id ? item : menu))
    );
  };

  const toggleMenuStatus = (id: number) => {
    setMenuItems((prev) =>
      prev.map((menu) =>
        menu.id === id
          ? {
              ...menu,
              status: menu.status === 'Tersedia' ? 'Habis' : 'Tersedia',
            }
          : menu
      )
    );
  };

  // Stock Operations
  const addStock = (id: number, amount: number, note?: string) => {
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const newCurrent = item.currentStock + amount;
        const newStatus =
          newCurrent <= 0
            ? 'Habis'
            : newCurrent <= item.minStock
              ? 'Menipis'
              : 'Aman';

        const newMovement = {
          id: Date.now(),
          type: 'Barang Masuk' as const,
          amount,
          unit: item.unit,
          date: new Date().toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          note: note || 'Penambahan stok manual',
        };

        return {
          ...item,
          currentStock: newCurrent,
          status: newStatus,
          lastUpdated: newMovement.date,
          movements: [newMovement, ...(item.movements || [])],
        };
      })
    );
  };

  const adjustStock = (id: number, newStock: number, note?: string) => {
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const diff = newStock - item.currentStock;
        const newStatus =
          newStock <= 0
            ? 'Habis'
            : newStock <= item.minStock
              ? 'Menipis'
              : 'Aman';

        const newMovement = {
          id: Date.now(),
          type: 'Penyesuaian' as const,
          amount: diff,
          unit: item.unit,
          date: new Date().toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          note: note || 'Penyesuaian stok fisik',
        };

        return {
          ...item,
          currentStock: newStock,
          status: newStatus,
          lastUpdated: newMovement.date,
          movements: [newMovement, ...(item.movements || [])],
        };
      })
    );
  };

  const updateSettings = (newSettings: WarungSettings) => {
    setSettings(newSettings);
  };

  // Modal helpers
  const openReceiptModal = (order: Order) => setReceiptOrder(order);
  const closeReceiptModal = () => setReceiptOrder(null);
  const openHelpModal = () => setIsHelpModalOpen(true);
  const closeHelpModal = () => setIsHelpModalOpen(false);
  const openForgotPassModal = () => setIsForgotPassModalOpen(true);
  const closeForgotPassModal = () => setIsForgotPassModalOpen(false);
  const openLogoutConfirm = () => setIsLogoutConfirmOpen(true);
  const closeLogoutConfirm = () => setIsLogoutConfirmOpen(false);
  const openSourceCodeModal = () => setIsSourceCodeModalOpen(true);
  const closeSourceCodeModal = () => setIsSourceCodeModalOpen(false);

  return (
    <WasibuContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        activeTab,
        setActiveTab,
        activeOrders,
        orderHistory,
        selectedOrder,
        setSelectedOrder,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        saveOrderChanges,
        menuItems,
        addMenuItem,
        updateMenuItem,
        toggleMenuStatus,
        stockItems,
        addStock,
        adjustStock,
        customers,
        monthlyReports,
        settings,
        updateSettings,
        searchQuery,
        setSearchQuery,
        receiptOrder,
        openReceiptModal,
        closeReceiptModal,
        isHelpModalOpen,
        openHelpModal,
        closeHelpModal,
        isForgotPassModalOpen,
        openForgotPassModal,
        closeForgotPassModal,
        isLogoutConfirmOpen,
        openLogoutConfirm,
        closeLogoutConfirm,
        isSourceCodeModalOpen,
        openSourceCodeModal,
        closeSourceCodeModal,
        notificationsCount: 3,
      }}
    >
      {children}
    </WasibuContext.Provider>
  );
};

export const useWasibu = () => {
  const context = useContext(WasibuContext);

  if (!context) {
    throw new Error('useWasibu must be used within a WasibuProvider');
  }

  return context;
};
