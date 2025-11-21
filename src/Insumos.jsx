import React, { useState, useEffect } from 'react';
import { Carousel, Row, Col, Button } from 'react-bootstrap'; 
import './Insumos.css'; 
// IMPORTANTE: Ajusta la ruta si es necesario. Si Insumos.jsx y el servicio están en src/, usa "./"
import { addToCart, getProductQuantity } from './firebaseCartService'; 

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

// --- COMPONENTE TARJETA CON PUNTITO ROJO Y CONFIRMACIÓN ---
const InsumoCard = ({ item }) => {
    const [qty, setQty] = useState(0);
    const [isAdded, setIsAdded] = useState(false); // <--- 1. ESTADO NUEVO PARA LA CONFIRMACIÓN

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
        // Agregamos al carro
        addToCart(item.id, item.nombre, 1);
        
        // Actualizamos el puntito
        setTimeout(updateQuantity, 50);

        // --- 2. LÓGICA VISUAL DEL BOTÓN ---
        setIsAdded(true); // Cambiamos el botón a modo "Confirmación"
        
        // Esperamos 1.5 segundos y lo devolvemos a la normalidad
        setTimeout(() => {
            setIsAdded(false);
        }, 1500);
    };

    return (
        <div className="card h-100 card-insumo shadow-sm border-0"> 
            {/* Contenedor Relativo */}
            <div style={{ position: 'relative' }}>
                <img src={item.imagen} className="card-img-top producto-img" alt={item.nombre} style={{ padding: '10px', objectFit: 'contain' }}/>
                
                {/* PUNTITO ROJO (Badge) */}
                {qty > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '15px',
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
            </div>

            <div className="card-body text-center d-flex flex-column p-2">
                <h5 className="card-title fs-6">{item.nombre}</h5>
                <p className="card-text text-muted small mt-auto">{item.subCategoria}</p>
                <p className="card-text fw-bold">{item.precio}</p>
                
                <div className='d-grid gap-2'>
                    {/* --- 3. BOTÓN DINÁMICO --- */}
                    <Button 
                        variant={isAdded ? "success" : "success"} // Usamos base success
                        onClick={handleAdd} 
                        className="btn-sm"
                        disabled={isAdded} // Deshabilitar mientras muestra el mensaje
                        // Si está añadido, dejamos el estilo por defecto de Bootstrap (Verde)
                        // Si NO, aplicamos tu estilo Café personalizado
                        style={isAdded ? {} : { backgroundColor: '#4e342e', borderColor: '#4e342e' }}
                    >
                        {isAdded ? "¡Añadido! ✔" : "+ Añadir"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- CARRUSEL (Sin cambios, solo renderiza InsumoCard) ---
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

const productos = [
    { id: 101, nombre: 'Aeropress Clear', precio: '$59.500', subCategoria: 'Cafetera', imagen: aeropressImg },
    { id: 102, nombre: 'Molino Hario Zebrang', precio: '$59.500', subCategoria: 'Accesorio', imagen: molinoImg },
    { id: 103, nombre: 'Filtros V60', precio: '$4.000', subCategoria: 'Filtros', imagen: filtrosV60Img },
    { id: 104, nombre: 'Filtros Aeropress', precio: '$12.000', subCategoria: 'Filtros', imagen: filtrosAeropressImg },
];

export default function Insumos() {
    const insumosMobile = chunkArray(productos, 1);
    const insumosDesktop = chunkArray(productos, 3);

    return (
        <section id="seccion-insumos" className="insumos container py-5">
            <h2 className="text-center mb-4">Insumos y Accesorios</h2>
            <div className="d-md-none">
                <CarouselContent items={insumosMobile} />
            </div>
            <div className="d-none d-md-block">
                <CarouselContent items={insumosDesktop} />
            </div>
        </section>
    );
}