import { useEffect, useMemo, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useAuth } from "../../contexts/AuthProvider";

export default function Orders() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const safeOrders = useMemo(() => (Array.isArray(orders) ? orders : []), [orders]);

  const fetchOrders = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await axiosSecure.get("/librarian/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch librarian orders error:", err.response?.data || err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const cancelOrder = async (id) => {
    try {
      await axiosSecure.patch(`/librarian/orders/${id}/cancel`);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, orderStatus: "cancelled" } : o))
      );
    } catch (err) {
      console.error("Cancel order error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const updateStatus = async (id, orderStatus) => {
    try {
      await axiosSecure.patch(`/librarian/orders/${id}/status`, { orderStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, orderStatus } : o))
      );
    } catch (err) {
      console.error("Update status error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="bg-[var(--bc-surface)] border border-[var(--color-secondary)] p-5 rounded-2xl shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[var(--bc-text)]">Orders (Librarian)</h2>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 rounded-xl border border-[var(--color-secondary)] bg-[var(--bc-bg)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-secondary)] transition"
        >
          Refresh
        </button>
      </div>

      <table className="min-w-full text-sm">
        <thead className="bg-[var(--color-secondary)] text-[var(--bc-text)]">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Book</th>
            <th className="px-4 py-3 text-left font-semibold">Buyer</th>
            <th className="px-4 py-3 text-left font-semibold">Address</th>
            <th className="px-4 py-3 text-left font-semibold">Qty</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-left font-semibold">Payment</th>
            <th className="px-4 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="px-4 py-6 text-[color:var(--bc-text)]/70">
                Loading orders...
              </td>
            </tr>
          ) : safeOrders.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-4 py-6 text-[color:var(--bc-text)]/70">
                No orders found.
              </td>
            </tr>
          ) : (
            safeOrders.map((o) => (
              <tr
                key={o._id}
                className="border-t border-[var(--color-secondary)] hover:bg-[var(--bc-bg)] transition"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={o.bookImage || "https://via.placeholder.com/50"}
                      alt={o.bookTitle || "Book"}
                      className="h-12 w-10 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-[var(--bc-text)]">{o.bookTitle || "—"}</p>
                      <p className="text-xs text-[color:var(--bc-text)]/70">{o.bookAuthor || ""}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 text-[var(--bc-text)]">
                  <div>
                    <p className="font-semibold">{o.name || "—"}</p>
                    <p className="text-xs text-[color:var(--bc-text)]/70">{o.userEmail || o.email}</p>
                    <p className="text-xs text-[color:var(--bc-text)]/70">{o.phone || ""}</p>
                  </div>
                </td>

                <td className="px-4 py-3 text-[color:var(--bc-text)]/90">
                  {o.address || "—"}
                </td>

                <td className="px-4 py-3 text-[color:var(--bc-text)]/90">
                  {o.quantity || 1}
                </td>

                <td className="px-4 py-3 text-[color:var(--bc-text)]/90 capitalize">
                  {o.orderStatus || "pending"}
                </td>

                <td className="px-4 py-3 text-[color:var(--bc-text)]/90 capitalize">
                  {o.paymentStatus || "unpaid"}
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {o.orderStatus !== "cancelled" && o.orderStatus !== "delivered" && (
                      <select
                        className="px-3 py-2 rounded-xl border border-[var(--color-secondary)] bg-[var(--bc-bg)] text-[var(--bc-text)]"
                        value={o.orderStatus || "pending"}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    )}

                    {o.orderStatus === "pending" && (
                      <button
                        onClick={() => cancelOrder(o._id)}
                        className="px-3 py-2 rounded-xl bg-[var(--bc-accent)] text-white font-semibold hover:opacity-90 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
