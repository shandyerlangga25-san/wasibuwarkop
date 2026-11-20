import React, { useState } from 'react';
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

type AuthScreen = 'login' | 'register' | 'reset';

const AppContent: React.FC = () => {
  const { currentUser, activeTab } = useWasibu();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  // If user is not logged in, render authentication screens matching Slides 1, 2, 3, 4, 5
  if (!currentUser) {
    if (authScreen === 'register') {
      return (
        <>
          <RegisterView onBackToLogin={() => setAuthScreen('login')} />
          <HelpCenterModal />
          <ForgotPasswordModal onGoToReset={() => setAuthScreen('reset')} />
        </>
      );
    }
    if (authScreen === 'reset') {
      return (
        <>
          <ResetPasswordView onBackToLogin={() => setAuthScreen('login')} />
          <HelpCenterModal />
        </>
      );
    }
    return (
      <>
        <LoginView onGoToRegister={() => setAuthScreen('register')} />
        <HelpCenterModal />
        <ForgotPasswordModal onGoToReset={() => setAuthScreen('reset')} />
      </>
    );
  }

  // If user is logged in, render main layout with active module
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FA] text-gray-900 font-sans antialiased">
      {/* Dark Sidebar matching Slide 6, 11, 13, 16, 18, 19, 20 */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Scrollable Viewport */}
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

      {/* Modals & Dialogs */}
      <ReceiptModal />
      <HelpCenterModal />
      <ForgotPasswordModal onGoToReset={() => setAuthScreen('reset')} />
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
