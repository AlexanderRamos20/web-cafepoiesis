// Contenido completo y corregido para tu archivo: src/Preparaciones.jsx

import React, { useState } from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';
import './Preparaciones.css';

// --- Nombres de importación corregidos para que coincidan con tus archivos ---
import imgCapuccino from './img/capuccino.jpg';
import imgEspresso from './img/espresso.jpg';
import imgFiltrado from './img/CafeFiltrado.jpg'; // Corregido
import imgEspressoTonic from './img/espressoTonic.jpg'; // Corregido
import imgMocaccino from './img/mocaccino.jpg';
import imgAffogatto from './img/affogato.jpg';
import imgMatcha from './img/MatchaLatte.jpg'; // Corregido
import imgChocolate from './img/ChocolateCaliente.jpg'; // Corregido (usando la imagen disponible)

const preparaciones = [
  { nombre: 'Capuccino', imagen: imgCapuccino },
  { nombre: 'Espresso', imagen: imgEspresso },
  { nombre: 'Café Filtrado', imagen: imgFiltrado },
  { nombre: 'Espresso Tonic', imagen: imgEspressoTonic },
  { nombre: 'Mocaccino', imagen: imgMocaccino },
  { nombre: 'Affogatto', imagen: imgAffogatto },
  { nombre: 'Matcha Latte', imagen: imgMatcha },
  { nombre: 'Chocolate Caliente', imagen: imgChocolate }
];

// La función getCyclicView se encarga de agrupar los items para el carrusel
const getCyclicView = (items, startIndex) => {
    const numItems = items.length;
    const view = [];
    for (let i = 0; i < 3; i++) {
        const itemIndex = (startIndex + i) % numItems;
        view.push(items[itemIndex]);
    }
    return view;
};

function Preparaciones() {
    const [index, setIndex] = useState(0);
    const numSlides = preparaciones.length; 

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex); 
    };

    return (
        <main className="preparaciones-page-content"> 
            <h2>Nuestras Preparaciones</h2>
            <p className="description">
                Descubre nuestra variedad de bebidas, preparadas por baristas expertos para tu disfrute.
            </p>
            
            <div className="carousel-container-wrapper">
                <Carousel 
                    activeIndex={index}
                    onSelect={handleSelect}
                    interval={null} 
                    indicators={false} 
                    wrap={true} 
                >
                    {Array.from({ length: numSlides }).map((_, slideIndex) => {
                        const currentView = getCyclicView(preparaciones, slideIndex);
                        
                        return (
                            <Carousel.Item key={slideIndex}>
                                <Row className="justify-content-center g-4"> 
                                    {currentView.map((item, viewIdx) => (
                                        <Col xs={12} md={4} key={viewIdx} className="d-flex justify-content-center">
                                            <div className="preparacion-card">
                                                <img src={item.imagen} alt={item.nombre} className="preparacion-image" />
                                                <h3>{item.nombre}</h3>
                                            </div>
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

export default Preparaciones;