import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';

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

            setProducts(products.map(p => 
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
            
            const { error } = await supabase
                .from('productos')
                .delete()
                .eq('id_producto', id);

            if (error) throw error;

            fetchProducts();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar producto');
        }
    };

    const filteredProducts = products.filter(p => {
        if (!p.tipo_producto) return false;
        
        // Normalizar texto: minúsculas y sin tildes para evitar errores de tipeo
        const type = p.tipo_producto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

        // 1. BLOQUEO GLOBAL: Frias y Cafetería NO se muestran NUNCA.
        // Esto asegura que aunque tengan checkbox "visible", desaparezcan de la gestión.
        if (type.includes('fria') || type.includes('cafeteria') || type.includes('preparacion')) {
            return false;
        }

        if (activeTab === 'todos') return true;

        if (activeTab === 'cafes_en_grano') {
            return cafeIds.has(p.id_producto);
        }

        if (activeTab === 'insumo') {
            // A. Si es un café (está en la tabla cafes_en_grano), LO QUITAMOS.
            if (cafeIds.has(p.id_producto)) return false;

            // B. Filtro de Lista Blanca (Whitelist)
            // Solo permitimos pasar a los que coincidan con estas categorías exactas
            const allowedCategories = [
                'cafe en grano e insumos', // La categoría mixta de Loyverse
                'insumos',
                'insumo',
                'accesorios',
                'accesorio'
            ];
            
            // Verificamos si el tipo normalizado está en la lista permitida
            return allowedCategories.includes(type);
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
                {['todos', 'cafes_en_grano', 'insumo', 'preparacion'].map(tab => (
                    <button
                        key={tab}
                        className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                        style={{ 
                            padding: '10px 20px', 
                            border: 'none', 
                            background: 'none', 
                            borderBottom: activeTab === tab ? '2px solid #6F4E37' : 'none', 
                            fontWeight: activeTab === tab ? 'bold' : 'normal', 
                            color: activeTab === tab ? '#6F4E37' : '#666',
                            textTransform: 'capitalize',
                            cursor: 'pointer'
                        }}
                    >
                        {tab.replace(/_/g, ' ')}
                    </button>
                ))}
            </div>

            {activeTab === 'preparacion' ? (
                <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                    <h3 style={{ color: '#6F4E37', marginBottom: '1rem' }}>Sección en Mantenimiento</h3>
                    <p style={{ color: '#666' }}>
                        La gestión de preparaciones está deshabilitada temporalmente por ajustes de estructura.
                    </p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Precio</th>
                                <th style={{ textAlign: 'center' }}>Visible</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id_producto}>
                                    <td>
                                        <img
                                            src={product.imagen || 'https://placehold.co/60x60'}
                                            alt={product.nombre}
                                            className="product-image"
                                        />
                                    </td>
                                    <td>{product.nombre}</td>
                                    <td>{cafeIds.has(product.id_producto) ? 'café en grano e insumo' : product.tipo_producto}</td>
                                    <td>${product.precio?.toLocaleString('es-CL')}</td>
                                    
                                    <td style={{ textAlign: 'center' }}>
                                        <button 
                                            onClick={() => toggleVisibility(product.id_producto, product.mostrar)}
                                            style={{ 
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '8px',
                                                border: `2px solid ${product.mostrar ? '#2e7d32' : '#c62828'}`,
                                                backgroundColor: product.mostrar ? '#e8f5e9' : '#ffebee',
                                                color: product.mostrar ? '#2e7d32' : '#c62828',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                margin: '0 auto',
                                                transition: 'all 0.2s',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                            }}
                                            title={product.mostrar ? "Visible (Click para ocultar)" : "Oculto (Click para mostrar)"}
                                        >
                                            {product.mostrar ? <Check size={22} strokeWidth={3} /> : <X size={22} strokeWidth={3} />}
                                        </button>
                                    </td>
                                    
                                    <td>
                                        <div className="actions">
                                            <button
                                                onClick={() => navigate(`/admin/productos/editar/${product.id_producto}`)}
                                                className="btn-secondary"
                                                style={{ padding: '0.5rem' }}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id_producto)}
                                                className="btn-danger"
                                                style={{ padding: '0.5rem' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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

export default Products;