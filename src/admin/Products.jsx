import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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
                        {products.map(product => (
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
                {products.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                        No hay productos registrados
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
