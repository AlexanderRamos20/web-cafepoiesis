import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Button, Form, Accordion } from 'react-bootstrap'; 

// IMPORTACIONES DE COMPONENTES
// Nota: ".." sube un nivel (a src/components/)
import Header from '../header.jsx';
import Footer from '../footer.jsx';
import BurbujaCarrito from '../BurbujaCarrito'; 

// IMPORTACIÓN DEL SERVICIO
// Nota: "../.." sube dos niveles (a src/)
import { addToCart } from '../../firebaseCartService'; 

const mockCoffeeDetails = {
    1: { 
        name: 'Bolivia Anproca', category: 'Café en grano', price: "9.500", imageUrl: '/BoliviaAnproca.jpg', 
        detail: { origin: 'Bolivia', variety: 'Castillo, Caturra', process: 'Lavado', notes: 'Caramelo, Miel', rating: 4.8 },
        history: "Se dice que el primer grano de Anproca fue descubierto por un cóndor andino, quien lo dejó caer sobre la mesa de un chamán. Este café lleva la mística y la pureza de las montañas bolivianas, cosechado a mano bajo el sol eterno. Es una experiencia suave y dulce, ideal para el despertar de los espíritus.",
        technical: "Este blend, cultivado a más de 1600 m.s.n.m., fue seleccionado por su baja acidez y cuerpo completo. Perfecto para métodos de filtrado lento, resalta su dulzura natural.",
    },
    2: { 
        name: 'Colombia Caldas Manzanares', category: 'Café en grano', price: "10.500", imageUrl: '/ColombiaCaldasManzanares.jpg', 
        detail: { origin: 'Colombia', variety: 'Castillo, Caturra', process: 'Lavado', notes: 'Chocolate blanco, Dulce de leche y Zeste de Limón', rating: 4.5 },
        history: "Nacido en las faldas del Nevado del Ruiz, este café lleva la energía de los volcanes. Nuestros caficultores lo protegen bajo el dosel de los plátanos, infundiendo en cada grano un secreto de la tierra. Es un café vibrante y complejo, ideal para romper la rutina.",
        technical: "Procesado meticulosamente en un lavado de 18 horas para resaltar su brillante acidez cítrica. Recomendado para espresso, donde sus notas de chocolate blanco se vuelven cremosas.",
    },
    3: { 
        name: 'Colombia Familia Zambrano', category: 'Café en grano', price: "15.000", imageUrl: '/ColombiaFincaFamiliaZambrano.jpg', 
        detail: { origin: 'Colombia', variety: 'Castillo, Caturra', process: 'Natural', notes: 'Frutos amarillos, Chocolate, Caramelo y acidez media citrica', rating: 4.9 },
        history: "Este café es el resultado de una promesa familiar hecha bajo la luna llena. Los Zambrano se dedican a la alquimia natural, dejando secar el grano en la cereza. Es un sabor audaz, lleno de historia y dulzura, ideal para compartir en momentos especiales.",
        technical: "Proceso Natural secado al sol. Alta complejidad de sabor. Se recomienda en AeroPress o métodos de infusión para liberar sus tonos frutales y achocolatados.",
    },
    4: { 
        name: 'Honduras Finca La Valentina', category: 'Café en grano', price: "15.000", imageUrl: '/HondurasFincaLaValentina.jpg', 
        detail: { origin: 'Honduras', variety: 'IHCAFE90, Catuai Amarillo', process: 'Honey', notes: 'Caramelo, Panela, Cítrico y Miel', rating: 4.7 },
        history: "La Finca La Valentina es famosa por su niebla matutina. Este café es para quienes aman el misterio: notas dulces y cítricas que aparecen lentamente, como el sol a través de la neblina. Tómalo lentamente, sintiendo el dulzor de la panela.",
        technical: "Proceso Honey para maximizar el dulzor. Variedad Catuai Amarillo, conocida por su taza limpia y notas de miel. Excelente para cualquier método de preparación.",
    },
};

export default function CafeDetalle() {
    const { cafeId } = useParams();
    const coffee = mockCoffeeDetails[cafeId];

    // --- ESTADOS DEL FORMULARIO ---
    const [cantidad, setCantidad] = useState(1);
    const [tamano, setTamano] = useState(""); 
    const [molienda, setMolienda] = useState(""); 
    
    // --- ESTADO PARA ANIMACIÓN DEL BOTÓN ---
    const [isAdded, setIsAdded] = useState(false); 

    const handleAddToCart = () => {
        // 1. Validaciones
        if (!tamano || tamano === "Elija una opción") {
            alert("⚠️ Por favor, selecciona un tamaño.");
            return;
        }
        if (!molienda || molienda === "Elija una opción") {
            alert("⚠️ Por favor, selecciona la molienda.");
            return;
        }

        // 2. Preparar datos para el carrito
        const uniqueId = `${cafeId}-${tamano}-${molienda}`;
        const fullName = `${coffee.name} (${tamano}, ${molienda})`;

        // 3. Enviar al servicio
        addToCart(uniqueId, fullName, cantidad);

        // 4. Activar animación de confirmación
        setIsAdded(true);
        
        // 5. Restaurar botón después de 1.5 segundos
        setTimeout(() => {
            setIsAdded(false);
        }, 1500);
    };

    if (!coffee) {
        return (
            <>
                <Header />
                <div style={{ padding: '80px', textAlign: 'center' }}>
                    <h2>Error: Café no encontrado</h2>
                    <Link to="/"><Button variant="primary">Volver al Menú</Button></Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
                
                <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none' }}>
                    <Button variant="outline-secondary">← Volver al Menú</Button>
                </Link>
                
                <Row>
                    {/* COLUMNA IZQUIERDA: IMAGEN */}
                    <Col md={6}>
                        <img 
                            src={coffee.imageUrl} 
                            alt={coffee.name} 
                            style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                        />
                    </Col>
                    
                    {/* COLUMNA DERECHA: DATOS */}
                    <Col md={6} style={{ paddingLeft: '40px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>NUEVO</span>
                            <h1 style={{ fontSize: '2.5em', marginBottom: '5px' }}>{coffee.name}</h1>
                            <p style={{ color: '#888', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>Categoría: {coffee.category}</p>
                        </div>

                        <div style={{ marginBottom: '20px', fontSize: '1.4em', fontWeight: 'bold' }}>
                            ${coffee.price} - $19.900 <span style={{ fontSize: '0.8em', color: "#888", fontWeight: "normal" }}>IVA incl.</span>
                        </div>

                        <Form>
                            <Form.Group as={Row} className="mb-3" controlId="formTamaño">
                                <Form.Label column sm="3">Tamaño:</Form.Label>
                                <Col sm="9">
                                    <Form.Select value={tamano} onChange={(e) => setTamano(e.target.value)}>
                                        <option value="">Elija una opción</option>
                                        <option value="250g">250g</option>
                                        <option value="500g">500g</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                            
                            <Form.Group as={Row} className="mb-3" controlId="formMolienda">
                                <Form.Label column sm="3">Molienda:</Form.Label>
                                <Col sm="9">
                                    <Form.Select value={molienda} onChange={(e) => setMolienda(e.target.value)}>
                                        <option value="">Elija una opción</option>
                                        <option value="Grano entero">Grano entero</option>
                                        <option value="Molienda Fina">Molienda Fina (Espresso)</option>
                                        <option value="Molienda Gruesa">Molienda Gruesa (Prensa Francesa)</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        </Form>

                        <div style={{ display: 'flex', marginTop: '30px' }}>
                            <Form.Control 
                                type="number" 
                                value={cantidad} 
                                min={1} 
                                onChange={(e) => setCantidad(Number(e.target.value))} 
                                style={{ width: '70px', marginRight: '10px' }} 
                            />
                            
                            {/* BOTÓN DINÁMICO */}
                            <Button 
                                variant={isAdded ? "success" : "warning"} 
                                onClick={handleAddToCart}
                                disabled={isAdded}
                                style={{ 
                                    marginRight: '10px', 
                                    flexGrow: 1, 
                                    // Si está añadido (isAdded=true) usa el estilo default de Success (verde)
                                    // Si NO, usa el estilo personalizado color café
                                    ...(isAdded ? {} : { backgroundColor: '#a1887f', borderColor: '#a1887f' })
                                }}
                            >
                                {isAdded ? "¡Añadido! ✔" : "Añadir al carrito"}
                            </Button>
                        </div>
                        
                        <div style={{ marginTop: '30px', paddingTop: '20px' }}>
                            <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>La Historia del Café</Accordion.Header>
                                    <Accordion.Body><p>{coffee.history}</p></Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>Notas de Cata</Accordion.Header>
                                    <Accordion.Body>
                                        <h4 style={{fontSize: '1.2em'}}>Notas: <strong style={{color: '#a1887f'}}>{coffee.detail.notes}</strong></h4>
                                        <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '10px' }}>
                                            <li>**Origen:** <strong>{coffee.detail.origin}</strong></li>
                                            <li>**Proceso:** <strong>{coffee.detail.process}</strong></li>
                                            <li>**Puntuación:** ⭐ {coffee.detail.rating} / 5.0</li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    </Col>
                </Row>
            </main>
            
            {/* BURBUJA FLOTANTE DEL CARRITO */}
            <BurbujaCarrito />
            
            <Footer />
        </>
    );
}