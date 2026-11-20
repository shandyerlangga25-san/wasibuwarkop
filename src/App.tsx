
import React, { useEffect, useState } from 'react';
import { WasibuProvider, useWasibu } from './context/WasibuContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';
import { ResetPasswordView } from './components/common/ResetPasswordView';
import { PesananAktifView } from './components/modules/PesananAktifView';
import { RiwayatPesananView } from './components/modules/RiwayatPesananView';
import { MenuProdukView } from './components/modules/MenuProdukView';
import { StokBarangView } from './components/modules/StokBarangView';
import { PelangganView } from './components/modules/PelangganView';
import { LaporanView } from './components/modules/LaporanView';
import { PengaturanView } from './components/modules/PengaturanView';
import { ReceiptModal } from './components/common/ReceiptModal';
import { HelpCenterModal } from './components/common/HelpCenterModal';
import { ForgotPasswordModal } from './components/common/ForgotPasswordModal';
import { LogoutConfirmModal } from './components/common/LogoutConfirmModal';
import { PhpCodeViewerModal } from './components/common/PhpCodeViewerModal';
import PesananUser from './components/modules/PesananUser';

type AuthScreen = 'login' | 'register' | 'reset';

const AppContent: React.FC = () => {
  const {
  currentUser,
  activeTab,
  createOrder,
  logout,
} = useWasibu();

 const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

const [appView, setAppView] = useState<'user' | 'admin'>(() => {
  return window.location.pathname === '/admin' ? 'admin' : 'user';
});

// Jika membuka /admin, pastikan pengguna harus login kembali
useEffect(() => {
  if (window.location.pathname === '/admin') {
    logout();
  }
}, []);
  // Halaman pemesanan pelanggan
  if (appView === 'user') {
    return (
     <div className="min-h-screen">

    <button
 onClick={() => {
  logout();
  window.history.pushState({}, '', '/admin');
  setAppView('admin');
  setAuthScreen('login');
}}
  

/>


 

        <PesananUser
          menus={[]}
          createOrder={(order) => {
            const now = new Date();

            // Ubah format item pelanggan menjadi format Order aplikasi
            const orderItems = order.items.map((item, index) => ({
              id: index + 1,
              menuId: Number(item.menuId),
              menuName: item.name,
              qty: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity,
            }));

            // Simpan pesanan ke WasibuContext
            createOrder({
              tableNumber: order.tableNumber,
              customerName: order.customerName || 'Pelanggan Meja',
              orderTime: now.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              orderDate: now.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
              source: 'QR',
              status: 'Baru',
              paymentStatus: order.paymentStatus,
              paymentMethod: order.paymentMethod,
              referenceNumber: '',
              items: orderItems,
              notes: order.notes,
              subtotal: order.total,
              discount: 0,
              tax: 0,
              total: order.total,
            });

            // Pesanan otomatis masuk ke activeOrders
            
          }}
        />
      </div>
    );
  }

  // Login admin
 if (!currentUser) {
    if (authScreen === 'register') {
      return (
        <>
          <RegisterView onBackToLogin={() => setAuthScreen('login')} />
          <HelpCenterModal />
          <ForgotPasswordModal
            onGoToReset={() => setAuthScreen('reset')}
          />
        </>
      );
    }

    if (authScreen === 'reset') {
      return (
        <>
          <ResetPasswordView
            onBackToLogin={() => setAuthScreen('login')}
          />
          <HelpCenterModal />
        </>
      );
    }

    return (
      <>
        <LoginView
          onGoToRegister={() => setAuthScreen('register')}
        />
        <HelpCenterModal />
        <ForgotPasswordModal
          onGoToReset={() => setAuthScreen('reset')}
        />
      </>
    );
  }

  // Dashboard admin
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FA] text-gray-900 font-sans antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'pesanan' && <PesananAktifView />}
          {activeTab === 'riwayat' && <RiwayatPesananView />}
          {activeTab === 'menu' && <MenuProdukView />}
          {activeTab === 'stok' && <StokBarangView />}
          {activeTab === 'pelanggan' && <PelangganView />}
          {activeTab === 'laporan' && <LaporanView />}
          {activeTab === 'pengaturan' && <PengaturanView />}
        </div>
      </div>

      <ReceiptModal />
      <HelpCenterModal />
      <ForgotPasswordModal
        onGoToReset={() => setAuthScreen('reset')}
      />
      <LogoutConfirmModal />
      <PhpCodeViewerModal />
    </div>
  );
};

export default function App() {
  return (
    <WasibuProvider>
      <AppContent />
    </WasibuProvider>
  );
}
