import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";


export default function MyOrders() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axiosSecure.get(`/orders/${user.email}`).then(res => setOrders(res.data));
  }, []);

  const cancelOrder = id => {
    axiosSecure.patch(`/orders/cancel/${id}`).then(() => {
      setOrders(prev => prev.map(o =>
        o._id === id ? { ...o, orderStatus: "cancelled" } : o
      ));
    });
  };

  return (
    <table className="w-full bg-white">
      <thead>
        <tr>
          <th>Book</th>
          <th>Status</th>
          <th>Payment</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(o => (
          <tr key={o._id}>
            <td>{o.bookTitle}</td>
            <td>{o.orderStatus}</td>
            <td>{o.paymentStatus}</td>
            <td>
              {o.orderStatus === "pending" && (
                <button onClick={() => cancelOrder(o._id)} className="btn">
                  Cancel
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
