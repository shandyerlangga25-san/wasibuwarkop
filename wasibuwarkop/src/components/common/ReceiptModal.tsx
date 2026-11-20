import React, { useRef } from 'react';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import { useWasibu } from '../../context/WasibuContext';
import { WasibuLogo } from './Logo';

export const ReceiptModal: React.FC = () => {
  const { receiptOrder, closeReceiptModal, settings } = useWasibu();
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!receiptOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSaveTextReceipt = () => {
    // Generate text receipt download
    const lines = [
      '==========================================',
      `          ${settings.storeName.toUpperCase()}          `,
      '==========================================',
      settings.address,
      `Telp: ${settings.phone} | IG: ${settings.instagram}`,
      '------------------------------------------',
      `No. Pesanan : ${receiptOrder.orderNumber}`,
      `Tanggal     : ${receiptOrder.orderDate} ${receiptOrder.orderTime}`,
      `Kasir       : ${receiptOrder.cashierName || 'Admin'}`,
      `Pelanggan   : ${receiptOrder.customerName || '-'}`,
      `Meja        : ${receiptOrder.tableNumber}`,
      `Pembayaran  : ${receiptOrder.paymentMethod} (${receiptOrder.paymentStatus})`,
      '------------------------------------------',
      ...receiptOrder.items.map(
        (it, idx) =>
          `${idx + 1}. ${it.menuName}\n   ${it.qty} x Rp${it.price.toLocaleString('id-ID')} = Rp${it.subtotal.toLocaleString('id-ID')}`
      ),
      '------------------------------------------',
      `Subtotal    : Rp${receiptOrder.subtotal.toLocaleString('id-ID')}`,
      `Diskon      : -Rp${receiptOrder.discount.toLocaleString('id-ID')}`,
      `Pajak (0%)  : Rp${receiptOrder.tax.toLocaleString('id-ID')}`,
      `TOTAL       : Rp${receiptOrder.total.toLocaleString('id-ID')}`,
      receiptOrder.cashReceived
        ? `Tunai       : Rp${receiptOrder.cashReceived.toLocaleString('id-ID')}`
        : '',
      receiptOrder.cashChange
        ? `Kembalian   : Rp${receiptOrder.cashChange.toLocaleString('id-ID')}`
        : '',
      '------------------------------------------',
      '       Terima kasih sudah berkunjung      ',
      `     ${settings.phone} | ${settings.instagram}     `,
      `           ${receiptOrder.referenceNumber}        `,
      '==========================================',
    ]
      .filter(Boolean)
      .join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Struk-${receiptOrder.orderNumber.replace(/#/g, '')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl my-8 overflow-hidden border border-gray-100 flex flex-col">
        {/* Header alert */}
        <div className="p-6 pb-4 flex items-start gap-4 border-b border-gray-100 bg-orange-50/40">
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              Pesanan Berhasil Dibuat
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Struk siap dicetak atau disimpan.
            </p>
          </div>
          <button
            onClick={closeReceiptModal}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Realistic Thermal Receipt Body */}
        <div className="p-6 bg-gray-100/60 overflow-y-auto max-h-[60vh] flex justify-center">
          <div
            ref={printAreaRef}
            id="thermal-receipt"
            className="w-full max-w-[340px] bg-white p-6 shadow-md rounded-lg font-mono text-[11px] leading-relaxed text-gray-800 border border-gray-200"
            style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
          >
            {/* Store brand */}
            <div className="text-center pb-3 flex flex-col items-center">
              <WasibuLogo variant="light" size="md" />
              <p className="text-[10px] text-gray-500 mt-2 px-1 leading-snug">
                {settings.address}
              </p>
              <div className="flex items-center justify-center gap-2 text-[9px] text-gray-500 mt-1">
                <span>📞 {settings.phone}</span>
                <span>•</span>
                <span>📷 {settings.instagram}</span>
              </div>
            </div>

            <div className="border-b border-dashed border-gray-300 my-2" />

            {/* Order meta */}
            <div className="space-y-1 text-[10px] text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">No. Pesanan</span>
                <span className="font-bold text-gray-900">{receiptOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tanggal</span>
                <span>
                  {receiptOrder.orderDate} • {receiptOrder.orderTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Kasir</span>
                <span>{receiptOrder.cashierName || 'Admin'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pelanggan</span>
                <span className="font-medium">{receiptOrder.customerName || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Meja</span>
                <span className="font-bold text-orange-600">{receiptOrder.tableNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Metode Pembayaran</span>
                <span>{receiptOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status Pembayaran</span>
                <span className="font-semibold text-emerald-600">{receiptOrder.paymentStatus}</span>
              </div>
            </div>

            <div className="border-b border-dashed border-gray-300 my-3" />

            {/* Items table */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-[10px] font-bold text-gray-500 pb-1 border-b border-gray-200">
                <span className="col-span-1">No.</span>
                <span className="col-span-5">Nama Menu</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-4 text-right">Subtotal</span>
              </div>

              {receiptOrder.items.map((item, idx) => (
                <div key={item.id || idx} className="grid grid-cols-12 text-[10px] py-0.5">
                  <span className="col-span-1 text-gray-400">{idx + 1}</span>
                  <div className="col-span-5 font-medium leading-tight">
                    {item.menuName}
                    <div className="text-[9px] text-gray-400 font-normal">
                      @Rp{item.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                  <span className="col-span-2 text-center font-semibold">{item.qty}</span>
                  <span className="col-span-4 text-right font-medium">
                    Rp{item.subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-b border-dashed border-gray-300 my-3" />

            {/* Calculations */}
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rp{receiptOrder.subtotal.toLocaleString('id-ID')}</span>
              </div>
              {receiptOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Diskon</span>
                  <span>- Rp{receiptOrder.discount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Pajak (0%)</span>
                <span>Rp{receiptOrder.tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-gray-900 pt-1 border-t border-gray-200">
                <span>Total</span>
                <span className="text-[#FF5722]">Rp{receiptOrder.total.toLocaleString('id-ID')}</span>
              </div>

              {receiptOrder.paymentMethod === 'Tunai' && (
                <>
                  <div className="flex justify-between text-gray-600 pt-1">
                    <span>Tunai</span>
                    <span>
                      Rp{(receiptOrder.cashReceived || receiptOrder.total).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Kembalian</span>
                    <span>Rp{(receiptOrder.cashChange || 0).toLocaleString('id-ID')}</span>
                  </div>
                </>
              )}
            </div>

            <div className="border-b border-dashed border-gray-300 my-4" />

            {/* Footer */}
            <div className="text-center space-y-1 text-[9px] text-gray-500">
              <p className="font-semibold text-gray-700">Terima kasih sudah berkunjung</p>
              <p>
                {settings.phone} | {settings.instagram}
              </p>
              <p className="text-[8px] tracking-wider text-gray-400 uppercase mt-2">
                {receiptOrder.orderNumber.replace(/#/g, '')}-{receiptOrder.referenceNumber}
              </p>
              {/* Barcode visual */}
              <div className="w-44 h-7 mx-auto mt-2 bg-repeating-linear-stripes opacity-70 flex items-end justify-center pb-0.5">
                <div className="flex justify-center gap-0.5 w-full h-5">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-full ${
                        i % 3 === 0 ? 'w-1 bg-black' : i % 2 === 0 ? 'w-0.5 bg-black' : 'w-0.5 bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer buttons matching Slide 8 */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-white">
          <button
            type="button"
            onClick={closeReceiptModal}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition"
          >
            Tutup
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveTextReceipt}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl transition"
            >
              <Download className="w-4 h-4" />
              <span>Simpan PDF</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white font-semibold text-xs rounded-xl shadow-sm transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Struk</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
