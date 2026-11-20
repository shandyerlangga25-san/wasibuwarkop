import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  Package,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { useWasibu } from '../../context/WasibuContext';
import { WasibuLogo } from '../common/Logo';
import { heroFoodImg } from '../../data/initialData';

interface LoginViewProps {
  onGoToRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onGoToRegister }) => {
  const { login, openHelpModal, openForgotPassModal } = useWasibu();
  const [emailOrUser, setEmailOrUser] = useState('admin');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(emailOrUser, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Login gagal.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Top Bar with Help Trigger */}
      <div className="w-full flex justify-end p-4 pr-8 absolute top-0 right-0 z-10">
        <button
          type="button"
          onClick={openHelpModal}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-orange-600 transition bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-gray-200/60 shadow-xs"
        >
          <HelpCircle className="w-4 h-4 text-orange-500" />
          <span>Butuh bantuan?</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-stretch">
        {/* Left Side: Brand & Hero Showcase matching Slide 1 */}
        <div className="lg:w-1/2 relative min-h-[420px] lg:min-h-full flex flex-col justify-between p-8 lg:p-14 text-white overflow-hidden bg-gray-900">
          {/* Background Image with warm dark gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroFoodImg}
              alt="Warung Si Bungsu culinary"
              className="w-full h-full object-cover opacity-35 scale-105 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/70" />
          </div>

          {/* Logo at Top Left */}
          <div className="relative z-10">
            <WasibuLogo variant="dark" size="lg" showMerchant={true} />
          </div>

          {/* Headline & Value Propositions matching slide 1 */}
          <div className="relative z-10 my-auto py-8 max-w-lg">
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white mb-3">
              Selamat Datang <br />
              <span className="text-[#FF7A00]">Admin Warung Si Bungsu!</span>
            </h1>
            <p className="text-sm lg:text-base text-gray-300 mb-8 leading-relaxed">
              Login untuk mengakses dashboard manajemen dan mengelola bisnis Anda.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/40 text-[#FF5722] flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Kelola Bisnis</h4>
                  <p className="text-xs text-gray-300">
                    Pantau penjualan, produk, dan laporan bisnis secara real-time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/40 text-[#FF5722] flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Manajemen Mudah</h4>
                  <p className="text-xs text-gray-300">
                    Kelola stok, pesanan, pelanggan, dan karyawan dengan mudah.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/40 text-[#FF5722] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Keamanan Terjamin</h4>
                  <p className="text-xs text-gray-300">
                    Sistem aman dan data bisnis Anda terindungi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Left Footer copyright */}
          <div className="relative z-10 text-xs text-gray-400 pt-4 border-t border-white/10">
            © 2026 Warung Si Bungsu. All rights reserved.
          </div>
        </div>

        {/* Right Side: Login Form Card matching Slide 1 */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-14 bg-gray-50/70">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100">
            {/* Top lock icon */}
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 text-[#FF5722] flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Lock className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Login Admin</h2>
              <p className="text-xs text-gray-500 mt-1">
                Masuk ke akun admin untuk mengakses sistem manajemen Warung Si Bungsu
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-medium flex items-center gap-2 border border-red-100 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email / Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={emailOrUser}
                    onChange={(e) => setEmailOrUser(e.target.value)}
                    placeholder="Masukkan email atau username"
                    required
                    className="w-full px-4 py-3 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 pr-10"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    required
                    className="w-full px-4 py-3 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 absolute right-3.5 top-3.5 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <span>Ingat saya</span>
                </label>

                <button
                  type="button"
                  onClick={openForgotPassModal}
                  className="font-semibold text-orange-600 hover:text-orange-700 transition"
                >
                  Lupa password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#FF5722] to-[#E64A19] hover:from-[#E64A19] hover:to-[#D84315] text-white font-bold rounded-xl text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition duration-150 active:scale-[0.99] cursor-pointer"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative my-5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <span className="relative bg-white px-3 text-xs text-gray-400">atau</span>
              </div>

              {/* Informational Callout matching Slide 1 */}
              <div className="p-4 bg-orange-50/60 border border-orange-100/80 rounded-2xl flex items-start gap-3 text-left">
                <ShieldCheck className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-gray-800">Bukan admin?</h5>
                  <p className="text-[11px] text-gray-500 leading-snug mt-0.5">
                    Halaman ini khusus untuk owner dan karyawan. Silakan hubungi owner untuk
                    mendapatkan akses.
                  </p>
                </div>
              </div>

              {/* Register link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onGoToRegister}
                  className="text-xs font-semibold text-gray-600 hover:text-orange-600 transition"
                >
                  Belum punya akun? <span className="text-orange-600 underline">Daftar Akun Baru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
