import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './theme.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import GranoGeneral from './components/PaginasCafe/GranoGeneral.jsx'
import CafeDetalle from './components/PaginasCafe/CafeDetalle.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import Products from './admin/Products.jsx'
import ProductForm from './admin/ProductForm.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/cafes/:cafeId",
    element: <CafeDetalle />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
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