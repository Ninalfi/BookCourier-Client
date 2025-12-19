import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Coverage from "../pages/coverage/Coverage";
import UserDashboard from "../dashboard/UserDashboard/UserDashboard";
import MyOrders from "../dashboard/UserDashboard/MyOrders";
import MyProfile from "../dashboard/UserDashboard/MyProfile";
import Invoices from "../dashboard/UserDashboard/Invoices";
import DashboardHome from "../dashboard/UserDashboard/DashboardHome";
import Wishlist from "../dashboard/UserDashboard/Wishlist";
import PrivateRoute from "../layouts/PrivateRoute";
import AddBook from "../dashboard/LibrarianDashboard/AddBook";
import MyBooks from "../dashboard/LibrarianDashboard/MyBooks";
import ManageBooks from "../dashboard/AdminDashboard/ManageBooks";
import ManageUsers from "../dashboard/AdminDashboard/ManageUsers";
import AllBooks from "../pages/AllBooks";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
        {
            index: true,
            Component: Home
        },
        {
          path: 'books',
          Component: AllBooks
        },
        {
            path: 'coverage',
            Component: Coverage,
            loader: () => fetch('/coverage.json').then (res => res.json ())
        }
    ]
  },
  {
    path: '/',
    Component: AuthLayout,
    children:[
        {
          path: 'login',  
          Component: Login
        },
        {
            path: 'register',
            Component: Register
        }
    ]
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <UserDashboard></UserDashboard>
      </PrivateRoute>
    ),
    children:[
      {
        index: true,
        Component: DashboardHome
      },
      {
        path: 'orders',
        Component: MyOrders
      },
      {
        path: 'profile',
        Component: MyProfile
      },
      {
        path: 'invoices',
        Component: Invoices
      },
      {
        path: 'wishlist',
        Component: Wishlist
      },
      {
        path: 'addBook',
        Component: AddBook
      },
      {
        path: 'myBooks',
        Component: MyBooks
      },
      {
        path: 'manageBooks',
        Component: ManageBooks
      },
      {
        path: 'users',
        Component: ManageUsers
      }
    ]
  }
]);