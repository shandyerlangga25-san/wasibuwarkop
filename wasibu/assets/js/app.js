/**
 * WASIBU (Warung Si Bungsu) - JavaScript Interactivity
 * File: assets/js/app.js
 */

document.addEventListener('DOMContentLoaded', function () {
  // Utility: Modal Open/Close
  window.openModal = function (modalId) {
    const el = document.getElementById(modalId);
    if (el) el.style.display = 'flex';
  };

  window.closeModal = function (modalId) {
    const el = document.getElementById(modalId);
    if (el) el.style.display = 'none';
  };

  // Close modals on escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
    }
  });

  // Copy order number helper
  window.copyText = function (text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Nomor pesanan ' + text + ' berhasil disalin!');
    }).catch(err => {
      console.error('Gagal menyalin text', err);
    });
  };

  // Thermal Receipt Printing
  window.printReceipt = function () {
    window.print();
  };
});
