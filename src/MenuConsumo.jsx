import React from 'react';
import { Button, Container, Card } from 'react-bootstrap';

function MenuConsumo() {
    // Asegúrate de que este archivo esté en tu carpeta 'public'
    const nombreDelArchivoPDF = "carta-2022-verano-1.pdf"; 

    return (
        <div 
            className="menu-section py-5" 
            style={{ 
                backgroundColor: '#fdfbf7', // Fondo crema muy suave
                // Un patrón sutil de puntos para darle textura de papel
                backgroundImage: 'radial-gradient(#e3dcd5 1px, transparent 1px)', 
                backgroundSize: '20px 20px'
            }}
        >
            <Container className="d-flex justify-content-center align-items-center">
                <Card 
                    className="shadow-lg border-0 text-center position-relative" 
                    style={{ 
                        maxWidth: '600px', 
                        borderRadius: '15px',
                        overflow: 'hidden',
                        backgroundColor: '#fff'
                    }}
                >
                    {/* Franja superior decorativa color café */}
                    <div 
                        className="card-header-deco py-4"
                        style={{ 
                            backgroundColor: '#4e342e', 
                            color: '#fff',
                            borderBottom: '4px solid #a1887f' // Línea de acento
                        }}
                    >
                        <h2 className="m-0" style={{ fontFamily: 'serif', letterSpacing: '2px' }}>NUESTRA CARTA</h2>
                        <small style={{ textTransform: 'uppercase', letterSpacing: '3px', opacity: 0.8, fontSize: '0.75rem' }}>
                            Café Poiesis
                        </small>
                    </div>

                    <Card.Body className="p-5">
                        {/* Icono SVG de Libro/Menú abierto */}
                        <div className="mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#a1887f" className="bi bi-book-half" viewBox="0 0 16 16">
                                <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
                            </svg>
                        </div>

                        <Card.Title as="h3" className="mb-3" style={{ color: '#4e342e', fontWeight: 'bold' }}>
                            Explora Sabores Únicos
                        </Card.Title>
                        
                        <Card.Text className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                            Te invitamos a descubrir nuestra selección de cafés de especialidad, preparaciones de autor y pastelería artesanal.
                            <br/>
                            <span style={{ display: 'block', marginTop: '10px', fontSize: '0.95rem', fontStyle: 'italic', color: '#8d6e63' }}>
                                "Cada taza cuenta una historia"
                            </span>
                        </Card.Text>

                        <Button 
                            href={`/${nombreDelArchivoPDF}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            size="lg"
                            className="px-5 py-3 shadow-sm"
                            style={{
                                backgroundColor: '#a1887f', // Color café con leche
                                borderColor: '#a1887f',
                                borderRadius: '50px', // Botón píldora
                                textTransform: 'uppercase',
                                fontWeight: '600',
                                letterSpacing: '1px',
                                transition: 'all 0.3s ease'
                            }}
                            // Animación simple al pasar el mouse
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#4e342e'; // Se oscurece
                                e.currentTarget.style.borderColor = '#4e342e';
                                e.currentTarget.style.transform = 'translateY(-2px)'; // Se levanta un poco
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#a1887f';
                                e.currentTarget.style.borderColor = '#a1887f';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            📖 Ver Carta Digital
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default MenuConsumo;