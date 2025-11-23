import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Package, LogOut, User, ShoppingCart, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        try {
            navigate('/');
            await signOut();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2>Panel de Administración</h2>
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