import React, { useState } from 'react';
import { X, Mail, Plus, Minus, HelpCircle } from 'lucide-react';
import { useWasibu } from '../../context/WasibuContext';

export const HelpCenterModal: React.FC = () => {
  const { isHelpModalOpen, closeHelpModal } = useWasibu();
  const [openIndex, setOpenIndex] = useState<number | null>(0); // 0 is Lupa Password as in prototype

  if (!isHelpModalOpen) return null;

  const faqs = [
    {
      q: 'Lupa Password',
      a: 'Klik "Lupa password?" di halaman login, masukkan email terdaftar, lalu ikuti tautan reset yang dikirim ke email Anda.',
    },
    {
      q: 'Email atau username tidak dikenali',
      a: 'Pastikan penulisan email atau username sudah benar tanpa spasi tambahan. Jika masih terkendala, hubungi owner atau administrator untuk memverifikasi akun Anda.',
    },
    {
      q: 'Akun terkunci setelah salah password',
      a: 'Demi keamanan, akun terkunci sementara jika salah password 5 kali berturut-turut. Tunggu 15 menit atau minta owner untuk membuka kunci akun dari menu Pengaturan.',
    },
    {
      q: 'Saya karyawan, bukan owner',
      a: 'Akun kasir dan staf operasional dibuatkan langsung oleh Owner Warung Si Bungsu. Silakan minta username dan kata sandi sementara kepada Owner warung.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Pusat Bantuan
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Ada kendala saat login? Cek solusi di bawah ini.
            </p>
          </div>
          <button
            onClick={closeHelpModal}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* FAQ Accordions */}
        <div className="p-6 pt-3 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl overflow-hidden transition-all bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-medium text-gray-800 hover:bg-gray-50/80 transition-colors"
                >
                  <span className="text-sm font-semibold">{faq.q}</span>
                  <span className="text-gray-400 ml-2">
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-orange-500" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs md:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-orange-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}

          {/* Contact Support */}
          <div className="pt-4 border-t border-gray-100 mt-6 text-center">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              Masih butuh bantuan? Hubungi kami
            </p>
            <a
              href="mailto:bantuan@wasibu.id?subject=Bantuan%20Sistem%20WASIBU"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5722] hover:bg-[#E64A19] text-white font-semibold rounded-xl shadow-sm transition-all duration-150 active:scale-[0.99]"
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </a>
            <p className="text-xs text-gray-400 mt-3">
              Layanan bantuan: Senin – Sabtu, 08.00 – 17.00 WIB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
