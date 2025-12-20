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
import Payment from "../dashboard/UserDashboard/Payment";
import Wishlist from "../dashboard/UserDashboard/Wishlist";
import PrivateRoute from "../layouts/PrivateRoute";
import AddBook from "../dashboard/LibrarianDashboard/AddBook";
import MyBooks from "../dashboard/LibrarianDashboard/MyBooks";
import ManageBooks from "../dashboard/AdminDashboard/ManageBooks";
import ManageUsers from "../dashboard/AdminDashboard/ManageUsers";
import AllBooks from "../pages/AllBooks";
import BookDetails from "../pages/BookDetails";
import Orders from "../dashboard/LibrarianDashboard/Orders";
import DashboardHome from "../dashboard/DashboardHome";
import CartPage from "../pages/CartPage";
import DashboardLayout from "../layouts/DashboardLayout";
import LibrarianRoute from "../layouts/LibrarianRoute";
import AdminRoute from "../layouts/AdminRoute";


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
    path: "books/:id",
    element: (
    <PrivateRoute>
      <BookDetails />
    </PrivateRoute>
    ),
    },

        {
            path: 'coverage',
            Component: Coverage,
            loader: () => fetch('/coverage.json').then (res => res.json ())
        },
        {
          path:'cart',
          Component: CartPage
        },
        
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
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children:[
      {
        index: true,
        Component: DashboardHome
      },
      {
        path: 'my-orders',
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
        path: 'payments',
        Component: Payment
      },
      {
        path: 'payments/:id',
        Component: Payment
      },
      {
        path: 'wishlist',
        Component: Wishlist
      },
      {
        path: "add-book",
        element: (
           <LibrarianRoute>
            <AddBook />
           </LibrarianRoute>
          ),
      },
      {
        path: "my-books",
  element: (
    <LibrarianRoute>
      <MyBooks />
    </LibrarianRoute>
  ),
      },
      {
        path: "librarian-orders",
  element: (
    <LibrarianRoute>
      <Orders />
    </LibrarianRoute>
  ),
      },
      {
        path: 'manage-books',
        element: (
          <AdminRoute>
            <ManageBooks />
          </AdminRoute>
        )
      },
      {
        path: 'all-users',
        element:(
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ) 
      }
    ]
  },
 
  
]);