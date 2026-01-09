import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Payment = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState("card");

  const paymentMethods = useMemo(
    () => [
      {
        value: "card",
        label: "Card",
        description: "Visa, Mastercard, AMEX",
      },
      {
        value: "bank",
        label: "Bank Transfer",
        description: "Pay via bank account transfer",
      },
      {
        value: "cod",
        label: "Cash on Delivery",
        description: "Pay when the item is delivered",
      },
    ],
    []
  );

  const handlePayment = async () => {
    if (!orderId) return;

    setProcessing(true);

    try {
      const transactionId = `txn_${Date.now()}`;

      const res = await axiosSecure.post("/payments", {
        orderId,
        paymentId: transactionId,
        method, 
      });

      toast.success(
        `Payment completed successfully via ${method.toUpperCase()}. Amount paid: $${Number(
          res.data.amount
        ).toFixed(2)}`
      );

      navigate("/dashboard/invoices");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Payment could not be processed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-secondary)] bg-[var(--bc-surface)] p-8 shadow-sm">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-[var(--color-primary)]">
            Confirm Payment
          </h2>

          <p className="mb-6 text-sm text-[color:var(--bc-text)]/80">
            Select a payment method and confirm your payment. Once completed, the
            order status will be updated to{" "}
            <span className="font-semibold text-[var(--bc-accent)]">Paid</span>.
          </p>
        </div>

        <div className="mb-5 rounded-xl border border-[var(--color-secondary)] bg-[var(--bc-bg)] p-4">
          <p className="text-xs text-[color:var(--bc-text)]/60">Order Reference</p>
          <p className="mt-1 break-all text-sm font-semibold text-[var(--bc-text)]">
            {orderId}
          </p>
        </div>
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold text-[var(--bc-text)]">
            Payment Method
          </p>

          <div className="space-y-3">
            {paymentMethods.map((pm) => {
              const active = method === pm.value;

              return (
                <button
                  type="button"
                  key={pm.value}
                  onClick={() => setMethod(pm.value)}
                  className={`w-full rounded-xl border p-4 text-left transition
                    ${
                      active
                        ? "border-[var(--bc-accent)] bg-[color:var(--bc-accent)]/10"
                        : "border-[var(--color-secondary)] bg-[var(--bc-bg)] hover:bg-[var(--color-secondary)]/30"
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--bc-text)]">
                        {pm.label}
                      </p>
                      <p className="mt-1 text-xs text-[color:var(--bc-text)]/70">
                        {pm.description}
                      </p>
                    </div>

                    <span
                      className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border
                        ${
                          active
                            ? "border-[var(--bc-accent)]"
                            : "border-[var(--color-secondary)]"
                        }`}
                    >
                      {active ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-[var(--bc-accent)]" />
                      ) : null}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mt-2 text-xs text-[color:var(--bc-text)]/60">
            Selected:{" "}
            <span className="font-semibold text-[var(--bc-text)]">
              {paymentMethods.find((m) => m.value === method)?.label}
            </span>
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={processing}
          className={`w-full rounded-xl px-6 py-3 font-semibold text-white transition
            ${
              processing
                ? "cursor-not-allowed opacity-60 bg-[var(--bc-accent)]"
                : "bg-[var(--bc-accent)] hover:opacity-90"
            }`}
        >
          {processing ? "Processing Payment..." : "Confirm & Pay"}
        </button>

        <button
          onClick={() => navigate("/dashboard/my-orders")}
          className="mt-3 w-full rounded-xl border border-[var(--color-secondary)] bg-[var(--bc-bg)] px-6 py-3 font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-secondary)]"
        >
          Back to My Orders
        </button>
      </div>
    </div>
  );
};

export default Payment;
