import React, { useState, useEffect } from 'react';
import './GranoGeneral.css'; 
import { Carousel, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import { getCartDetails } from '../../firebaseCartService'; 
import { supabase } from '../../supabaseClient'; 

const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
};

// --- COMPONENTE TARJETA ---
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
                
                <img 
                    src={coffee.imageUrl || '/logo-cafepoiesis.jpg'} 
                    alt={coffee.name} 
                    className="coffee-image"
                    onError={(e) => { e.target.src = '/logo-cafepoiesis.jpg'; }} 
                />
                
                {qty > 0 && (
                    <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        backgroundColor: '#d32f2f', color: 'white', borderRadius: '50%',
                        width: '30px', height: '30px', display: 'flex', justifyContent: 'center',
                        alignItems: 'center', fontWeight: 'bold', fontSize: '14px', zIndex: 100,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)', border: '2px solid white'
                    }}>
                        {qty}
                    </div>
                )}

                <h3>{coffee.name}</h3>
                <p className="card-type">Café de grano</p> 
                
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

// --- CARRUSEL ---
const CarouselContent = ({ items }) => (
    <Carousel interval={null} indicators={false} wrap={true} variant="dark">
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
    const [coffees, setCoffees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCafes = async () => {
            try {
                const { data, error } = await supabase
                    .from('productos')
                    .select(`
                        *,
                        cafes_en_grano (*) 
                    `)
                    // 1. Filtramos por tipo (Flexible)
                    .ilike('tipo_producto', '%grano%') 
                    
                    // 2. Filtramos que esté disponible (Stock, etc)
                    .eq('disponible', true)
                    
                    // 3. NUEVO FILTRO: Solo mostramos si la columna 'mostrar' es TRUE
                    .eq('mostrar', true); 

                if (error) throw error;

                const formattedCafes = data.map(item => {
                    // Aquí ocurre el "JOIN" lógico. Extraemos los datos de la tabla relacionada
                    const detalles = Array.isArray(item.cafes_en_grano) 
                        ? item.cafes_en_grano[0] 
                        : item.cafes_en_grano;

                    return {
                        id: item.id_producto,
                        name: item.nombre,
                        price: (item.precio || 0).toLocaleString('es-CL'),
                        imageUrl: item.imagen || '/logo-cafepoiesis.jpg',
                        // Si hay detalles en la tabla hija, sacamos las notas, si no, vacío
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
                    <p>No se encontraron cafés para mostrar.</p>
                </div>
            ) : (
                <div className="carousel-container-wrapper">
                    <div className="d-md-none">
                        <CarouselContent items={cafesMobile} />
                    </div>
                    
                    <div className="d-none d-md-block">
                        <CarouselContent items={cafesDesktop} />
                    </div>
                </div>
            )}
        </main>
    );
}

export default GranoGeneral;