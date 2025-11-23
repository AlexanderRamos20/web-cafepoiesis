import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Trash2, Eye, Phone } from 'lucide-react';

const AdminForms = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedForm, setSelectedForm] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const { data, error } = await supabase
                .from('formulario_contacto')
                .select('*')
                .order('fecha_envio', { ascending: false });

            if (error) throw error;
            setForms(data || []);
        } catch (error) {
            console.error('Error fetching forms:', error);
            alert('Error al cargar los formularios: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id_mensaje) => {
        if (!confirm('¿Estás seguro de eliminar este mensaje?')) return;

        try {
            const { error } = await supabase
                .from('formulario_contacto')
                .delete()
                .eq('id_mensaje', id_mensaje);

            if (error) throw error;

            fetchForms();
        } catch (error) {
            console.error('Error deleting form:', error);
            alert('Error al eliminar el mensaje');
        }
    };

    const handleViewDetails = (form) => {
        setSelectedForm(form);
        setShowModal(true);
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

    if (loading) {
        return <div>Cargando formularios...</div>;
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">
                    <Mail size={28} style={{ marginRight: '10px' }} />
                    Mensajes de Contacto
                </h1>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                    Total de mensajes: {forms.length}
                </div>
            </div>

            <div className="table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Mensaje</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forms.map(form => (
                            <tr key={form.id_mensaje}>
                                <td>{formatDate(form.fecha_envio)}</td>
                                <td>{form.nombre}</td>
                                <td>
                                    <a href={`mailto:${form.correo}`} style={{ color: '#4e342e', textDecoration: 'none' }}>
                                        {form.correo}
                                    </a>
                                </td>
                                <td>
                                    {form.telefono ? (
                                        <a href={`tel:${form.telefono}`} style={{ color: '#4e342e', textDecoration: 'none' }}>
                                            {form.telefono}
                                        </a>
                                    ) : (
                                        <span style={{ color: '#999' }}>-</span>
                                    )}
                                </td>
                                <td style={{
                                    maxWidth: '250px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {form.mensaje}
                                </td>
                                <td>
                                    <div className="actions">
                                        <button
                                            onClick={() => handleViewDetails(form)}
                                            className="btn-secondary"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                            title="Ver detalles completos"
                                        >
                                            <Eye size={16} />
                                            Ver
                                        </button>
                                        <button
                                            onClick={() => handleDelete(form.id_mensaje)}
                                            className="btn-danger"
                                            title="Eliminar mensaje"
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
                {forms.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                        <Mail size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p>No hay mensajes de contacto recibidos</p>
                    </div>
                )}
            </div>

            {/* Modal para ver detalles completos */}
            {showModal && selectedForm && (
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
                            maxWidth: '600px',
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
                            marginBottom: '1.5rem'
                        }}>
                            Detalles del Mensaje
                        </h2>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                                <strong>Fecha:</strong> {formatDate(selectedForm.fecha_envio)}
                            </p>
                            <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                                <strong>Nombre:</strong> {selectedForm.nombre}
                            </p>
                            <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                                <strong>Correo:</strong>{' '}
                                <a href={`mailto:${selectedForm.correo}`} style={{ color: '#4e342e' }}>
                                    {selectedForm.correo}
                                </a>
                            </p>
                            {selectedForm.telefono && (
                                <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                                    <strong>Teléfono:</strong>{' '}
                                    <a href={`tel:${selectedForm.telefono}`} style={{ color: '#4e342e' }}>
                                        <Phone size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                        {selectedForm.telefono}
                                    </a>
                                </p>
                            )}
                        </div>

                        <div style={{
                            backgroundColor: '#f9fafb',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem'
                        }}>
                            <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#4e342e' }}>
                                Mensaje:
                            </strong>
                            <p style={{ margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                {selectedForm.mensaje}
                            </p>
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
                                    handleDelete(selectedForm.id_mensaje);
                                    setShowModal(false);
                                }}
                                className="btn-danger"
                            >
                                <Trash2 size={16} />
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminForms;
