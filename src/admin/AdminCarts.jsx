import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { ShoppingCart, Eye, Trash2, Package, AlertTriangle, History, List, FileText } from 'lucide-react';

const AdminCarts = () => {
    const [carts, setCarts] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active');
    
    const [selectedCart, setSelectedCart] = useState(null);
    const [cartDetails, setCartDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setLoading(true); 
        if (activeTab === 'active') {
            fetchCarts();
        } else {
            fetchLogs();
        }
    }, [activeTab]);

    const fetchCarts = async () => {
        try {
            const { data, error } = await supabase
                .from('carrito')
                .select('*')
                .order('fecha_creacion', { ascending: false });

            if (error) throw error;
            setCarts(data || []);
        } catch (error) {
            console.error('Error al cargar carritos activos:', error);
            alert('Error al cargar los carritos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchLogs = async () => {
        try {
            const { data, error } = await supabase
                .from('logs_carrito')
                .select('*')
                .order('fecha', { ascending: false });

            if (error) throw error;
            setLogs(data || []);
        } catch (error) {
            console.error('Error al cargar logs_carrito:', error);
            alert('Error al cargar el historial: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCartDetails = async (id_carrito) => {
        try {
            const { data, error } = await supabase
                .from('detalle_carrito')
                .select(`
                    *,
                    productos (
                        nombre,
                        imagen
                    )
                `)
                .eq('id_carrito', id_carrito);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const handleViewDetails = async (cart) => {
        setSelectedCart(cart);
        const details = await fetchCartDetails(cart.id_carrito);
        setCartDetails(details);
        setShowModal(true);
    };

    const handleDelete = async (id_usuario, id_carrito) => {
        if (!confirm('¿Estás seguro de eliminar este carrito ACTIVO? Esta acción no se puede deshacer.')) return;

        try {
            await supabase
                .from('detalle_carrito')
                .delete()
                .eq('id_carrito', id_carrito);

            const { error } = await supabase
                .from('carrito')
                .delete()
                .eq('id_carrito', id_carrito);

            if (error) throw error;

            setCarts(prev => prev.filter(c => c.id_carrito !== id_carrito));
            
            if (showModal) setShowModal(false);
        } catch (error) {
            console.error(error);
            alert('Error al eliminar el carrito');
        }
    };

    const calculateCartTotal = (details) => {
        return details.reduce((sum, item) => {
            return sum + (item.precio_unitario_actual * item.cantidad);
        }, 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('es-CL', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
            });
        } catch (e) { return 'N/A'; }
    };

    const getStatusBadge = (estado) => {
        const statusColors = {
            'creado': { bg: '#e3f2fd', color: '#1976d2' },
            'completado': { bg: '#e8f5e9', color: '#388e3c' },
            'cancelado': { bg: '#ffebee', color: '#d32f2f' },
            'pendiente': { bg: '#fff3e0', color: '#f57c00' }
        };

        const style = statusColors[estado?.toLowerCase()] || statusColors['pendiente'];

        return (
            <span style={{
                padding: '4px 12px', borderRadius: '12px',
                backgroundColor: style.bg, color: style.color,
                fontSize: '0.85rem', fontWeight: '500', textTransform: 'capitalize'
            }}>
                {estado || 'Pendiente'}
            </span>
        );
    };

    // Renderizado: Tabla de Carritos Activos
    const renderActiveTable = () => (
        <table className="products-table">
            <thead>
                <tr>
                    <th>ID Carrito</th>
                    <th>Usuario</th>
                    <th>Fecha Creación</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {carts.map(cart => (
                    <tr key={cart.id_carrito}>
                        <td><strong style={{ color: '#4e342e' }}>#{cart.id_carrito}</strong></td>
                        <td style={{fontSize: '0.8rem', color: '#666'}}>
                            {cart.id_usuario ? cart.id_usuario.substring(0, 8) + '...' : 'Anónimo'}
                        </td>
                        <td>{formatDate(cart.fecha_creacion)}</td>
                        <td>{getStatusBadge(cart.estado)}</td>
                        <td>
                            <div className="actions">
                                <button onClick={() => handleViewDetails(cart)} className="btn-secondary" style={{ padding: '0.5rem' }} title="Ver Detalles">
                                    <Eye size={16} />
                                </button>
                                <button onClick={() => handleDelete(cart.id_usuario, cart.id_carrito)} className="btn-danger" style={{ padding: '0.5rem' }} title="Eliminar">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    // Renderizado: Tabla de Historial (Logs)
    const renderHistoryTable = () => (
        <table className="products-table">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>ID Original</th>
                    <th>Acción</th>
                    <th>Detalle del Registro</th>
                </tr>
            </thead>
            <tbody>
                {logs.map(log => (
                    <tr key={log.id_log || Math.random()}>
                        <td style={{ whiteSpace: 'nowrap', fontSize: '0.9rem' }}>{formatDate(log.fecha)}</td> 
                        <td>
                            {log.id_carrito ? (
                                <span style={{ color: '#666' }}>#{log.id_carrito}</span>
                            ) : (
                                <span style={{ color: '#999', fontStyle: 'italic' }}>Eliminado</span>
                            )}
                        </td>
                        <td>
                            <span style={{
                                padding: '2px 8px', borderRadius: '4px',
                                backgroundColor: '#f5f5f5', color: '#666',
                                fontSize: '0.8rem', border: '1px solid #ddd'
                            }}>
                                {log.accion || 'N/A'}
                            </span>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: '#444', lineHeight: '1.4' }}>
                            {log.descripcion || 'Sin descripción'}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">
                    <ShoppingCart size={28} style={{ marginRight: '10px' }} />
                    Gestión de Pedidos
                </h1>
            </div>

            {/* TABS CON FLEXBOX PARA LADO A LADO */}
            <div className="tabs-container" style={{ 
                marginBottom: '20px', 
                borderBottom: '1px solid #ddd',
                display: 'flex', 
                gap: '10px' 
            }}>
                <button
                    onClick={() => setActiveTab('active')}
                    style={getTabStyle(activeTab === 'active')}
                >
                    <List size={18} /> Carritos Activos
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    style={getTabStyle(activeTab === 'history')}
                >
                    <History size={18} /> Historial de carritos
                </button>
            </div>

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos...</div>
                ) : (
                    <>
                        {/* Renderizado de Activos */}
                        {activeTab === 'active' && (
                            carts.length > 0 ? renderActiveTable() : (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                                    <ShoppingCart size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                    <p>No hay carritos activos en este momento.</p>
                                </div>
                            )
                        )}

                        {/* Renderizado de Historial */}
                        {activeTab === 'history' && (
                            logs.length > 0 ? renderHistoryTable() : (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                                    <FileText size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                    <p>No hay registros históricos.</p>
                                </div>
                            )
                        )}
                    </>
                )}
            </div>

            {/* MODAL */}
            {showModal && selectedCart && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        style={{
                            backgroundColor: 'white', borderRadius: '12px', padding: '2rem',
                            maxWidth: '800px', width: '100%', maxHeight: '80vh', overflow: 'auto',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ marginTop: 0, color: '#4e342e', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                            Detalles Carrito #{selectedCart.id_carrito}
                        </h2>

                        {cartDetails.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#ffebee', borderRadius: '8px', color: '#d32f2f' }}>
                                <AlertTriangle size={32} />
                                <p><strong>Carrito sin productos asociados.</strong></p>
                                <p style={{ fontSize: '0.9rem' }}>Es posible que los detalles hayan sido eliminados.</p>
                            </div>
                        ) : (
                            <div>
                                {cartDetails.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '0.5rem' }}>
                                        {item.productos?.imagen && (
                                            <img src={item.productos.imagen} alt={item.productos?.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                                        )}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '500', color: '#4e342e' }}>{item.productos?.nombre}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.cantidad} x ${item.precio_unitario_actual}</div>
                                        </div>
                                        <div style={{ fontWeight: 'bold' }}>${item.cantidad * item.precio_unitario_actual}</div>
                                    </div>
                                ))}
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: '#4e342e' }}>
                                    <span>Total:</span>
                                    <span>${calculateCartTotal(cartDetails).toLocaleString('es-CL')}</span>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '1rem' }}>
                            <button onClick={() => setShowModal(false)} className="btn-secondary">Cerrar</button>
                            <button onClick={() => handleDelete(selectedCart.id_usuario, selectedCart.id_carrito)} className="btn-danger">
                                <Trash2 size={16} style={{ marginRight: '5px' }}/> Eliminar Carrito Activo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const getTabStyle = (isActive) => ({
    padding: '10px 20px', 
    border: 'none', 
    background: 'none', 
    cursor: 'pointer',
    borderBottom: isActive ? '3px solid #6F4E37' : 'none',
    fontWeight: isActive ? 'bold' : 'normal', 
    color: isActive ? '#6F4E37' : '#666',
    display: 'flex', alignItems: 'center', gap: '8px'
});

export default AdminCarts;