import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useAuth } from "../contexts/AuthProvider";
import useRole from "../hooks/useRole";

const DashboardHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const role = useRole();
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [paymentStats, setPaymentStats] = useState([]);

  const COLORS = ["#34d399", "#fbbf24", "#60a5fa"]; // green, yellow, blue

  useEffect(() => {
    let endpoint = "/my-orders"; 
    if (role === "user") endpoint = `/my-orders/${user.email}`; 

    axiosSecure.get(endpoint).then(res => {
      setOrders(res.data);

      const pending = res.data.filter(o => o.orderStatus === "pending").length;
      const shipped = res.data.filter(o => o.orderStatus === "shipped").length;
      const delivered = res.data.filter(o => o.orderStatus === "delivered").length;
      setOrderStats([
        { name: "Pending", value: pending },
        { name: "Shipped", value: shipped },
        { name: "Delivered", value: delivered },
      ]);
      const paid = res.data.filter(o => o.paymentStatus === "paid").length;
      const unpaid = res.data.filter(o => o.paymentStatus === "unpaid").length;
      setPaymentStats([
        { name: "Paid", value: paid },
        { name: "Unpaid", value: unpaid },
      ]);
    });
  }, [axiosSecure, role, user.email]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-base-200 p-6 text-center shadow">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-3xl font-bold mt-2">{orders.length}</p>
        </div>

        <div className="card bg-base-200 p-6 text-center shadow">
          <h3 className="text-lg font-semibold">Paid Orders</h3>
          <p className="text-3xl font-bold mt-2">{paymentStats.find(p => p.name === "Paid")?.value || 0}</p>
        </div>

        <div className="card bg-base-200 p-6 text-center shadow">
          <h3 className="text-lg font-semibold">Pending Orders</h3>
          <p className="text-3xl font-bold mt-2">{orderStats.find(o => o.name === "Pending")?.value || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Status Bar Chart */}
        <div className="card bg-base-200 p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">Order Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderStats}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status Pie Chart */}
        <div className="card bg-base-200 p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentStats}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {paymentStats.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
