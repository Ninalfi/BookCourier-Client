import React from "react";

const OrderModal = ({
  showModal,
  setShowModal,
  orderData,
  handleChange,
  placeOrder,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-[var(--bc-surface)] p-6 shadow-xl border border-[var(--bc-border)]">
        
        {/* Header */}
        <h2 className="mb-4 text-2xl font-bold text-[var(--color-primary)]">
          Place Your Order
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          value={orderData.name}
          readOnly
          className="w-full mb-3 rounded-md border border-[var(--bc-border)] bg-[var(--bc-muted)] p-2 text-[var(--bc-text)] cursor-not-allowed"
          placeholder="Name"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          value={orderData.email}
          readOnly
          className="w-full mb-3 rounded-md border border-[var(--bc-border)] bg-[var(--bc-muted)] p-2 text-[var(--bc-text)] cursor-not-allowed"
          placeholder="Email"
        />

        {/* Phone */}
        <input
          type="text"
          name="phone"
          value={orderData.phone}
          onChange={handleChange}
          className="w-full mb-3 rounded-md border border-[var(--bc-border)] bg-transparent p-2 text-[var(--bc-text)] focus:border-[var(--color-primary)] focus:outline-none"
          placeholder="Phone Number"
        />

        {/* Address */}
        <textarea
          name="address"
          value={orderData.address}
          onChange={handleChange}
          rows="3"
          className="w-full mb-3 rounded-md border border-[var(--bc-border)] bg-transparent p-2 text-[var(--bc-text)] focus:border-[var(--color-primary)] focus:outline-none"
          placeholder="Address"
        />

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="rounded-md border border-[var(--bc-border)] px-4 py-2 text-[var(--bc-text)] hover:bg-[var(--bc-muted)] transition"
          >
            Cancel
          </button>

          <button
            onClick={placeOrder}
            className="rounded-md bg-[var(--bc-accent)] px-4 py-2 font-semibold text-white hover:bg-[var(--color-primary)] transition"
          >
            Place Order
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderModal;
