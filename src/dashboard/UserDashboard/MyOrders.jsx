import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function MyOrders() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = () => {
    if (!user?.email) return;
    axiosSecure.get(`/my-orders/${user.email}`).then(res => setOrders(res.data));
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const cancelOrder = (id) => {
    axiosSecure.patch(`/my-orders/cancel/${id}`).then(() => {
      setOrders(prev =>
        prev.map(o =>
          o._id === id ? { ...o, orderStatus: "cancelled" } : o
        )
      );
    });
  };

  const payNow = (id) => {
    navigate(`/dashboard/payment/${id}`);
  };

  return (
    <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Book</th>
            <th className="px-4 py-2 border">Quantity</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Payment</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">No orders found.</td>
            </tr>
          ) : (
            orders.map(o => (
              <tr key={o._id} className="text-center">
                <td className="px-4 py-2 border">{o.bookTitle}</td>
                <td className="px-4 py-2 border">{o.quantity}</td>
                <td className="px-4 py-2 border">${o.price}</td>
                <td className="px-4 py-2 border">{o.orderStatus}</td>
                <td className="px-4 py-2 border">{o.paymentStatus}</td>
                <td className="px-4 py-2 border flex justify-center gap-2">
                  {o.orderStatus === "pending" && (
                    <button
                      onClick={() => cancelOrder(o._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Cancel
                    </button>
                  )}
                  {o.orderStatus === "pending" && o.paymentStatus === "unpaid" && (
                    <button
                      onClick={() => payNow(o._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
