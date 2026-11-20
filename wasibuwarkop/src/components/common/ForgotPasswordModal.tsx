import React, { useState } from 'react';
import { X, Mail, CheckCircle2 } from 'lucide-react';
import { useWasibu } from '../../context/WasibuContext';

interface ForgotPasswordModalProps {
  onGoToReset?: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onGoToReset }) => {
  const { isForgotPassModalOpen, closeForgotPassModal } = useWasibu();
  const [email, setEmail] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isForgotPassModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSentSuccess(true);
  };

  const handleResetDirect = () => {
    closeForgotPassModal();
    if (onGoToReset) {
      onGoToReset(email || 'admin@wasibu.id');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 text-center">
        <button
          onClick={closeForgotPassModal}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {!sentSuccess ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Lupa Password?</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Masukkan email akunmu. Kami akan mengirim tautan untuk mengatur ulang password.
            </p>

            <form onSubmit={handleSubmit} className="text-left space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email"
                    required
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 bg-[#FF5722] hover:bg-[#E64A19] text-white font-semibold rounded-xl transition duration-150 shadow-sm"
              >
                Kirim Petunjuk
              </button>

              <button
                type="button"
                onClick={closeForgotPassModal}
                className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 transition duration-150"
              >
                Kembali ke Halaman login
              </button>
            </form>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Petunjuk Terkirim!</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Tautan atur ulang password telah dikirim ke{' '}
              <strong className="text-gray-900">{email}</strong>.
            </p>
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleResetDirect}
                className="w-full py-3 bg-[#FF5722] hover:bg-[#E64A19] text-white font-semibold rounded-xl transition"
              >
                Lanjut ke Form Reset Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setSentSuccess(false);
                  closeForgotPassModal();
                }}
                className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-800"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
