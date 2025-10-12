import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './theme.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import GranoGeneral from './components/PaginasCafe/GranoGeneral.jsx' 
import CafeDetalle from './components/PaginasCafe/CafeDetalle.jsx' 

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
  },
  {
    path: "/cafes/:cafeId", 
    element: <CafeDetalle />, 
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)