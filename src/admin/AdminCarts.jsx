import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AdminCarts = () => {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCarts();
    }, []);

    const fetchCarts = async () => {
        try {
            const { data, error } = await supabase
                .from('carritos') // Asumiendo nombre de tabla 'carritos'
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCarts(data || []);
        } catch (error) {
            console.error('Error fetching carts:', error);
            // No mostramos alerta para no molestar si la tabla no existe aún
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Cargando carritos...</div>;

    return (
        <div>
            <h1 className="page-title">Carritos Activos</h1>
            <div className="table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carts.map(cart => (
                            <tr key={cart.id}>
                                <td>{cart.id}</td>
                                <td>{new Date(cart.created_at).toLocaleDateString()}</td>
                                <td>{cart.items_count || 0}</td>
                                <td>${cart.total?.toLocaleString('es-CL')}</td>
                                <td>{cart.status || 'Pendiente'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {carts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                        No hay carritos registrados
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCarts;
