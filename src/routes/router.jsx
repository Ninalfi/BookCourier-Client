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
    path: 'dashboard',
    Component: UserDashboard,
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
      }
    ]
  }
]);