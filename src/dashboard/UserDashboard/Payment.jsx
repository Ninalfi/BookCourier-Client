import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Payment = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const handlePay = async () => {
    try {
      const paymentId = `demo_${Date.now()}`;

const res = await axiosSecure.post("/payments", {
  orderId: id,
  paymentId,
});

toast.success(`Payment successful! Amount: $${Number(res.data.amount).toFixed(2)}`);
      navigate("/dashboard/invoices");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Payment failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="bg-[var(--bc-surface)] border border-[var(--color-secondary)] p-8 rounded-2xl shadow-sm w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-3 text-[var(--color-primary)]">
          Payment Confirmation
        </h2>

        <p className="mb-6 text-[color:var(--bc-text)]/85">
          Confirm payment for this order. After payment, the order payment status will be updated to{" "}
          <span className="font-semibold text-[var(--bc-accent)]">Paid</span>.
        </p>

        <div className="mb-6 rounded-xl bg-[var(--bc-bg)] border border-[var(--color-secondary)] p-4 text-left">
          <p className="text-xs text-[color:var(--bc-text)]/70">Order ID</p>
          <p className="text-sm font-semibold text-[var(--bc-text)] break-all">{id}</p>
        </div>

        <button onClick={handlePay} className="w-full bg-[var(--bc-accent)] hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition"
        >Confirm Payment</button>

        <button onClick={() => navigate("/dashboard/my-orders")}
          className="w-full mt-3 bg-[var(--bc-bg)] hover:bg-[var(--color-secondary)] text-[var(--color-primary)] px-6 py-3 rounded-xl font-semibold border border-[var(--color-secondary)] transition"
        > Back to My Orders
        </button>
      </div>
    </div>
  );
};

export default Payment;
