import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Button, Form, Accordion } from 'react-bootstrap';

// IMPORTACIONES DE COMPONENTES
import Header from '../header.jsx';
import Footer from '../footer.jsx';
import BurbujaCarrito from '../BurbujaCarrito';

// IMPORTACIÓN DEL SERVICIO
import { addToCart } from '../../firebaseCartService';
import { supabase } from '../../supabaseClient';

export default function CafeDetalle() {
    const { cafeId } = useParams();
    const [coffee, setCoffee] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- ESTADOS DEL FORMULARIO ---
    const [cantidad, setCantidad] = useState(1);
    // ELIMINAMOS EL ESTADO DE TAMAÑO
    const [molienda, setMolienda] = useState("");

    // --- ESTADO PARA ANIMACIÓN DEL BOTÓN ---
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        fetchCoffeeDetails();
    }, [cafeId]);

    const fetchCoffeeDetails = async () => {
        try {
            const { data: producto, error: errorProducto } = await supabase
                .from('productos')
                .select('*')
                .eq('id_producto', cafeId)
                .single();

            if (errorProducto) throw errorProducto;

            let cafeDetails = null;
            if (producto.tipo_producto === 'cafes_en_grano') {
                const { data: cafe, error: errorCafe } = await supabase
                    .from('cafes_en_grano')
                    .select('*')
                    .eq('id_producto', cafeId)
                    .single();

                if (!errorCafe && cafe) {
                    cafeDetails = cafe;
                }
            }

            setCoffee({
                ...producto,
                cafeDetails
            });
        } catch (error) {
            console.error('Error fetching coffee details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        // 1. Validaciones (Solo Molienda es obligatoria ahora)
        if (!molienda || molienda === "Elija una opción") {
            alert("⚠️ Por favor, selecciona la molienda.");
            return;
        }

        // 2. Preparar datos para el carrito
        // El ID único ahora es solo ID_PRODUCTO + MOLIENDA
        const uniqueId = `${cafeId}-${molienda}`;
        
        // El nombre ya trae el peso, solo le agregamos la molienda entre paréntesis
        const fullName = `${coffee.nombre} (${molienda})`;

        // 3. Enviar al servicio
        addToCart(uniqueId, fullName, cantidad, coffee.precio);

        // 4. Activar animación
        setIsAdded(true);

        // 5. Restaurar botón
        setTimeout(() => {
            setIsAdded(false);
        }, 1500);
    };

    if (loading) {
        return (
            <>
                <Header />
                <div style={{ padding: '80px', textAlign: 'center' }}>
                    <h2>Cargando... ☕</h2>
                </div>
                <Footer />
            </>
        );
    }

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

    const isAvailable = coffee.disponible;

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
                        <div style={{ position: 'relative' }}>
                            <img
                                src={coffee.imagen || 'https://placehold.co/600x600?text=No+Image'}
                                alt={coffee.nombre}
                                style={{
                                    width: '100%',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    opacity: isAvailable ? 1 : 0.7
                                }}
                            />
                            {!isAvailable && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    backgroundColor: '#d32f2f',
                                    color: 'white',
                                    padding: '10px 30px',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '1.2em',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                                }}>
                                    AGOTADO
                                </div>
                            )}
                        </div>
                    </Col>

                    {/* COLUMNA DERECHA: DATOS */}
                    <Col md={6} style={{ paddingLeft: '40px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            {isAvailable ? (
                                <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>DISPONIBLE</span>
                            ) : (
                                <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>NO DISPONIBLE</span>
                            )}
                            <h1 style={{ fontSize: '2.5em', marginBottom: '5px' }}>{coffee.nombre}</h1>
                            <p style={{ color: '#888', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                                Categoría: {coffee.tipo_producto === 'cafes_en_grano' ? 'Café en Grano' : coffee.tipo_producto}
                            </p>
                        </div>

                        <div style={{ marginBottom: '20px', fontSize: '1.4em', fontWeight: 'bold' }}>
                            ${coffee.precio?.toLocaleString('es-CL')} <span style={{ fontSize: '0.8em', color: "#888", fontWeight: "normal" }}>IVA incl.</span>
                        </div>

                        <Form>
                            {/* AQUÍ ELIMINAMOS EL SELECTOR DE TAMAÑO */}
                            
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
                                disabled={!isAvailable}
                            />

                            {/* BOTÓN DINÁMICO */}
                            <Button
                                variant={isAdded ? "success" : "warning"}
                                onClick={handleAddToCart}
                                disabled={isAdded || !isAvailable}
                                style={{
                                    marginRight: '10px',
                                    flexGrow: 1,
                                    ...(isAdded ? {} : { backgroundColor: '#a1887f', borderColor: '#a1887f', color: 'white' }),
                                    ...(!isAvailable ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                                }}
                            >
                                {!isAvailable ? "No disponible" : (isAdded ? "¡Añadido! ✔" : "Añadir al carrito")}
                            </Button>
                        </div>

                        <div style={{ marginTop: '30px', paddingTop: '20px' }}>
                            <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Descripción</Accordion.Header>
                                    <Accordion.Body>
                                        <p>{coffee.descripcion || 'Sin descripción disponible'}</p>
                                    </Accordion.Body>
                                </Accordion.Item>
                                {coffee.cafeDetails && (
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>Detalles del Café</Accordion.Header>
                                        <Accordion.Body>
                                            <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '10px' }}>
                                                {coffee.cafeDetails.origen && (
                                                    <li><strong>Origen:</strong> {coffee.cafeDetails.origen}</li>
                                                )}
                                                {coffee.cafeDetails.altura_metros && (
                                                    <li><strong>Altura:</strong> {coffee.cafeDetails.altura_metros} m.s.n.m.</li>
                                                )}
                                                {coffee.cafeDetails.proceso_beneficio && (
                                                    <li><strong>Proceso:</strong> {coffee.cafeDetails.proceso_beneficio}</li>
                                                )}
                                                {coffee.cafeDetails.variedad && (
                                                    <li><strong>Variedad:</strong> {coffee.cafeDetails.variedad}</li>
                                                )}
                                                {coffee.cafeDetails.notas_cata && (
                                                    <li><strong>Notas de Cata:</strong> {coffee.cafeDetails.notas_cata}</li>
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