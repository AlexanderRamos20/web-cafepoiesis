import React, { useState, useEffect } from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';
import './Preparaciones.css';
import { supabase } from './supabaseClient';

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
                    {chunk.map((item, viewIdx) => (
                        <Col xs={12} md={4} key={viewIdx} className="d-flex justify-content-center">
                            <div className="preparacion-card">
                                <img
                                    src={item.imagen}
                                    alt={item.nombre}
                                    className="preparacion-image"
                                    onError={(e) => { e.target.src = 'https://placehold.co/300x300?text=Imagen+No+Disponible'; }}
                                />
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
    const [preparaciones, setPreparaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPreparaciones = async () => {
            try {
                const { data, error } = await supabase
                    .from('productos')
                    .select('*')
                    .eq('disponible', true);

                if (error) throw error;

                // Debug: Log all tipo_producto values
                console.log('All available products:', data);
                const uniqueTypes = [...new Set(data.map(p => p.tipo_producto))];
                console.log('Unique tipo_producto values:', uniqueTypes);

                // Filter client-side for 'Frias' and 'cafetería'
                const filtered = data.filter(p =>
                    p.tipo_producto === 'Frias' || p.tipo_producto === 'cafetería'
                );

                console.log('Filtered preparaciones:', filtered);
                setPreparaciones(filtered || []);
            } catch (error) {
                console.error('Error fetching preparaciones:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPreparaciones();
    }, []);

    const preparacionesMobile = chunkArray(preparaciones, 1);
    const preparacionesDesktop = chunkArray(preparaciones, 3);

    if (loading) return <div className="text-center py-5">Cargando preparaciones... ☕</div>;

    return (
        <main className="preparaciones-page-content">
            <h2>Nuestras Preparaciones</h2>
            <p className="description">
                Descubre nuestra variedad de bebidas, preparadas por baristas expertos para tu disfrute.
            </p>

            {preparaciones.length === 0 ? (
                <div className="text-center py-5">
                    <p>No hay preparaciones disponibles en este momento.</p>
                </div>
            ) : (
                <div className="carousel-container-wrapper">
                    <div className="d-md-none">
                        <CarouselContent items={preparacionesMobile} carouselId="carouselPreparacionesMobile" />
                    </div>

                    <div className="d-none d-md-block">
                        <CarouselContent items={preparacionesDesktop} carouselId="carouselPreparacionesDesktop" />
                    </div>
                </div>
            )}
        </main>
    );
}

export default Preparaciones;