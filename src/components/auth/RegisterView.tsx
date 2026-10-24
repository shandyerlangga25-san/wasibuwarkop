import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  TrendingUp,
  Package,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { useWasibu } from '../../context/WasibuContext';
import { WasibuLogo } from '../common/Logo';
import { heroFoodImg } from '../../data/initialData';

interface RegisterViewProps {
  onBackToLogin: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onBackToLogin }) => {
  const { register, openHelpModal } = useWasibu();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!agreeTerms) {
      setErrorMsg('Anda harus menyetujui syarat & ketentuan.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok.');
      return;
    }
    const res = register(fullName, email, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Pendaftaran gagal.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Help button at top right */}
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
        {/* Left Side: Brand & Hero Showcase matching Slide 5 */}
        <div className="lg:w-1/2 relative min-h-[380px] lg:min-h-full flex flex-col justify-between p-8 lg:p-14 text-white overflow-hidden bg-gray-900">
          <div className="absolute inset-0 z-0">
            <img
              src={heroFoodImg}
              alt="Warung Si Bungsu culinary"
              className="w-full h-full object-cover opacity-35 scale-105 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/70" />
          </div>

          <div className="relative z-10">
            <WasibuLogo variant="dark" size="lg" showMerchant={true} />
          </div>

          <div className="relative z-10 my-auto py-8 max-w-lg">
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white mb-3">
              Selamat Datang <br />
              <span className="text-[#FF7A00]">Owner Warung Si Bungsu!</span>
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

          <div className="relative z-10 text-xs text-gray-400 pt-4 border-t border-white/10">
            © 2026 Warung Si Bungsu. All rights reserved.
          </div>
        </div>

        {/* Right Side: Register Form matching Slide 5 */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-14 bg-gray-50/70">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100">
            {/* User Icon */}
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 text-[#FF5722] flex items-center justify-center mx-auto mb-4 shadow-xs">
              <User className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Buat Akun Baru</h2>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-medium flex items-center gap-2 border border-red-100 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    required
                    className="w-full px-4 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 pr-10"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukan email anda"
                    required
                    className="w-full px-4 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 pr-10"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukan Password (min. 8 karakter)"
                    required
                    className="w-full px-4 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 absolute right-3.5 top-3 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Konfirmasi Password anda"
                    required
                    className="w-full px-4 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 absolute right-3.5 top-3 p-0.5"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300 mt-0.5"
                  />
                  <span>
                    Saya setuju dengan{' '}
                    <span className="text-orange-600 underline">syarat ketentuan</span> &amp;{' '}
                    <span className="text-orange-600 underline">kebijakan Privasi</span>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-gradient-to-r from-[#FF5722] to-[#E64A19] hover:from-[#E64A19] hover:to-[#D84315] text-white font-bold rounded-xl text-sm shadow-md shadow-orange-500/20 transition active:scale-[0.99] cursor-pointer"
              >
                Daftar
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <span className="relative bg-white px-3 text-xs text-gray-400">
                  atau daftar dengan
                </span>
              </div>

            

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-xs font-semibold text-gray-600 hover:text-orange-600 transition"
                >
                  Sudah punya akun? <span className="text-orange-600 underline">Login di sini</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
