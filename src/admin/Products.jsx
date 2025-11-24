import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Plus, Edit, Trash2, Check, X, Lock } from 'lucide-react';

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cafeIds, setCafeIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('cafes_en_grano');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data: productsData, error: productsError } = await supabase
                .from('productos')
                .select('*')
                .order('nombre', { ascending: true });

            if (productsError) throw productsError;

            const { data: cafesData, error: cafesError } = await supabase
                .from('cafes_en_grano')
                .select('id_producto');

            if (cafesError) throw cafesError;

            const ids = new Set(cafesData.map(c => c.id_producto));
            setCafeIds(ids);
            setProducts(productsData || []);
        } catch (error) {
            console.error(error);
            alert('Error al cargar productos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleVisibility = async (id, currentStatus) => {
        try {
            const { error } = await supabase
                .from('productos')
                .update({ mostrar: !currentStatus })
                .eq('id_producto', id);

            if (error) throw error;

            setProducts(prev => prev.map(p => 
                p.id_producto === id ? { ...p, mostrar: !currentStatus } : p
            ));
        } catch (error) {
            console.error(error);
            alert('Error al actualizar visibilidad');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            await supabase.from('cafes_en_grano').delete().eq('id_producto', id);
            const { error } = await supabase.from('productos').delete().eq('id_producto', id);

            if (error) throw error;
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar producto');
        }
    };

    const filteredProducts = products.filter(p => {
        // 1. Pestaña LOYVERSE: Solo productos con ID externo
        if (activeTab === 'loyverse') {
            return p.id_loyverse != null;
        }

        // Si tiene ID de Loyverse, NO lo mostramos en las otras pestañas para evitar duplicados visuales
        if (p.id_loyverse != null && activeTab !== 'todos') return false;

        if (activeTab === 'todos') return true;

        if (activeTab === 'cafes_en_grano') {
            return cafeIds.has(p.id_producto);
        }

        if (activeTab === 'insumo') {
            return !cafeIds.has(p.id_producto);
        }

        return false; 
    });

    if (loading) return <div>Cargando productos...</div>;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Productos</h1>
                {activeTab !== 'preparacion' && (
                    <button onClick={() => navigate('/admin/productos/nuevo')} className="btn-primary">
                        <Plus size={20} />
                        Nuevo Producto
                    </button>
                )}
            </div>

            <div className="tabs-container" style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
                <button
                    className={`tab-button ${activeTab === 'todos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('todos')}
                    style={getTabStyle(activeTab === 'todos')}
                >
                    Todos
                </button>
                <button
                    className={`tab-button ${activeTab === 'cafes_en_grano' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cafes_en_grano')}
                    style={getTabStyle(activeTab === 'cafes_en_grano')}
                >
                    Cafés en Grano
                </button>
                <button
                    className={`tab-button ${activeTab === 'insumo' ? 'active' : ''}`}
                    onClick={() => setActiveTab('insumo')}
                    style={getTabStyle(activeTab === 'insumo')}
                >
                    Insumos
                </button>
                <button
                    className={`tab-button ${activeTab === 'loyverse' ? 'active' : ''}`}
                    onClick={() => setActiveTab('loyverse')}
                    style={getTabStyle(activeTab === 'loyverse')}
                >
                    Loyverse
                </button>
                <button
                    className={`tab-button ${activeTab === 'preparacion' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preparacion')}
                    style={getTabStyle(activeTab === 'preparacion')}
                >
                    Preparaciones
                </button>
            </div>

            {activeTab === 'preparacion' ? (
                <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: '12px', border: '2px dashed #ccc' }}>
                    <h3 style={{ color: '#6F4E37' }}>🚧 Sección en Construcción 🚧</h3>
                    <p style={{ color: '#666' }}>
                        Funcionalidad deshabilitada temporalmente por mantenimiento.
                    </p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Tipo (DB)</th>
                                <th>Precio</th>
                                <th>Estado Publicación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => {
                                const isCoffee = cafeIds.has(product.id_producto);
                                const isLoyverseItem = product.id_loyverse != null;
                                
                                return (
                                    <tr key={product.id_producto}>
                                        <td>
                                            <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                                                <img
                                                    src={product.imagen || 'https://placehold.co/60x60'}
                                                    alt={product.nombre}
                                                    className="product-image"
                                                />
                                                {isLoyverseItem && (
                                                    <div style={{ 
                                                        position: 'absolute', 
                                                        bottom: '-5px', 
                                                        right: '-5px', 
                                                        background: '#FF9800', 
                                                        borderRadius: '50%', 
                                                        padding: '3px',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                    }} title="Sincronizado con Loyverse">
                                                        <Lock size={12} color="white" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {product.nombre}
                                            {isLoyverseItem && <div style={{ fontSize: '0.7rem', color: '#FF9800' }}>Sincronizado con Loyverse</div>}
                                        </td>
                                        <td>
                                            <span style={{ 
                                                fontSize: '0.8rem', 
                                                padding: '2px 6px', 
                                                borderRadius: '4px',
                                                backgroundColor: isCoffee ? '#EFEBE9' : '#E3F2FD',
                                                color: isCoffee ? '#5D4037' : '#1565C0',
                                                fontWeight: 'bold'
                                            }}>
                                                {isCoffee ? 'CAFÉ' : 'INSUMO'}
                                            </span>
                                        </td>
                                        <td>${product.precio?.toLocaleString('es-CL')}</td>
                                        
                                        <td style={{ textAlign: 'center' }}>
                                            <button 
                                                onClick={() => toggleVisibility(product.id_producto, product.mostrar)}
                                                style={{ 
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px', 
                                                    border: `1px solid ${product.mostrar ? '#2e7d32' : '#c62828'}`,
                                                    backgroundColor: product.mostrar ? '#e8f5e9' : '#ffebee',
                                                    color: product.mostrar ? '#2e7d32' : '#c62828',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.9rem',
                                                    width: '100%',
                                                    maxWidth: '140px',
                                                    margin: '0 auto',
                                                    transition: 'all 0.2s'
                                                }}
                                                title={product.mostrar ? "Click para Ocultar" : "Click para Publicar"}
                                            >
                                                {product.mostrar ? (
                                                    <>
                                                        <Check size={18} /> Publicado
                                                    </>
                                                ) : (
                                                    <>
                                                        <X size={18} /> Oculto
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        
                                        <td>
                                            <div className="actions">
                                                {isLoyverseItem ? (
                                                    <span style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Lock size={14} /> Protegido
                                                    </span>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => navigate(`/admin/productos/editar/${product.id_producto}`)}
                                                            className="btn-secondary"
                                                            style={{ padding: '0.5rem' }}
                                                            title="Editar"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id_producto)}
                                                            className="btn-danger"
                                                            style={{ padding: '0.5rem' }}
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                            No hay productos en esta categoría
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const getTabStyle = (isActive) => ({
    padding: '10px 20px', 
    border: 'none', 
    background: 'none', 
    borderBottom: isActive ? '3px solid #6F4E37' : 'none', 
    fontWeight: isActive ? 'bold' : 'normal', 
    color: isActive ? '#6F4E37' : '#888',
    cursor: 'pointer',
    transition: 'all 0.2s'
});

export default Products;