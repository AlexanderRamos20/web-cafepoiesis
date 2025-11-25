import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Package, LogOut, User, ShoppingCart, MessageSquare, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú móvil

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
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
                <nav className="admin-nav" onClick={() => setIsMenuOpen(false)}> {/* Cierra menú al seleccionar link */}
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