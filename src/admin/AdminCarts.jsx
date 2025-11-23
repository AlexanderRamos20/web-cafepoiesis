import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { ShoppingCart, Eye, Trash2, Package } from 'lucide-react';

const AdminCarts = () => {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCart, setSelectedCart] = useState(null);
    const [cartDetails, setCartDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchCarts();
    }, []);

    const fetchCarts = async () => {
        try {
            const { data, error } = await supabase
                .from('carrito')
                .select('*')
                .order('fecha_creacion', { ascending: false });

            if (error) throw error;
            setCarts(data || []);
        } catch (error) {
            console.error(error);
            alert('Error al cargar los carritos: ' + error.message);
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
        // CORRECCIÓN CLAVE: Usamos cart.id_carrito en lugar de cart.id_usuario
        const details = await fetchCartDetails(cart.id_carrito);
        setCartDetails(details);
        setShowModal(true);
    };

    const handleDelete = async (id_carrito) => {
        if (!confirm('¿Estás seguro de eliminar este carrito? Esto también eliminará todos sus detalles.')) return;

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

            fetchCarts();
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
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleString('es-CL', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'N/A';
        }
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
                padding: '4px 12px',
                borderRadius: '12px',
                backgroundColor: style.bg,
                color: style.color,
                fontSize: '0.85rem',
                fontWeight: '500',
                textTransform: 'capitalize'
            }}>
                {estado || 'Pendiente'}
            </span>
        );
    };

    if (loading) return <div>Cargando carritos...</div>;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">
                    <ShoppingCart size={28} style={{ marginRight: '10px' }} />
                    Gestión de Carritos
                </h1>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                    Total de carritos: {carts.length}
                </div>
            </div>

            <div className="table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>ID Carrito</th>
                            <th>ID Usuario</th>
                            <th>Fecha Creación</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carts.map(cart => (
                            <tr key={cart.id_carrito}>
                                <td>
                                    <strong style={{ color: '#4e342e' }}>
                                        #{cart.id_carrito}
                                    </strong>
                                </td>
                                <td>
                                    <span style={{ fontSize: '0.85rem', color: '#666', fontFamily: 'monospace' }}>
                                        {cart.id_usuario?.slice(0, 8)}...
                                    </span>
                                </td>
                                <td>{formatDate(cart.fecha_creacion)}</td>
                                <td>{getStatusBadge(cart.estado)}</td>
                                <td>
                                    <div className="actions">
                                        <button
                                            onClick={() => handleViewDetails(cart)}
                                            className="btn-secondary"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                            title="Ver detalles del carrito"
                                        >
                                            <Eye size={16} /> Ver
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cart.id_carrito)}
                                            className="btn-danger"
                                            title="Eliminar carrito"
                                        >
                                            <Trash2 size={16} /> Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {carts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                        <ShoppingCart size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p>No hay carritos registrados</p>
                    </div>
                )}
            </div>

            {showModal && selectedCart && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '2rem',
                            maxWidth: '800px',
                            width: '100%',
                            maxHeight: '80vh',
                            overflow: 'auto',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{
                            marginTop: 0,
                            color: '#4e342e',
                            borderBottom: '2px solid #e2e8f0',
                            paddingBottom: '1rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <ShoppingCart size={24} />
                            Detalles del Carrito #{selectedCart.id_carrito}
                        </h2>

                        <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                                    <strong>Usuario:</strong>
                                </p>
                                <p style={{ margin: '0', fontSize: '0.85rem', fontFamily: 'monospace', background: '#f5f5f5', padding: '4px', borderRadius: '4px' }}>
                                    {selectedCart.id_usuario}
                                </p>
                            </div>
                            <div>
                                <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                                    <strong>Estado:</strong> {getStatusBadge(selectedCart.estado)}
                                </p>
                                <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                                    <strong>Fecha:</strong> {formatDate(selectedCart.fecha_creacion)}
                                </p>
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: '#f9fafb',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem'
                        }}>
                            <strong style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '1rem',
                                color: '#4e342e'
                            }}>
                                <Package size={18} />
                                Productos en el carrito:
                            </strong>

                            {cartDetails.length === 0 ? (
                                <p style={{ color: '#999', margin: 0, textAlign: 'center', padding: '1rem' }}>
                                    No se encontraron productos o el carrito está vacío.
                                </p>
                            ) : (
                                <div>
                                    {cartDetails.map((item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                padding: '0.75rem',
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                marginBottom: '0.5rem',
                                                border: '1px solid #eee'
                                            }}
                                        >
                                            {item.productos?.imagen ? (
                                                <img
                                                    src={item.productos.imagen}
                                                    alt={item.productos?.nombre}
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        objectFit: 'cover',
                                                        borderRadius: '6px'
                                                    }}
                                                />
                                            ) : (
                                                <div style={{ width: '50px', height: '50px', background: '#eee', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Package size={20} color="#999" />
                                                </div>
                                            )}
                                            
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600', color: '#4e342e' }}>
                                                    {item.productos?.nombre || `Producto ID: ${item.id_producto}`}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                                    {item.cantidad} x ${item.precio_unitario_actual?.toLocaleString('es-CL')}
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: '700', color: '#4e342e' }}>
                                                ${(item.cantidad * item.precio_unitario_actual)?.toLocaleString('es-CL')}
                                            </div>
                                        </div>
                                    ))}

                                    <div style={{
                                        marginTop: '1rem',
                                        paddingTop: '1rem',
                                        borderTop: '2px solid #e2e8f0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <strong style={{ fontSize: '1.1rem', color: '#4e342e' }}>Total Carrito:</strong>
                                        <strong style={{ fontSize: '1.4rem', color: '#4e342e' }}>
                                            ${calculateCartTotal(cartDetails).toLocaleString('es-CL')}
                                        </strong>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn-secondary"
                            >
                                Cerrar
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(selectedCart.id_carrito);
                                    setShowModal(false);
                                }}
                                className="btn-danger"
                            >
                                <Trash2 size={16} />
                                Eliminar Carrito
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCarts;