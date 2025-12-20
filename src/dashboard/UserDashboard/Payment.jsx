import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";


const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handlePay = async () => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken(true);

      await axios.put(
        `http://localhost:3000/users/payment/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Payment successful!");
      navigate("/dashboard/orders"); // Navigate back to My Orders
    } catch (err) {
      toast.error("Payment failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-[var(--bc-surface)] p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)]">
          Payment for Order
        </h2>
        <p className="mb-6 text-[var(--bc-text)]">
          Please confirm your payment for this order. Once paid, your order status will be updated.
        </p>
        <button
          onClick={handlePay}
          className="w-full bg-[var(--bc-accent)] hover:bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default Payment;
