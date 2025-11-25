import { useState } from "react";
import { Button, Modal, Form, FloatingLabel, Toast, ToastContainer } from "react-bootstrap";
// CORRECCIÓN: Usamos la ruta relativa estándar sin extensión para mayor compatibilidad
import { supabase } from '../supabaseClient'; 

export default function BurbujaContactoGeneral(){
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarToast, setMostrarToast] = useState(false);
    const [enviando, setEnviando] = useState(false); 

    // 2. ESTADO ACTUALIZADO CON TELEFONO
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '', 
        categoria: 'b2b',
        mensaje: ''
    });

    const abrirModal = () => setMostrarModal(true);
    const cerrarModal = () => setMostrarModal(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 3. FUNCIÓN DE ENVÍO
    const enviarFormulario = async (e) => {
        e.preventDefault();
        setEnviando(true);
        
        try {
            const mensajeFinal = `[CATEGORÍA: ${formData.categoria.toUpperCase()}] \n${formData.mensaje}`;

            const { error } = await supabase
                .from('formulario_contacto') 
                .insert([
                    {
                        nombre: formData.nombre,
                        correo: formData.email,
                        telefono: formData.telefono, 
                        mensaje: mensajeFinal,
                    }
                ]);

            if (error) throw error;

            // ÉXITO
            setMostrarModal(false);
            setMostrarToast(true);
            setFormData({ nombre: '', email: '', telefono: '', categoria: 'b2b', mensaje: '' }); 

        } catch (error) {
            console.error("Error enviando:", error);
            alert("Hubo un problema al enviar. Intenta nuevamente.");
        } finally {
            setEnviando(false);
        }
    };

    return(
        <>
            {/* Burbuja Flotante */}
            <button onClick={abrirModal} 
            className="position-fixed bottom-0 start-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
            style={{
                width: 64,
                height: 64,
                zIndex: 2000,
                backgroundColor: "#4e342e", 
                border: "none",
                cursor: "pointer",
                transition: "transform 0.2s"
            }}
            aria-label={"Contacto General"}
            title="Formulario de Contacto Empresarial"
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
                <span style={{fontSize: 24, color: 'white'}}>📧</span>
            </button>

            {/* Formulario Modal */}
            <Modal show={mostrarModal} onHide={cerrarModal} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa' }}>
                    <Modal.Title style={{ fontWeight: 'bold', color: '#4e342e', fontFamily: 'Playfair Display, serif' }}>
                        Contáctanos
                    </Modal.Title>
                </Modal.Header>
                
                <Form onSubmit={enviarFormulario}>
                    <Modal.Body>
                        
                        <Form.Group className="mb-3" controlId="Nombre">
                            <FloatingLabel label="Nombre y apellido">
                                <Form.Control 
                                    type="text" placeholder="Tu nombre" required
                                    name="nombre" value={formData.nombre} onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Email">
                            <FloatingLabel label="Correo electrónico">
                                <Form.Control 
                                    type="email" placeholder="ejemplo@email.com" required
                                    name="email" value={formData.email} onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        {/* NUEVO INPUT DE TELÉFONO */}
                        <Form.Group className="mb-3" controlId="Telefono">
                            <FloatingLabel label="Teléfono (Opcional)">
                                <Form.Control 
                                    type="tel" placeholder="+569..." 
                                    name="telefono" value={formData.telefono} onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Categoria">
                            <FloatingLabel label="Categoría de Consulta">
                                <Form.Select required name="categoria" value={formData.categoria} onChange={handleChange}>
                                    <option value="b2b">Consulta B2B / Mayorista</option>
                                    {/* OPCIONES EXTRA ELIMINADAS (Reclamo, Felicitaciones) */}
                                    <option value="otro">Otro</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group controlId="mensaje">
                            <FloatingLabel label="Tu Mensaje">
                                <Form.Control
                                    as="textarea" placeholder="Escribe tu mensaje aqui..."
                                    style={{height: 120}} required
                                    name="mensaje" value={formData.mensaje} onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={cerrarModal}>Cancelar</Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            disabled={enviando}
                            style={{ backgroundColor: '#a1887f', borderColor: '#a1887f' }}
                        >
                            {enviando ? "Enviando..." : "Enviar Mensaje"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Notificación de éxito amigable */}
            <ToastContainer position="bottom-end" className="p-3" style={{zIndex: 2050}}>
                <Toast onClose={() => setMostrarToast(false)} show={mostrarToast} delay={3000} autohide bg="success">
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">Café Poiesis</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">
                        ✅ ¡Mensaje enviado con éxito! Te contactaremos pronto.
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}