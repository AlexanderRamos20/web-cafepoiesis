import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AdminForms = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const { data, error } = await supabase
                .from('formulario_contacto') // Asumiendo nombre de tabla
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setForms(data || []);
        } catch (error) {
            console.error('Error fetching forms:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Cargando formularios...</div>;

    return (
        <div>
            <h1 className="page-title">Mensajes de Contacto</h1>
            <div className="table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Categoría</th>
                            <th>Mensaje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forms.map(form => (
                            <tr key={form.id}>
                                <td>{new Date(form.created_at).toLocaleDateString()}</td>
                                <td>{form.nombre}</td>
                                <td>{form.email}</td>
                                <td>{form.categoria}</td>
                                <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {form.mensaje}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {forms.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                        No hay mensajes recibidos
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminForms;
