import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTachometerAlt, FaBook, FaUser, FaFileInvoiceDollar, FaUsers, FaClipboardList } from "react-icons/fa";
import useRole from "../hooks/useRole";
import Navbar from "../components/Shared/Navbar";
import { MdPayment } from "react-icons/md";

export default function DashboardLayout() {
  const {role, roleLoading } = useRole();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sidebar links with icons
  const sidebarLinks = {
    user: [
      { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
      { name: "My Orders", path: "/dashboard/my-orders", icon: <FaBook /> },
      { name: "My Profile", path: "/dashboard/profile", icon: <FaUser /> },
      { name: "Payments", path: "/dashboard/payments", icon: <MdPayment/> },
      { name: "Invoices", path: "/dashboard/invoices", icon: <FaFileInvoiceDollar /> },
    ],
    librarian: [
      { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
      { name: "Add Book", path: "/dashboard/add-book", icon: <FaBook /> },
      { name: "My Books", path: "/dashboard/my-books", icon: <FaClipboardList /> },
      { name: "Orders", path: "/dashboard/librarian-orders", icon: <FaBook /> },
    ],
    admin: [
      { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
      { name: "All Users", path: "/dashboard/all-users", icon: <FaUsers /> },
      { name: "Manage Books", path: "/dashboard/manage-books", icon: <FaBook /> },
      { name: "My Profile", path: "/dashboard/profile", icon: <FaUser /> },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-(--bc-surface) p-6 shadow-lg transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          {!collapsed && <h2 className="text-2xl font-bold text-[var(--color-primary)]">Dashboard</h2>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded hover:bg-gray-200">
            <FaBars />
          </button>
        </div>
        <p className={`mb-4 text-gray-500 capitalize ${collapsed ? "hidden" : ""}`}>Role: {role}</p>
        <nav className="flex flex-col gap-2">
          {sidebarLinks[role].map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded hover:bg-(--color-primary) hover:text-white ${
                  isActive ? "bg-(--color-primary) text-white" : "text-gray-700"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {!collapsed && <span>{link.name}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className={`md:hidden fixed inset-0 z-40 transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div
          className="bg-black bg-opacity-50 w-full h-full"
          onClick={() => setMobileOpen(false)}
        ></div>
        <aside className="absolute left-0 top-0 w-64 h-full bg-(--bc-surface) shadow-lg p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-(--color-primary)">Dashboard</h2>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded hover:bg-gray-200">✕</button>
          </div>
          <p className="mb-4 text-gray-500 capitalize">Role: {role}</p>
          <nav className="flex flex-col gap-2">
            {sidebarLinks[role].map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded hover:bg-(--color-primary) hover:text-white ${
                    isActive ? "bg-(--color-primary) text-white" : "text-gray-700"
                  }`
                }
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Mobile hamburger */}
        <button
          className="md:hidden mb-4 px-3 py-2 rounded bg-gray-200"
          onClick={() => setMobileOpen(true)}
        >
          <FaBars />
        </button>
        <Navbar className="w-full"></Navbar>
        <Outlet />
      </main>
    </div>
  );
}
