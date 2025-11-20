import React from 'react';
import { Carousel, Row, Col, Button } from 'react-bootstrap'; 
import './Insumos.css'; 
import { addToCart, removeFromCart } from './firebaseCartService'; 
import aeropressImg from './img/aeropress.jpg';
import molinoImg from './img/molino.jpg';
import filtrosV60Img from './img/filtros-v60.jpg';
import filtrosAeropressImg from './img/filtros-aeropress.jpg';


const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
};

const handleAdd = (item) => {
    addToCart(item.id, item.nombre, 1); 
    alert(`¡${item.nombre} añadido!`);
    window.dispatchEvent(new Event('cartUpdated')); 
};

const handleRemove = (item) => {
    removeFromCart(item.id); 
    alert(`¡${item.nombre} quitado del carro!`);
    window.dispatchEvent(new Event('cartUpdated')); 
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
                    {chunk.map((item) => (
                        <Col xs={12} md={4} key={item.id} className="d-flex justify-content-center">
                            <div className="card h-100 card-insumo"> 
                                <img src={item.imagen} className="card-img-top producto-img" alt={item.nombre} />
                                <div className="card-body text-center d-flex flex-column p-2">
                                    <h5 className="card-title fs-6">{item.nombre}</h5>
                                    
                                    <p className="card-text text-muted fst-italic small mt-auto">{item.subCategoria}</p>
                                    <p className="card-text fw-bold">{item.precio}</p>
                                    
                                    <div className='d-grid gap-2'>
                                        <Button 
                                            variant="success" 
                                            onClick={() => handleAdd(item)}
                                            style={{ backgroundColor: '#4e342e', borderColor: '#4e342e' }} 
                                            className="btn-sm"
                                        >
                                            + Añadir al Carro
                                        </Button>
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={() => handleRemove(item)}
                                            className="btn-sm"
                                        >
                                            - Quitar Ítem
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Carousel.Item>
        ))}
    </Carousel>
);

const productos = [
    { id: 101, nombre: 'Aeropress Clear', precio: '$59.500', subCategoria: 'Cafetera', imagen: aeropressImg },
    { id: 102, nombre: 'Molino Hario Zebrang', precio: '$59.500', subCategoria: 'Accesorio', imagen: molinoImg },
    { id: 103, nombre: 'Filtros V60', precio: '$4.000', subCategoria: 'Filtros', imagen: filtrosV60Img },
    { id: 104, nombre: 'Filtros Aeropress', precio: '$12.000', subCategoria: 'Filtros', imagen: filtrosAeropressImg },
];

function Insumos() {
    const insumosMobile = chunkArray(productos, 1);
    const insumosDesktop = chunkArray(productos, 3);

    return (
        <section id="seccion-insumos" className="insumos container py-5">
            <h2 className="text-center">Insumos y Accesorios</h2>
            
            <div className="carousel-container-wrapper">
                <div className="d-md-none">
                    <CarouselContent items={insumosMobile} carouselId="carouselInsumosMobile" />
                </div>
                
                <div className="d-none d-md-block">
                    <CarouselContent items={insumosDesktop} carouselId="carouselInsumosDesktop" />
                </div>
            </div>
        </section>
    );
}

export default Insumos;