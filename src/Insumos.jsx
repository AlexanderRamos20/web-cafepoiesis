import React, { useState, useEffect } from 'react';
import { Carousel, Row, Col, Button } from 'react-bootstrap'; 
import './Insumos.css'; 
import { addToCart, getProductQuantity } from './firebaseCartService'; 
import { supabase } from './supabaseClient'; 

// YA NO NECESITAS IMPORTAR LAS IMÁGENES AQUÍ
// El componente las buscará automáticamente en la carpeta public

const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
};

// --- TARJETA INTELIGENTE ---
const InsumoCard = ({ item }) => {
    const [qty, setQty] = useState(0);
    const [isAdded, setIsAdded] = useState(false);

    const updateQuantity = () => {
        const count = getProductQuantity(item.id);
        setQty(count);
    };

    useEffect(() => {
        updateQuantity();
        window.addEventListener('cartUpdated', updateQuantity);
        return () => window.removeEventListener('cartUpdated', updateQuantity);
    }, [item.id]);

    const handleAdd = () => {
        addToCart(item.id, item.nombre, 1);
        setTimeout(updateQuantity, 50);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    return (
        <div className="card h-100 card-insumo shadow-sm border-0"> 
            <div style={{ position: 'relative' }}>
                {/* La imagen se carga directo desde la URL de la base de datos */}
                <img 
                    src={item.imagen} 
                    className="card-img-top producto-img" 
                    alt={item.nombre} 
                    // Fallback por si la imagen no se encuentra en public
                    onError={(e) => { e.target.src = 'https://placehold.co/300x300?text=Imagen+No+Encontrada'; }}
                    style={{ padding: '10px', objectFit: 'contain' }}
                />
                
                {qty > 0 && (
                    <div style={{
                        position: 'absolute', top: '10px', right: '15px',
                        backgroundColor: '#d32f2f', color: 'white', borderRadius: '50%',
                        width: '30px', height: '30px', display: 'flex', justifyContent: 'center',
                        alignItems: 'center', fontWeight: 'bold', fontSize: '14px', zIndex: 100,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)', border: '2px solid white'
                    }}>
                        {qty}
                    </div>
                )}
            </div>

            <div className="card-body text-center d-flex flex-column p-2">
                <h5 className="card-title fs-6">{item.nombre}</h5>
                <p className="card-text text-muted small mt-auto">{item.subCategoria}</p>
                <p className="card-text fw-bold">{item.precio}</p>
                
                <div className='d-grid gap-2'>
                    <Button 
                        variant={isAdded ? "success" : "success"}
                        onClick={handleAdd}
                        className="btn-sm"
                        disabled={isAdded}
                        style={isAdded ? {} : { backgroundColor: '#4e342e', borderColor: '#4e342e' }}
                    >
                        {isAdded ? "¡Añadido! ✔" : "+ Añadir"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const CarouselContent = ({ items }) => (
    <Carousel interval={null} indicators={false} wrap={true} variant="dark">
        {items.map((chunk, i) => (
            <Carousel.Item key={i}>
                <Row className="justify-content-center g-4 px-3 py-2"> 
                    {chunk.map((item) => (
                        <Col xs={12} md={4} key={item.id} className="d-flex justify-content-center">
                            <InsumoCard item={item} />
                        </Col>
                    ))}
                </Row>
            </Carousel.Item>
        ))}
    </Carousel>
);

export default function Insumos() {
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsumos = async () => {
            try {
                const { data, error } = await supabase
                    .from('productos')
                    .select('*')
                    .eq('tipo_producto', 'insumo') 
                    .eq('disponible', true);

                if (error) throw error;

                const formattedInsumos = data.map(item => ({
                    id: item.id_producto,
                    nombre: item.nombre,
                    subCategoria: item.descripcion, 
                    precio: `$${item.precio.toLocaleString('es-CL')}`, 
                    imagen: item.imagen // Esto será "/aeropress.jpg"
                }));

                setInsumos(formattedInsumos);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInsumos();
    }, []);

    const insumosMobile = chunkArray(insumos, 1);
    const insumosDesktop = chunkArray(insumos, 3);

    if (loading) return <div className="text-center py-5">Cargando accesorios... ⚙️</div>;

    return (
        <section id="seccion-insumos" className="insumos container py-5">
            <h2 className="text-center mb-4">Insumos y Accesorios</h2>
            
            {insumos.length === 0 ? (
                <p className="text-center">No hay insumos disponibles.</p>
            ) : (
                <div className="carousel-container-wrapper">
                    <div className="d-md-none">
                        <CarouselContent items={insumosMobile} />
                    </div>
                    <div className="d-none d-md-block">
                        <CarouselContent items={insumosDesktop} />
                    </div>
                </div>
            )}
        </section>
    );
}