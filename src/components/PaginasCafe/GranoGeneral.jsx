import React, { useState, useEffect } from 'react';
import './GranoGeneral.css'; 
import { Carousel, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
// Importamos getCartDetails para buscar todas las variantes de un café
import { getCartDetails } from '../../firebaseCartService'; 

const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
};

// --- NUEVO COMPONENTE: TARJETA DE CAFÉ CON PUNTITO ---
const CoffeeCard = ({ coffee }) => {
    const [qty, setQty] = useState(0);

    const calculateTotalQuantity = () => {
        const cart = getCartDetails();
        
        // LÓGICA ESPECIAL PARA CAFÉ DE GRANO:
        // El ID en el carro es complejo (ej: "1-250g-Grano")
        // El ID del café aquí es simple (ej: 1)
        // Sumamos todo lo que empiece con "1-"
        const total = cart.reduce((acc, item) => {
            const itemIdStr = String(item.id);
            const coffeeIdStr = String(coffee.id);

            // Si el item del carro EMPIEZA con el ID del café (ej: "1-...")
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
            <div className="coffee-card" style={{ position: 'relative' }}> {/* Position Relative es clave */}
                
                {/* IMAGEN */}
                <img src={coffee.imageUrl} alt={coffee.name} className="coffee-image" />
                
                {/* PUNTITO ROJO (Badge) */}
                {qty > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#d32f2f', // Rojo
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
                <p className="price">Desde: ${coffee.price}</p> 
            </div>
        </Link>
    );
};

// --- CARRUSEL ACTUALIZADO ---
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
                            {/* Usamos el componente inteligente aquí */}
                            <CoffeeCard coffee={coffee} />
                        </Col>
                    ))}
                </Row>
            </Carousel.Item>
        ))}
    </Carousel>
);

function GranoGeneral() {
    const coffees = [
        { id: 1, name: 'Bolivia Anproca', notes: 'Caramelo, Miel', price: "9.500", imageUrl: '/BoliviaAnproca.jpg' }, 
        { id: 2, name: 'Colombia Caldas Manzanares', notes: 'Chocolate blanco, Dulce de leche, Zeste de limón', price: "10.500", imageUrl: '/ColombiaCaldasManzanares.jpg' },
        { id: 3, name: 'Colombia Familia Zambrano', notes: 'Frutos amarillos, Chocolate, Caramelo, Acidez media citrica', price: "15.000", imageUrl: '/ColombiaFincaFamiliaZambrano.jpg' },
        { id: 4, name: 'Honduras Finca La Valentina', notes: 'Caramelo, Miel, Citrico', price: "15.000", imageUrl: '/HondurasFincaLaValentina.jpg' },
    ];
    
    const cafesMobile = chunkArray(coffees, 1);
    const cafesDesktop = chunkArray(coffees, 3);

    return (
        <main className="cafes-page-content"> 
            <h2>Nuestra Selección de Cafés de Grano</h2>
            <p className="description">
                Explora nuestros granos especiales, tostados a la perfección para resaltar sus perfiles de sabor únicos.
            </p>
            
            <div className="carousel-container-wrapper">
                <div className="d-md-none">
                    <CarouselContent items={cafesMobile} carouselId="carouselCafesMobile" />
                </div>
                
                <div className="d-none d-md-block">
                    <CarouselContent items={cafesDesktop} carouselId="carouselCafesDesktop" />
                </div>
            </div>
        </main>
    );
}

export default GranoGeneral;