import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Save, ArrowLeft } from 'lucide-react';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        tipo_producto: 'cafes_en_grano',
        subtipo_preparacion: 'Frias',
        imagen: '',
        mostrar: false,
        origen: '',
        altura_metros: '',
        proceso_beneficio: '',
        variedad: '',
        notas_cata: ''
    });

    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data: product, error } = await supabase
                .from('productos')
                .select('*')
                .eq('id_producto', id)
                .single();

            if (error) throw error;

            let cafeData = {};
            if (product.tipo_producto === 'cafes_en_grano' || (product.tipo_producto && product.tipo_producto.includes('café en grano'))) {
                const { data: cafe, error: cafeError } = await supabase
                    .from('cafes_en_grano')
                    .select('*')
                    .eq('id_producto', id)
                    .single();

                if (!cafeError && cafe) {
                    cafeData = {
                        origen: cafe.origen || '',
                        altura_metros: cafe.altura_metros || '',
                        proceso_beneficio: cafe.proceso_beneficio || '',
                        variedad: cafe.variedad || '',
                        notas_cata: cafe.notas_cata || ''
                    };
                }
            }

            setFormData({
                nombre: product.nombre || '',
                descripcion: product.descripcion || '',
                precio: product.precio || '',
                tipo_producto: (product.tipo_producto === 'cafes_en_grano' || (product.tipo_producto && product.tipo_producto.includes('café en grano')))
                    ? 'cafes_en_grano'
                    : product.tipo_producto || 'otro',
                subtipo_preparacion: product.subtipo_preparacion || 'Frias',
                imagen: product.imagen || '',
                mostrar: product.mostrar || false,
                origen: '',
                altura_metros: '',
                proceso_beneficio: '',
                variedad: '',
                notas_cata: '',
                ...cafeData
            });
        } catch (error) {
            console.error(error);
            alert('Error al cargar el producto');
            navigate('/admin/productos');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const isCoffee = formData.tipo_producto === 'cafes_en_grano' || (formData.tipo_producto && formData.tipo_producto.includes('café en grano'));

            const productData = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                precio: parseFloat(formData.precio),
                tipo_producto: formData.tipo_producto === 'preparaciones'
                    ? formData.subtipo_preparacion
                    : isCoffee
                        ? 'café en grano e insumo'
                        : formData.tipo_producto,
                imagen: formData.imagen,
                mostrar: formData.mostrar
            };

            let productId = id;

            if (isEditMode) {
                const { error } = await supabase
                    .from('productos')
                    .update(productData)
                    .eq('id_producto', id);
                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('productos')
                    .insert([productData])
                    .select()
                    .single();
                if (error) throw error;
                productId = data.id_producto;
            }

            if (isCoffee) {
                const cafeData = {
                    id_producto: productId,
                    origen: formData.origen,
                    altura_metros: formData.altura_metros ? parseFloat(formData.altura_metros) : null,
                    proceso_beneficio: formData.proceso_beneficio,
                    variedad: formData.variedad,
                    notas_cata: formData.notas_cata
                };

                const { error } = await supabase
                    .from('cafes_en_grano')
                    .upsert(cafeData);

                if (error) {
                    throw error;
                }
            } else if (isEditMode) {
                await supabase.from('cafes_en_grano').delete().eq('id_producto', productId);
            }

            navigate('/admin/productos');
        } catch (error) {
            console.error(error);
            alert('Error al guardar el producto: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Botón Volver - Móvil: arriba del título */}
            <div className="product-form-back-mobile">
                <button onClick={() => navigate('/admin/productos')} className="btn-secondary">
                    <ArrowLeft size={20} />
                    Volver
                </button>
            </div>

            <div className="page-header">
                <h1 className="page-title">{isEditMode ? 'Editar Producto' : 'Nuevo Producto'}</h1>
            </div>

            {/* Botón Volver - Desktop: arriba del formulario, esquina derecha */}
            <div className="product-form-wrapper">
                <div className="product-form-back-desktop">
                    <button onClick={() => navigate('/admin/productos')} className="btn-secondary">
                        <ArrowLeft size={20} />
                        Volver
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label className="form-label">Nombre *</label>
                    <input
                        type="text"
                        name="nombre"
                        className="form-input"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Ej: Café Colombia Finca La Esperanza"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <textarea
                        name="descripcion"
                        className="form-textarea"
                        value={formData.descripcion || ''}
                        onChange={handleChange}
                        placeholder="Describe el producto..."
                    />
                </div>

                <div className="form-grid-2-col">
                    <div className="form-group">
                        <label className="form-label">Precio *</label>
                        <input
                            type="number"
                            name="precio"
                            className="form-input"
                            value={formData.precio}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                            placeholder="0.00"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tipo de Producto *</label>
                        <select
                            name="tipo_producto"
                            className="form-select"
                            value={formData.tipo_producto}
                            onChange={handleChange}
                            required
                        >
                            <option value="cafes_en_grano">Café en Grano</option>
                            <option value="insumos">Insumos</option>
                            <option value="accesorio">Accesorio</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">URL de Imagen</label>
                    <input
                        type="text"
                        name="imagen"
                        className="form-input"
                        value={formData.imagen}
                        onChange={handleChange}
                        placeholder="https://ejemplo.com/imagen.jpg"
                    />
                </div>

                <div className="form-group">
                    <label className="form-checkbox-container">
                        <input
                            type="checkbox"
                            name="mostrar"
                            checked={formData.mostrar}
                            onChange={handleChange}
                        />
                        <span>Mostrar Producto en la tienda</span>
                    </label>
                </div>

                {(formData.tipo_producto === 'cafes_en_grano' || (formData.tipo_producto && formData.tipo_producto.includes('café en grano'))) && (
                    <div className="form-section">
                        <h3 className="form-section-title">Detalles del Café</h3>

                        <div className="form-grid-2-col">
                            <div className="form-group">
                                <label className="form-label">Origen</label>
                                <input
                                    type="text"
                                    name="origen"
                                    className="form-input"
                                    value={formData.origen || ''}
                                    onChange={handleChange}
                                    placeholder="Ej: Colombia, Caldas"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Altura (metros)</label>
                                <input
                                    type="number"
                                    name="altura_metros"
                                    className="form-input"
                                    value={formData.altura_metros || ''}
                                    onChange={handleChange}
                                    placeholder="Ej: 1800"
                                />
                            </div>
                        </div>

                        <div className="form-grid-2-col">
                            <div className="form-group">
                                <label className="form-label">Proceso / Beneficio</label>
                                <input
                                    type="text"
                                    name="proceso_beneficio"
                                    className="form-input"
                                    value={formData.proceso_beneficio || ''}
                                    onChange={handleChange}
                                    placeholder="Ej: Lavado, Natural"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Variedad</label>
                                <input
                                    type="text"
                                    name="variedad"
                                    className="form-input"
                                    value={formData.variedad || ''}
                                    onChange={handleChange}
                                    placeholder="Ej: Caturra, Typica"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Notas de Cata</label>
                            <textarea
                                name="notas_cata"
                                className="form-textarea"
                                value={formData.notas_cata || ''}
                                onChange={handleChange}
                                placeholder="Chocolate, Frutos rojos, Caramelo..."
                            />
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin/productos')} className="btn-secondary">
                        Cancelar
                    </button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        <Save size={20} />
                        {loading ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
};

export default ProductForm;