import { NavLink } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthProvider";


const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role; // fetched from DB

  return (
    <div className="w-64 bg-base-200 p-5 hidden md:block">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      {/* USER */}
      {role === "user" && (
        <>
          <NavLink to="/dashboard/my-orders">My Orders</NavLink>
          <NavLink to="/dashboard/wishlist">My Wishlist</NavLink>
          <NavLink to="/dashboard/invoices">Invoices</NavLink>
          <NavLink to="/dashboard/profile">My Profile</NavLink>
        </>
      )}

      {/* LIBRARIAN */}
      {role === "librarian" && (
        <>
          <NavLink to="/dashboard/add-book">Add Book</NavLink>
          <NavLink to="/dashboard/my-books">My Books</NavLink>
          <NavLink to="/dashboard/orders">Orders</NavLink>
        </>
      )}

      {/* ADMIN */}
      {role === "admin" && (
        <>
          <NavLink to="/dashboard/all-users">All Users</NavLink>
          <NavLink to="/dashboard/manage-books">Manage Books</NavLink>
        </>
      )}
    </div>
  );
};

export default Sidebar;
