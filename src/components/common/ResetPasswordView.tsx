import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';

interface ResetPasswordViewProps {
  onBackToLogin: () => void;
}

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({ onBackToLogin }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('Harap isi password baru dan konfirmasi password.');
      return;
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }
    setError('');
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Top orange decorative bar matching Slide 4 */}
      <div className="h-20 bg-[#FF5722] w-full" />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-10 border border-gray-100 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Masukan Password baru anda :
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium text-left border border-red-100">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-4 py-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Password Berhasil Diubah!</h2>
              <p className="text-sm text-gray-500">
                Silakan masuk kembali menggunakan password baru Anda.
              </p>
              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full mt-4 py-3.5 bg-[#FF5722] hover:bg-[#E64A19] text-white font-semibold rounded-xl transition duration-150 shadow-sm"
              >
                Kembali ke Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="text-left space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukan Password Baru"
                    required
                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Masukan Konfirmasi Password Baru"
                    required
                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#FF5722] hover:bg-[#E64A19] text-white font-semibold rounded-xl transition duration-150 shadow-md text-base mt-2 active:scale-[0.99]"
              >
                Reset Password
              </button>

              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-800 text-center font-medium"
              >
                Batal dan Kembali ke Login
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="text-center py-6 text-xs text-gray-400">
        © 2026 Warung Si Bungsu. All rights reserved.
      </footer>
    </div>
  );
};
