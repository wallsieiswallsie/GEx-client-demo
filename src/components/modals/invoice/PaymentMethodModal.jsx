import React, { useState } from "react";

function PaymentMethodModal({ isOpen, onClose, onSubmit }) {
  const [paymentMethod, setPaymentMethod] = useState("");

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Pilih Metode Pembayaran</h3>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              className="radio radio-primary"
              value="Qris"
              checked={paymentMethod === "Qris"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>Qris</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              className="radio radio-primary"
              value="Transfer Bank"
              checked={paymentMethod === "Transfer Bank"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>Transfer Bank</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              className="radio radio-primary"
              value="Tunai"
              checked={paymentMethod === "Tunai"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>Tunai</span>
          </label>
        </div>

        <div className="modal-action mt-6">
          <button className="btn" onClick={onClose}>
            Batal
          </button>
          <button
            className="btn btn-primary"
            disabled={!paymentMethod}
            onClick={() => onSubmit(paymentMethod)}
          >
            Selesaikan
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default PaymentMethodModal;