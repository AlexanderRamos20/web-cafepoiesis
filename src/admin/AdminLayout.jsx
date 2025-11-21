import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Package, LogOut, Home, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

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
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2>☕ Admin Panel</h2>
                    {user && (
                        <div style={{
                            fontSize: '0.85rem',
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginTop: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <User size={14} />
                            {user.email}
                        </div>
                    )}
                </div>
                <nav className="admin-nav">
                    <Link to="/admin/productos" className="nav-link">
                        <Package size={20} />
                        Productos
                    </Link>
                </nav>
                <div className="admin-footer">
                    <button onClick={() => navigate('/')} className="nav-link">
                        <Home size={20} />
                        Ir al sitio
                    </button>
                    <button onClick={handleLogout} className="nav-link logout">
                        <LogOut size={20} />
                        Salir
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
