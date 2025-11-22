import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('cafes_en_grano'); // Default tab

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('productos')
                .select('*')
                .order('nombre', { ascending: true });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Error al cargar productos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            // Primero eliminar de cafes_en_grano si existe
            await supabase.from('cafes_en_grano').delete().eq('id_producto', id);

            // Luego eliminar el producto
            const { error } = await supabase
                .from('productos')
                .delete()
                .eq('id_producto', id);

            if (error) throw error;

            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error al eliminar producto');
        }
    };

    const filteredProducts = products.filter(p => p.tipo_producto === activeTab);

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Productos</h1>
                <button onClick={() => navigate('/admin/productos/nuevo')} className="btn-primary">
                    <Plus size={20} />
                    Nuevo Producto
                </button>
            </div>

            {/* PESTAÑAS DE NAVEGACIÓN */}
            <div className="tabs-container" style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
                <button
                    className={`tab-button ${activeTab === 'cafes_en_grano' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cafes_en_grano')}
                    style={{ padding: '10px 20px', border: 'none', background: 'none', borderBottom: activeTab === 'cafes_en_grano' ? '2px solid #4e342e' : 'none', fontWeight: activeTab === 'cafes_en_grano' ? 'bold' : 'normal', color: activeTab === 'cafes_en_grano' ? '#4e342e' : '#666' }}
                >
                    Cafés en Grano
                </button>
                <button
                    className={`tab-button ${activeTab === 'insumos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('insumos')}
                    style={{ padding: '10px 20px', border: 'none', background: 'none', borderBottom: activeTab === 'insumos' ? '2px solid #4e342e' : 'none', fontWeight: activeTab === 'insumos' ? 'bold' : 'normal', color: activeTab === 'insumos' ? '#4e342e' : '#666' }}
                >
                    Insumos
                </button>
                <button
                    className={`tab-button ${activeTab === 'productos_muestra' ? 'active' : ''}`}
                    onClick={() => setActiveTab('productos_muestra')}
                    style={{ padding: '10px 20px', border: 'none', background: 'none', borderBottom: activeTab === 'productos_muestra' ? '2px solid #4e342e' : 'none', fontWeight: activeTab === 'productos_muestra' ? 'bold' : 'normal', color: activeTab === 'productos_muestra' ? '#4e342e' : '#666' }}
                >
                    Productos de Muestra
                </button>
                <button
                    className={`tab-button ${activeTab === 'preparaciones' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preparaciones')}
                    style={{ padding: '10px 20px', border: 'none', background: 'none', borderBottom: activeTab === 'preparaciones' ? '2px solid #4e342e' : 'none', fontWeight: activeTab === 'preparaciones' ? 'bold' : 'normal', color: activeTab === 'preparaciones' ? '#4e342e' : '#666' }}
                >
                    Preparaciones
                </button>
            </div>

            <div className="table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Precio</th>
                            <th>Estado</th>
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
                                <td>{product.tipo_producto}</td>
                                <td>${product.precio?.toLocaleString('es-CL')}</td>
                                <td>
                                    <span className={`status-badge ${product.disponible ? 'available' : 'unavailable'}`}>
                                        {product.disponible ? 'Disponible' : 'No disponible'}
                                    </span>
                                </td>
                                <td>
                                    <div className="actions">
                                        <button
                                            onClick={() => navigate(`/admin/productos/editar/${product.id_producto}`)}
                                            className="btn-secondary"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                        >
                                            <Edit size={16} />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id_producto)}
                                            className="btn-danger"
                                        >
                                            <Trash2 size={16} />
                                            Eliminar
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
        </div>
    );
};

export default Products;
