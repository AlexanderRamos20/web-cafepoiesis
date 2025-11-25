import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Package, LogOut, User, ShoppingCart, MessageSquare, Menu, X, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import './AdminLayout.css';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const EDGE_FUNCTION_NAME = 'caching-horario-googleSites';

const AdminLayout = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú móvil
    const [isUpdating, setIsUpdating] = useState(false); // Estado para actualizar horarios

    const handleLogout = async () => {
        try {
            // Navegar primero a la página principal para evitar que ProtectedRoute redirija a /login
            navigate('/', { replace: true });
            // Luego cerrar sesión
            await signOut();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Si hay error, igual navegar a la página principal
            navigate('/', { replace: true });
        }
    };

    const handleForceUpdateHorarios = async () => {
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            alert('Error: Faltan variables de entorno de Supabase.');
            return;
        }

        const confirmUpdate = window.confirm(
            "¿Estás seguro de que quieres forzar la actualización de horarios desde Google Maps? Esto puede tardar unos segundos."
        );
        
        if (!confirmUpdate) return;
        
        setIsUpdating(true); 

        const url = `${SUPABASE_URL}/functions/v1/${EDGE_FUNCTION_NAME}?force=true`;
        
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Horarios actualizados con éxito.`);
            } else {
                alert(`Error al actualizar horarios: ${data.details || data.error}`);
            }
        } catch (error) {
            console.error("Error de red al invocar Edge Function:", error);
            alert("Error de conexión: No se pudo contactar con la función Edge.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="admin-container">
            {/* Header Fijo Móvil y Toggle */}
            <header className="mobile-header">
                <div className="admin-logo">
                    <h2>Panel de Administración</h2>
                    <button 
                        className="menu-toggle-button" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>
            
            <aside className={`admin-sidebar ${isMenuOpen ? 'open' : ''}`}>
                <div className="admin-logo">
                    <h2>Panel de Administración</h2>
                    {user && (
                        <div className="user-info" style={{
                            fontSize: '0.85rem',
                            color: 'rgba(255, 255, 255, 0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <User size={14} />
                            {user.email}
                        </div>
                    )}
                </div>
                <nav className="admin-nav" onClick={() => setIsMenuOpen(false)}>
                    <Link to="/admin/productos" className="nav-link">
                        <Package size={20} />
                        Productos
                    </Link>
                    <Link to="/admin/carritos" className="nav-link">
                        <ShoppingCart size={20} />
                        Carritos
                    </Link>
                    <Link to="/admin/formularios" className="nav-link">
                        <MessageSquare size={20} />
                        Formularios
                    </Link>

                    {/* Botón de Actualizar Horarios (Funcionalidad del Equipo) */}
                    <button 
                        onClick={handleForceUpdateHorarios} 
                        className={`nav-link ${isUpdating ? 'disabled' : ''}`}
                        disabled={isUpdating}
                        title="Fuerza la actualización inmediata de la caché de horarios desde Google Places."
                        style={{ cursor: 'pointer', width: '100%', textAlign: 'left' }}
                    >
                        <Clock size={20} />
                        {isUpdating ? 'Actualizando...' : 'Actualizar Horarios'}
                    </button>
                </nav>
                
                <div className="admin-footer">
                    <button onClick={handleLogout} className="nav-link logout">
                        <LogOut size={20} />
                        Cerrar sesión
                    </button>
                </div>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;