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
        disponible: true,
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
            if (product.tipo_producto === 'cafes_en_grano') {
                const { data: cafe } = await supabase
                    .from('cafes_en_grano')
                    .select('*')
                    .eq('id_producto', id)
                    .single();

                if (cafe) {
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
                ...product,
                ...cafeData
            });
        } catch (error) {
            console.error('Error fetching product:', error);
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
            const productData = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                precio: parseFloat(formData.precio),
                tipo_producto: formData.tipo_producto === 'preparaciones'
                    ? formData.subtipo_preparacion
                    : formData.tipo_producto === 'cafes_en_grano'
                        ? 'café en grano e insumo'
                        : formData.tipo_producto,
                imagen: formData.imagen,
                disponible: formData.disponible
            };

            let productId = id;

            if (isEditMode) {
                const { error } = await supabase
                    .from('productos')
                    .update(productData)
                    .eq('id_producto', id);
                if (error) throw error;
            } else {
                console.log('Intentando guardar producto:', productData);
                const { data, error } = await supabase
                    .from('productos')
                    .insert([productData])
                    .select()
                    .single();
                if (error) {
                    console.error('Error al insertar en productos:', error);
                    throw error;
                }
                console.log('Producto guardado exitosamente:', data);
                productId = data.id_producto;
            }

            if (formData.tipo_producto === 'cafes_en_grano') {
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

                if (error) throw error;
            } else if (isEditMode) {
                await supabase.from('cafes_en_grano').delete().eq('id_producto', productId);
            }

            navigate('/admin/productos');
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error al guardar el producto: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">{isEditMode ? 'Editar Producto' : 'Nuevo Producto'}</h1>
                <button onClick={() => navigate('/admin/productos')} className="btn-secondary">
                    <ArrowLeft size={20} />
                    Volver
                </button>
            </div>

            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        className="form-input"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <textarea
                        name="descripcion"
                        className="form-textarea"
                        value={formData.descripcion}
                        onChange={handleChange}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Precio</label>
                        <input
                            type="number"
                            name="precio"
                            className="form-input"
                            value={formData.precio}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tipo de Producto</label>
                        <select
                            name="tipo_producto"
                            className="form-select"
                            value={formData.tipo_producto}
                            onChange={handleChange}
                            required
                        >
                            <option value="cafes_en_grano">Café en Grano</option>
                            <option value="insumos">Insumos</option>

                            <option value="preparaciones">Preparaciones</option>
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
                        placeholder="https://..."
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            name="disponible"
                            checked={formData.disponible}
                            onChange={handleChange}
                        />
                        Disponible para la venta
                    </label>
                </div>

                {formData.tipo_producto === 'preparaciones' && (
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
                        <div className="form-group">
                            <label className="form-label">Tipo de Preparación</label>
                            <select
                                name="subtipo_preparacion"
                                className="form-select"
                                value={formData.subtipo_preparacion}
                                onChange={handleChange}
                                required
                            >
                                <option value="Frias">Preparaciones Frías</option>
                                <option value="cafetería">Preparaciones Calientes (Cafetería)</option>
                            </select>
                        </div>
                    </div>
                )}

                {formData.tipo_producto === 'cafes_en_grano' && (
                    <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--coffee-primary)' }}>Detalles del Café</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Origen</label>
                                <input
                                    type="text"
                                    name="origen"
                                    className="form-input"
                                    value={formData.origen}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Altura (metros)</label>
                                <input
                                    type="number"
                                    name="altura_metros"
                                    className="form-input"
                                    value={formData.altura_metros}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Proceso / Beneficio</label>
                                <input
                                    type="text"
                                    name="proceso_beneficio"
                                    className="form-input"
                                    value={formData.proceso_beneficio}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Variedad</label>
                                <input
                                    type="text"
                                    name="variedad"
                                    className="form-input"
                                    value={formData.variedad}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Notas de Cata</label>
                            <textarea
                                name="notas_cata"
                                className="form-textarea"
                                value={formData.notas_cata}
                                onChange={handleChange}
                                placeholder="Chocolate, Frutos rojos..."
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
    );
};

export default ProductForm;
