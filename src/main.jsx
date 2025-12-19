import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { router } from './routes/Router.jsx';
import AuthProvider from './contexts/AuthProvider.jsx';
import CartProvider from './contexts/CartContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
)
