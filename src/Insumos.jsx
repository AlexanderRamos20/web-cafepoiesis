import React, { useState, useEffect } from 'react';
import { Carousel, Row, Col, Button } from 'react-bootstrap'; 
import './Insumos.css'; 
import { addToCart, getProductQuantity } from './firebaseCartService'; 
import { supabase } from './supabaseClient'; 

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
        addToCart(item.id, item.nombre, 1, item.precio);
        
        setTimeout(updateQuantity, 50);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    return (
        <div className="card h-100 card-insumo shadow-sm border-0"> 
            <div style={{ position: 'relative' }}>
                <img 
                    src={item.imagen || '/logo-cafepoiesis.jpg'} 
                    className="card-img-top producto-img" 
                    alt={item.nombre} 
                    onError={(e) => { e.target.src = '/logo-cafepoiesis.jpg'; }}
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
                <p className="card-text text-muted small mt-auto">
                    {item.subCategoria || 'Accesorio'}
                </p>
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
                // 1. Traemos TODOS los productos visibles
                // Y pedimos también la relación con cafes_en_grano (LEFT JOIN)
                const { data, error } = await supabase
                    .from('productos')
                    .select(`
                        *,
                        cafes_en_grano (*)
                    `)
                    .eq('mostrar', true)
                    .eq('disponible', true);

                if (error) throw error;

                // 2. FILTRADO EN MEMORIA (Lógica de Negocio)
                // "Si cafes_en_grano está VACÍO, entonces es un insumo/accesorio"
                const soloInsumos = data.filter(item => {
                    const esCafe = item.cafes_en_grano && (
                        Array.isArray(item.cafes_en_grano) 
                            ? item.cafes_en_grano.length > 0 
                            : true // Si es objeto y no es null, existe
                    );
                    
                    // Queremos lo que NO sea café
                    return !esCafe;
                });

                const formattedInsumos = soloInsumos.map(item => ({
                    id: item.id_producto,
                    nombre: item.nombre,
                    subCategoria: item.descripcion, 
                    precio: `$${(item.precio || 0).toLocaleString('es-CL')}`, 
                    imagen: item.imagen || '/logo-cafepoiesis.jpg'
                }));

                setInsumos(formattedInsumos);
            } catch (error) {
                console.error("Error cargando insumos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInsumos();
    }, []);

    const insumosMobile = chunkArray(insumos, 1);
    const insumosDesktop = chunkArray(insumos, 3);

    if (loading) return <div className="text-center py-5 my-5">Cargando accesorios... ⚙️</div>;

    return (
        <section id="seccion-insumos" className="insumos container py-5">
            <h2 className="text-center mb-4">Insumos y Accesorios</h2>
            
            {insumos.length === 0 ? (
                <div className="text-center py-5">
                    <p>No se encontraron productos disponibles.</p>
                </div>
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