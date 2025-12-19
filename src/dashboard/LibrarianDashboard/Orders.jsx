import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";


export default function Orders() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axiosSecure.get("/orders").then(res => {

      const myOrders = res.data.filter(o => o.librarianEmail === user.email);
      setOrders(myOrders);
    });
  }, []);

  const cancelOrder = async id => {
    await axiosSecure.patch(`/orders/cancel/${id}`);
    setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: "cancelled" } : o));
  };

  const updateStatus = async (id, status) => {
    await axiosSecure.patch(`/orders/status/${id}`, { status });
    setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o));
  };

  return (
    <div className="p-6 bg-white">
      <h2 className="text-2xl mb-4">Orders</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Book</th>
            <th>User</th>
            <th>Order Status</th>
            <th>Payment</th>
            <th>Change Status</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id} className="text-center border-t">
              <td>{o.bookTitle}</td>
              <td>{o.userEmail}</td>
              <td>{o.orderStatus}</td>
              <td>{o.paymentStatus}</td>
              <td>
                {o.orderStatus !== "cancelled" && (
                  <select
                    value={o.orderStatus}
                    onChange={e => updateStatus(o._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                )}
              </td>
              <td>
                {o.orderStatus === "pending" && (
                  <button onClick={() => cancelOrder(o._id)} className="btn btn-sm">
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
