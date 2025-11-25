import React from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';
import './Preparaciones.css';
import { PrevIcon, NextIcon } from './utils/CarouselArrows';

import imgCapuccino from './img/capuccino.jpg';
import imgEspresso from './img/espresso.jpg';
import imgFiltrado from './img/CafeFiltrado.jpg';
import imgEspressoTonic from './img/EspressoTonic.jpg';
import imgMocaccino from './img/mocaccino.jpg';
import imgAffogatto from './img/affogato.jpg';
import imgMatcha from './img/MatchaLatte.jpg';
import imgChocolate from './img/ChocolateCaliente.jpg';

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
      variant={null}
      prevIcon={PrevIcon} 
      nextIcon={NextIcon}
  >
      {items.map((chunk, slideIndex) => (
          <Carousel.Item key={slideIndex}>
              <Row className="justify-content-center g-4"> 
                  {chunk.map((item, viewIdx) => (
                      <Col xs={12} md={4} key={viewIdx} className="d-flex justify-content-center">
                          <div className="preparacion-card">
                              <img src={item.imagen} alt={item.nombre} className="preparacion-image" />
                              <h3>{item.nombre}</h3>
                          </div>
                      </Col>
                  ))}
              </Row>
          </Carousel.Item>
      ))}
  </Carousel>
);

function Preparaciones() {
    const preparacionesMobile = chunkArray(preparaciones, 1);
    const preparacionesDesktop = chunkArray(preparaciones, 3);

    return (
        <main className="preparaciones-page-content"> 
            <h2>Nuestras Preparaciones</h2>
            <p className="description">
                Descubre nuestra variedad de bebidas, preparadas por baristas expertos para tu disfrute.
            </p>
            
            <div className="carousel-container-wrapper">
                <div className="d-md-none">
                    <CarouselContent items={preparacionesMobile} carouselId="carouselPreparacionesMobile" />
                </div>
                
                <div className="d-none d-md-block">
                    <CarouselContent items={preparacionesDesktop} carouselId="carouselPreparacionesDesktop" />
                </div>
            </div>
        </main>
    );
}

export default Preparaciones;