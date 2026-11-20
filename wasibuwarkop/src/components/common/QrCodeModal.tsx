import React, { useState } from 'react';
import { X, QrCode, Printer, Download } from 'lucide-react';
import { useWasibu } from '../../context/WasibuContext';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useWasibu();
  const [selectedTable, setSelectedTable] = useState('Meja 05');

  if (!isOpen) return null;

  const tables = Array.from({ length: settings.totalTables }).map((_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `Meja ${num}`;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF5722] flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">QR Code Meja Pelanggan</h3>
              <p className="text-xs text-gray-500">
                Pindai untuk memesan langsung dari meja tanpa antre
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Selector */}
        <div className="py-4">
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Pilih Nomor Meja:
          </label>
          <div className="grid grid-cols-5 gap-2">
            {tables.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTable(t)}
                className={`py-2 text-xs font-semibold rounded-lg border transition ${
                  selectedTable === t
                    ? 'bg-[#FF5722] text-white border-[#FF5722] shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* QR Code Stand Preview */}
        <div className="p-6 bg-gradient-to-b from-orange-50/50 to-orange-100/40 rounded-xl border border-orange-200/60 flex flex-col items-center text-center">
          <div className="inline-block px-3 py-1 bg-[#FF5722] text-white text-[11px] font-bold rounded-full mb-2 uppercase tracking-wider">
            Warung Si Bungsu
          </div>
          <h4 className="text-xl font-black text-gray-900">{selectedTable}</h4>
          <p className="text-xs text-gray-600 mb-4">
            Scan untuk melihat menu & memesan makanan
          </p>

          {/* QR visual with logo in center */}
          <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center justify-center relative">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                `https://wasibu.id/order?table=${selectedTable}`
              )}`}
              alt={`QR ${selectedTable}`}
              className="w-full h-full object-contain"
            />
          </div>

          <p className="text-[11px] text-gray-500 mt-4">
            Atau akses web: <strong className="text-gray-800">wasibu.id/order</strong>
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak QR Meja</span>
          </button>
        </div>
      </div>
    </div>
  );
};
