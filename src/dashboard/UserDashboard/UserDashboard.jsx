import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../../components/Shared/Navbar";
import Footer from "../../components/Shared/Footer";

const UserDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
       
        <aside className="w-64 bg-base-200 p-4 hidden md:block">
          <h2 className="text-xl font-semibold mb-4">User Dashboard</h2>

          <ul className="menu space-y-1">
            <li>
              <NavLink
                to="orders"
                className={({ isActive }) =>
                  isActive ? "active font-semibold" : ""
                }
              >
                My Orders
              </NavLink>
            </li>

            <li>
              <NavLink
                to="profile"
                className={({ isActive }) =>
                  isActive ? "active font-semibold" : ""
                }
              >
                My Profile
              </NavLink>
            </li>

            <li>
              <NavLink
                to="invoices"
                className={({ isActive }) =>
                  isActive ? "active font-semibold" : ""
                }
              >
                Invoices
              </NavLink>
            </li>
          </ul>
        </aside>
        <main className="flex-1 bg-base-100 p-6">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;
