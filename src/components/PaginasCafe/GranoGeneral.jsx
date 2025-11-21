import React, { useState, useEffect } from 'react';
import './GranoGeneral.css'; 
import { Carousel, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import { getCartDetails } from '../../firebaseCartService'; 
// 1. IMPORTAMOS EL CLIENTE DE SUPABASE
import { supabase } from '../../supabaseClient'; 

const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
};

// --- COMPONENTE TARJETA (Mantenemos tu lógica del puntito rojo) ---
const CoffeeCard = ({ coffee }) => {
    const [qty, setQty] = useState(0);

    const calculateTotalQuantity = () => {
        const cart = getCartDetails();
        const total = cart.reduce((acc, item) => {
            const itemIdStr = String(item.id);
            const coffeeIdStr = String(coffee.id);

            if (itemIdStr.startsWith(`${coffeeIdStr}-`) || itemIdStr === coffeeIdStr) {
                return acc + item.quantity;
            }
            return acc;
        }, 0);

        setQty(total);
    };

    useEffect(() => {
        calculateTotalQuantity();
        window.addEventListener('cartUpdated', calculateTotalQuantity);
        return () => window.removeEventListener('cartUpdated', calculateTotalQuantity);
    }, [coffee.id]);

    return (
        <Link to={`/cafes/${coffee.id}`} className="coffee-card-link" style={{ textDecoration: 'none' }}>
            <div className="coffee-card" style={{ position: 'relative' }}>
                
                {/* IMAGEN (Con fallback por si viene vacía de la BD) */}
                <img 
                    src={coffee.imageUrl || 'https://placehold.co/300x400?text=No+Image'} 
                    alt={coffee.name} 
                    className="coffee-image" 
                />
                
                {/* PUNTITO ROJO (Badge) */}
                {qty > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        zIndex: 100,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                        border: '2px solid white'
                    }}>
                        {qty}
                    </div>
                )}

                <h3>{coffee.name}</h3>
                <p className="card-type">Café de grano</p> 
                
                {/* Mostramos las notas de cata si existen */}
                {coffee.notes && (
                    <p className="text-muted small fst-italic mb-1" style={{ fontSize: '0.9rem' }}>
                        {coffee.notes}
                    </p>
                )}

                <p className="price">Desde: ${coffee.price}</p> 
            </div>
        </Link>
    );
};

// --- CARRUSEL (Igual que antes) ---
const CarouselContent = ({ items, carouselId }) => (
    <Carousel 
        interval={null} 
        indicators={false} 
        wrap={true} 
        variant="dark"
    >
        {items.map((chunk, slideIndex) => (
            <Carousel.Item key={slideIndex}>
                <Row className="justify-content-center g-4 py-3"> 
                    {chunk.map((coffee, viewIdx) => (
                        <Col xs={12} md={4} key={viewIdx} className="d-flex justify-content-center">
                            <CoffeeCard coffee={coffee} />
                        </Col>
                    ))}
                </Row>
            </Carousel.Item>
        ))}
    </Carousel>
);

function GranoGeneral() {
    // 2. ESTADOS PARA DATOS DE LA BD
    const [coffees, setCoffees] = useState([]);
    const [loading, setLoading] = useState(true);

    // 3. CARGAR DATOS DESDE SUPABASE
    useEffect(() => {
        const fetchCafes = async () => {
            try {
                // Consultamos productos y sus detalles (cafes_en_grano)
                const { data, error } = await supabase
                    .from('productos')
                    .select(`
                        *,
                        cafes_en_grano (*)
                    `)
                    // Filtramos por el tipo exacto que tienes en tu BD
                    .eq('tipo_producto', 'cafes_en_grano') 
                    .eq('disponible', true);

                if (error) throw error;

                // Transformamos los datos al formato que usa tu componente
                const formattedCafes = data.map(item => {
                    // Manejo seguro de la relación (por si devuelve array u objeto)
                    const detalles = Array.isArray(item.cafes_en_grano) 
                        ? item.cafes_en_grano[0] 
                        : item.cafes_en_grano;

                    return {
                        id: item.id_producto, // ID de la BD
                        name: item.nombre,
                        // Formatear precio con puntos (ej: 9.500)
                        price: item.precio.toLocaleString('es-CL'),
                        imageUrl: item.imagen,
                        // Sacamos las notas de la tabla relacionada
                        notes: detalles ? detalles.notas_cata : ''
                    };
                });

                setCoffees(formattedCafes);
            } catch (error) {
                console.error('Error cargando cafés:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCafes();
    }, []);
    
    const cafesMobile = chunkArray(coffees, 1);
    const cafesDesktop = chunkArray(coffees, 3);

    if (loading) {
        return <div className="text-center py-5 my-5">Cargando selección de cafés... ☕</div>;
    }

    return (
        <main className="cafes-page-content"> 
            <h2>Nuestra Selección de Cafés de Grano</h2>
            <p className="description">
                Explora nuestros granos especiales, tostados a la perfección para resaltar sus perfiles de sabor únicos.
            </p>
            
            {coffees.length === 0 ? (
                <div className="text-center py-5">
                    <p>No hay cafés disponibles en este momento.</p>
                </div>
            ) : (
                <div className="carousel-container-wrapper">
                    <div className="d-md-none">
                        <CarouselContent items={cafesMobile} carouselId="carouselCafesMobile" />
                    </div>
                    
                    <div className="d-none d-md-block">
                        <CarouselContent items={cafesDesktop} carouselId="carouselCafesDesktop" />
                    </div>
                </div>
            )}
        </main>
    );
}

export default GranoGeneral;