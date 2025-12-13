import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockOrders = [
      {
        _id: "1",
        bookTitle: "Clean Code",
        orderDate: "2025-02-12",
        status: "pending",
        paymentStatus: "unpaid",
      },
      {
        _id: "2",
        bookTitle: "Atomic Habits",
        orderDate: "2025-02-05",
        status: "shipped",
        paymentStatus: "paid",
      },
      {
        _id: "3",
        bookTitle: "Deep Work",
        orderDate: "2025-01-28",
        status: "cancelled",
        paymentStatus: "unpaid",
      },
    ];

    setOrders(mockOrders);
    setLoading(false);
  }, []);

  const handleCancel = (id) => {
    const updatedOrders = orders.map((order) =>
      order._id === id
        ? { ...order, status: "cancelled" }
        : order
    );
    setOrders(updatedOrders);
  };

  if (loading) {
    return <div className="text-center py-10">Loading orders...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Book Title</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order.bookTitle}</td>
                <td>{order.orderDate}</td>

                <td>
                  <span
                    className={`badge ${
                      order.status === "pending"
                        ? "badge-warning"
                        : order.status === "shipped"
                        ? "badge-info"
                        : order.status === "delivered"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>
                  <span
                    className={`badge ${
                      order.paymentStatus === "paid"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>

                <td className="space-x-2">
                  {/* Cancel Button */}
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="btn btn-sm btn-error"
                    >
                      Cancel
                    </button>
                  )}

                  {/* Pay Now Button */}
                  {order.status === "pending" &&
                    order.paymentStatus === "unpaid" && (
                      <Link
                        to={`/dashboard/payment/${order._id}`}
                        className="btn btn-sm btn-primary"
                      >
                        Pay Now
                      </Link>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <p className="text-center mt-6">No orders found.</p>
      )}
    </div>
  );
};

export default MyOrders;
