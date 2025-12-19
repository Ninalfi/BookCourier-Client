// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// const DashboardHome = () => {

//   const orderStats = [
//     { name: "Pending", value: 4 },
//     { name: "Shipped", value: 2 },
//     { name: "Delivered", value: 6 },
//   ];

//   const paymentStats = [
//     { name: "Paid", value: 8 },
//     { name: "Unpaid", value: 4 },
//   ];

//   const COLORS = ["#34d399", "#fbbf24", "#60a5fa"];

//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-6">
//         Dashboard Overview
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="card bg-base-200 p-6 text-center">
//           <h3 className="text-lg font-semibold">Total Orders</h3>
//           <p className="text-3xl font-bold mt-2">12</p>
//         </div>

//         <div className="card bg-base-200 p-6 text-center">
//           <h3 className="text-lg font-semibold">Paid Orders</h3>
//           <p className="text-3xl font-bold mt-2">8</p>
//         </div>

//         <div className="card bg-base-200 p-6 text-center">
//           <h3 className="text-lg font-semibold">Pending Orders</h3>
//           <p className="text-3xl font-bold mt-2">4</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//         <div className="card bg-base-200 p-6">
//           <h3 className="text-lg font-semibold mb-4">
//             Order Status
//           </h3>

//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={orderStats}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Pie Chart */}
//         <div className="card bg-base-200 p-6">
//           <h3 className="text-lg font-semibold mb-4">
//             Payment Status
//           </h3>

//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={paymentStats}
//                 dataKey="value"
//                 nameKey="name"
//                 outerRadius={100}
//                 label
//               >
//                 {paymentStats.map((_, index) => (
//                   <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardHome;

import React from 'react';

const DashboardHome = () => {
    return (
        <div>
            
        </div>
    );
};

export default DashboardHome;


