import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import './theme.css'
import { AuthProvider } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import App from './App.jsx'
import LoginModal from './components/LoginModal.jsx'
import CafeDetalle from './components/PaginasCafe/CafeDetalle.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import Products from './admin/Products.jsx'
import ProductForm from './admin/ProductForm.jsx'
import AdminCarts from './admin/AdminCarts.jsx'
import AdminForms from './admin/AdminForms.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginModal isOpen={true} onClose={() => window.location.href = '/'} />,
  },
  {
    path: "/cafes/:cafeId",
    element: <CafeDetalle />,
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="productos" replace />
          },
          {
            path: "productos",
            element: <Products />
          },
          {
            path: "productos/nuevo",
            element: <ProductForm />
          },
          {
            path: "productos/editar/:id",
            element: <ProductForm />
          },
          {
            path: "carritos",
            element: <AdminCarts />
          },
          {
            path: "formularios",
            element: <AdminForms />
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)