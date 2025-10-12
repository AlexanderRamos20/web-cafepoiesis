import React, { useState } from 'react';
import './GranoGeneral.css'; 
import { Carousel, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 

const getCyclicView = (coffees, startIndex) => {
    const numCoffees = coffees.length;
    const view = [];
    for (let i = 0; i < 3; i++) {
        const coffeeIndex = (startIndex + i) % numCoffees;
        view.push(coffees[coffeeIndex]);
    }
    return view;
};

function GranoGeneral() {
    const [index, setIndex] = useState(0);

    const coffees = [
        { id: 1, name: 'Bolivia Anproca', notes: 'Caramelo, Miel', price: "9.500", imageUrl: '/BoliviaAnproca.jpg' }, 
        { id: 2, name: 'Colombia Caldas Manzanares', notes: 'Chocolate blanco, Dulce de leche, Zeste de limón', price: "10.500", imageUrl: '/ColombiaCaldasManzanares.jpg' },
        { id: 3, name: 'Colombia Familia Zambrano', notes: 'Frutos amarillos, Chocolate, Caramelo, Acidez media citrica', price: "15.000", imageUrl: '/ColombiaFincaFamiliaZambrano.jpg' },
        { id: 4, name: 'Honduras Finca La Valentina', notes: 'Caramelo, Miel, Citrico', price: "15.000", imageUrl: '/HondurasFincaLaValentina.jpg' },
    ];
    
    const numSlides = coffees.length; 
    
    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex); 
    };

    return (
        <main className="cafes-page-content"> 
            <h2>Nuestra Selección de Cafés de Grano</h2>
            <p className="description">
                Explora nuestros granos especiales, tostados a la perfección para resaltar sus perfiles de sabor únicos.
            </p>
            
            <div className="carousel-container-wrapper">
                <Carousel 
                    activeIndex={index}
                    onSelect={handleSelect}
                    interval={null} 
                    indicators={false} 
                    wrap={true} 
                    slide={true} 
                >
                    {Array.from({ length: numSlides }).map((_, slideIndex) => {
                        const currentView = getCyclicView(coffees, slideIndex);
                        
                        return (
                            <Carousel.Item key={slideIndex}>
                                <Row className="justify-content-center g-4"> 
                                    {currentView.map((coffee, viewIdx) => (
                                        <Col xs={12} md={4} key={viewIdx} className="d-flex justify-content-center">
                                            <Link 
                                                to={`/cafes/${coffee.id}`} 
                                                className="coffee-card-link" 
                                            >
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
                        );
                    })}
                </Carousel>
            </div>
        </main>
    );
}

export default GranoGeneral;