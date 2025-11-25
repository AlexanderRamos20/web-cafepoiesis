import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Button, Form, Accordion, Badge } from 'react-bootstrap';

// IMPORTACIONES DE COMPONENTES
// Se agregan extensiones explícitas para evitar errores de resolución
import Header from '../header.jsx';
import Footer from '../footer.jsx';
import BurbujaCarrito from '../BurbujaCarrito.jsx';

// IMPORTACIÓN DEL SERVICIO
import { addToCart } from '../../FirebaseCartService.js';
import { supabase } from '../../supabaseClient.js';

export default function CafeDetalle() {
    const { cafeId } = useParams();
    const [coffee, setCoffee] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- ESTADOS DEL FORMULARIO ---
    const [cantidad, setCantidad] = useState(1);
    const [molienda, setMolienda] = useState("");

    // --- ESTADO PARA ANIMACIÓN DEL BOTÓN ---
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        const fetchCoffeeDetails = async () => {
            try {
                const { data, error } = await supabase
                    .from('productos')
                    .select(`
                        *,
                        cafes_en_grano (*)
                    `)
                    .eq('id_producto', cafeId)
                    .single();

                if (error) throw error;

                const detallesTecnicos = Array.isArray(data.cafes_en_grano) 
                    ? data.cafes_en_grano[0] 
                    : data.cafes_en_grano;

                setCoffee({
                    ...data,
                    technical: detallesTecnicos || {} 
                });

            } catch (error) {
                console.error('Error al cargar el café:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoffeeDetails();
    }, [cafeId]);

    const handleAddToCart = () => {
        if (!molienda || molienda === "Elija una opción") {
            alert("⚠️ Por favor, selecciona la molienda.");
            return;
        }

        const uniqueId = `${cafeId}-${molienda}`;
        const fullName = `${coffee.nombre} (${molienda})`;

        addToCart(uniqueId, fullName, cantidad, coffee.precio);

        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
        }, 1500);
    };

    if (loading) {
        return (
            <>
                <Header />
                <div style={{ padding: '80px', textAlign: 'center', minHeight: '60vh' }}>
                    <h2>Cargando aroma... ☕</h2>
                </div>
                <Footer />
            </>
        );
    }

    if (!coffee) {
        return (
            <>
                <Header />
                <div style={{ padding: '80px', textAlign: 'center', minHeight: '60vh' }}>
                    <h2>Café no encontrado</h2>
                    <Link to="/"><Button variant="primary">Volver al Menú</Button></Link>
                </div>
                <Footer />
            </>
        );
    }

    const isAvailable = coffee.disponible;

    return (
        <>
            <Header />
            <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>

                <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none' }}>
                    <Button variant="outline-secondary">← Volver al Menú</Button>
                </Link>

                <Row>
                    <Col md={6} className="mb-4">
                        <div style={{ position: 'relative' }}>
                            <img
                                src={coffee.imagen || 'https://placehold.co/600x600?text=No+Image'}
                                alt={coffee.nombre}
                                style={{
                                    width: '100%',
                                    borderRadius: '15px',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                                    opacity: isAvailable ? 1 : 0.7,
                                    objectFit: 'cover'
                                }}
                            />
                            {!isAvailable && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                                    backgroundColor: '#d32f2f', color: 'white',
                                    padding: '10px 30px', borderRadius: '8px',
                                    fontWeight: 'bold', fontSize: '1.2em',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                                }}>
                                    AGOTADO
                                </div>
                            )}
                        </div>
                    </Col>

                    <Col md={6} style={{ paddingLeft: '2rem' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            {isAvailable ? (
                                <Badge bg="success" className="mb-2">DISPONIBLE</Badge>
                            ) : (
                                <Badge bg="danger" className="mb-2">SIN STOCK</Badge>
                            )}
                            
                            <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#2c2c2c' }}>
                                {coffee.nombre}
                            </h1>
                            <p style={{ color: '#6c757d', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                                Categoría: {coffee.tipo_producto === 'cafes_en_grano' ? 'Café de Especialidad' : coffee.tipo_producto}
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <span style={{ fontSize: '2em', fontWeight: 'bold', color: '#4e342e' }}>
                                ${coffee.precio?.toLocaleString('es-CL')}
                            </span>
                            <span style={{ fontSize: '0.9em', color: "#888", marginLeft: '10px' }}>IVA incluido</span>
                        </div>

                        <Form>
                            <Form.Group as={Row} className="mb-3 align-items-center" controlId="formMolienda">
                                <Form.Label column sm="3" style={{ fontWeight: '500' }}>Molienda:</Form.Label>
                                <Col sm="9">
                                    <Form.Select 
                                        value={molienda} 
                                        onChange={(e) => setMolienda(e.target.value)}
                                        style={{ borderColor: '#a1887f' }}
                                    >
                                        <option value="">Selecciona tipo de molienda...</option>
                                        <option value="Grano entero">Grano entero</option>
                                        <option value="Molienda Fina">Molienda Fina (Espresso)</option>
                                        <option value="Molienda Media">Molienda Media (V60 / Cafetera)</option>
                                        <option value="Molienda Gruesa">Molienda Gruesa (Prensa Francesa)</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        </Form>

                        <div style={{ display: 'flex', marginTop: '20px', gap: '10px' }}>
                            <Form.Control
                                type="number"
                                value={cantidad}
                                min={1}
                                onChange={(e) => setCantidad(Number(e.target.value))}
                                style={{ width: '80px', borderColor: '#a1887f' }}
                                disabled={!isAvailable}
                            />

                            <Button
                                variant={isAdded ? "success" : "warning"}
                                onClick={handleAddToCart}
                                disabled={isAdded || !isAvailable}
                                style={{
                                    flexGrow: 1,
                                    fontWeight: 'bold',
                                    color: 'white',
                                    ...(isAdded ? {} : { backgroundColor: '#a1887f', borderColor: '#a1887f' }),
                                    ...(!isAvailable ? { opacity: 0.6, cursor: 'not-allowed' } : {})
                                }}
                            >
                                {!isAvailable ? "No disponible" : (isAdded ? "¡Añadido al Carrito! ✔" : "Añadir al Carrito")}
                            </Button>
                        </div>

                        <div style={{ marginTop: '40px' }}>
                            <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Historia & Descripción</Accordion.Header>
                                    <Accordion.Body style={{ lineHeight: '1.6', color: '#555' }}>
                                        {coffee.descripcion || 'Una selección especial de Café Poiesis.'}
                                    </Accordion.Body>
                                </Accordion.Item>

                                {coffee.technical && (
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>Ficha Técnica (Origen, Altura...)</Accordion.Header>
                                        <Accordion.Body>
                                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                                {coffee.technical.origen && (
                                                    <li className="mb-2">
                                                        🌍 <strong>Origen:</strong> {coffee.technical.origen}
                                                    </li>
                                                )}
                                                {coffee.technical.altura_metros && (
                                                    <li className="mb-2">
                                                        ⛰️ <strong>Altura:</strong> {coffee.technical.altura_metros} m.s.n.m.
                                                    </li>
                                                )}
                                                {coffee.technical.variedad && (
                                                    <li className="mb-2">
                                                        🌱 <strong>Variedad:</strong> {coffee.technical.variedad}
                                                    </li>
                                                )}
                                                {coffee.technical.proceso_beneficio && (
                                                    <li className="mb-2">
                                                        ⚙️ <strong>Proceso:</strong> {coffee.technical.proceso_beneficio}
                                                    </li>
                                                )}
                                                {coffee.technical.notas_cata && (
                                                    <li className="mt-3 p-2 bg-light rounded border-start border-4 border-warning">
                                                        🍊 <strong>Notas de Cata:</strong><br/>
                                                        {coffee.technical.notas_cata}
                                                    </li>
                                                )}
                                            </ul>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )}
                            </Accordion>
                        </div>
                    </Col>
                </Row>
            </main>

            <BurbujaCarrito />
            <Footer />
        </>
    );
}