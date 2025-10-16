import React from 'react';
import './GranoGeneral.css'; 
import { Carousel, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 

const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
};

const CarouselContent = ({ items, carouselId }) => (
    <Carousel 
        interval={null} 
        indicators={false} 
        wrap={true} 
    >
        {items.map((chunk, slideIndex) => (
            <Carousel.Item key={slideIndex}>
                <Row className="justify-content-center g-4"> 
                    {chunk.map((coffee, viewIdx) => (
                        <Col xs={12} md={4} key={viewIdx} className="d-flex justify-content-center">
                            <Link to={`/cafes/${coffee.id}`} className="coffee-card-link">
                                <div className="coffee-card">
                                    <img src={coffee.imageUrl} alt={coffee.name} className="coffee-image" />
                                    <h3>{coffee.name}</h3>
                                    <p className="card-type">Café de grano</p> 
                                    <p className="price">Desde: ${coffee.price}</p> 
                                </div>
                            </Link>
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