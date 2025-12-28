import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function MyOrders() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const safeOrders = useMemo(() => (Array.isArray(orders) ? orders : []), [orders]);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);

      const res = await axiosSecure.get("/orders/my");
      const data = res.data;
      const list = Array.isArray(data) ? data : data?.orders || [];

      setOrders(list);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const cancelOrder = async (id) => {
  try {
    await axiosSecure.patch(`/orders/${id}`, { orderStatus: "cancelled" });

    setOrders((prev) =>
      (Array.isArray(prev) ? prev : []).map((o) =>
        o._id === id ? { ...o, orderStatus: "cancelled" } : o
      )
    );
  } catch (err) {
    console.error("Cancel order error:", err);
  }
};

  const payNow = (id) => {
    navigate(`/dashboard/payments/${id}`);
  };

  return (
    <div className="bg-[var(--bc-surface)] border border-[var(--color-secondary)] p-5 rounded-2xl shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[var(--bc-text)]">My Orders</h2>
        <button onClick={fetchOrders} className="px-4 py-2 rounded-xl border border-[var(--color-secondary)] bg-[var(--bc-bg)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-secondary)] transition"
        >Refresh </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-(--color-secondary) text-(--bc-text)">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Book</th>
              <th className="px-4 py-3 text-left font-semibold">Price</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Payment</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-[color:var(--bc-text)]/70">
                  Loading orders...
                </td>
              </tr>
            ) : safeOrders.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-[color:var(--bc-text)]/70">
                  No orders found.
                </td>
              </tr>
            ) : (
              safeOrders.map((o) => (
                <tr
                  key={o._id}
                  className="border-t border-[var(--color-secondary)] hover:bg-[var(--bc-bg)] transition"
                >
                  <td className="px-4 py-3 text-[var(--bc-text)]">
                    {o.bookTitle || "—"}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--bc-text)]/90">
                    ${Number(o.bookPrice ?? o.price ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold border ${
                        o.orderStatus === "pending"
                          ? "bg-(--bc-bg) text-(--color-primary) border-[var(--color-secondary)]"
                          : o.orderStatus === "shipped"
                          ? "bg-[color:var(--bc-accent)]/10 text-[var(--bc-accent)] border-[color:var(--bc-accent)]/20"
                          : o.orderStatus === "delivered"
                          ? "bg-[color:var(--bc-accent)]/10 text-[var(--bc-accent)] border-[color:var(--bc-accent)]/20"
                          : "bg-[color:var(--bc-text)]/5 text-[color:var(--bc-text)]/80 border-[var(--color-secondary)]"
                      }`}
                    > {o.orderStatus || "—"}</span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold border ${
                        o.paymentStatus === "paid"
                          ? "bg-[color:var(--bc-accent)]/10 text-[var(--bc-accent)] border-[color:var(--bc-accent)]/20"
                          : "bg-[var(--bc-bg)] text-[var(--color-primary)] border-[var(--color-secondary)]"
                      }`}
                    > {o.paymentStatus || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {o.orderStatus === "pending" && (
                        <button
                          onClick={() => cancelOrder(o._id)}
                          className="px-3 py-2 rounded-xl bg-[var(--bc-accent)] text-white font-semibold hover:opacity-90 transition"
                        >Cancel </button>
                      )}
                      {o.orderStatus === "pending" && o.paymentStatus === "unpaid" && (
                        <button onClick={() => payNow(o._id)}
                          className="px-3 py-2 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition"
                        >Pay Now </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
