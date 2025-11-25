import { useState } from "react";
import { Button, Modal, Form, FloatingLabel, Toast, ToastContainer } from "react-bootstrap";
import { supabase } from '../supabaseClient'; 
import './BurbujaContactoGeneral.css'; // Importamos los estilos de centrado

export default function BurbujaContactoGeneral(){
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarToast, setMostrarToast] = useState(false);
    const [enviando, setEnviando] = useState(false); 

    // Estado del formulario
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

    const enviarFormulario = async (e) => {
        e.preventDefault();
        setEnviando(true);
        
        try {
            // Mensaje formateado para el admin
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

            // Éxito
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
            {/* Burbuja Flotante (Izquierda) */}
            <button onClick={abrirModal} 
            className="position-fixed bottom-0 start-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
            style={{
                width: 64,
                height: 64,
                zIndex: 2000, // Aseguramos que flote sobre todo
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

            {/* Formulario Modal - CENTRADO */}
            <Modal 
                show={mostrarModal} 
                onHide={cerrarModal} 
                // Propiedades clave para el estilo y centrado
                dialogClassName="contact-modal-dialog" 
                contentClassName="contact-modal-content"
                centered // Refuerzo de Bootstrap
                backdrop="static"
            >
                <Modal.Header closeButton className="contact-modal-header">
                    <Modal.Title className="contact-modal-title">
                        Contáctanos
                    </Modal.Title>
                </Modal.Header>
                
                <Form onSubmit={enviarFormulario}>
                    <Modal.Body className="px-4 pb-2 pt-0" style={{ backgroundColor: '#fdfbf7' }}>
                        <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                            ¿Tienes dudas o sugerencias? Escríbenos.
                        </p>
                        
                        <Form.Group className="mb-3" controlId="Nombre">
                            <FloatingLabel label="Nombre y apellido">
                                <Form.Control 
                                    type="text" placeholder="Tu nombre" required
                                    name="nombre" value={formData.nombre} onChange={handleChange}
                                    style={{ backgroundColor: '#fff' }}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Email">
                            <FloatingLabel label="Correo electrónico">
                                <Form.Control 
                                    type="email" placeholder="ejemplo@email.com" required
                                    name="email" value={formData.email} onChange={handleChange}
                                    style={{ backgroundColor: '#fff' }}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Telefono">
                            <FloatingLabel label="Teléfono (Opcional)">
                                <Form.Control 
                                    type="tel" placeholder="+569..." 
                                    name="telefono" value={formData.telefono} onChange={handleChange}
                                    style={{ backgroundColor: '#fff' }}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Categoria">
                            <FloatingLabel label="Categoría de Consulta">
                                <Form.Select 
                                    required name="categoria" value={formData.categoria} onChange={handleChange}
                                    style={{ backgroundColor: '#fff' }}
                                >
                                    <option value="b2b">Consulta B2B / Mayorista</option>
                                    <option value="otro">Otro</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group controlId="mensaje">
                            <FloatingLabel label="Tu Mensaje">
                                <Form.Control
                                    as="textarea" placeholder="Escribe tu mensaje aqui..."
                                    style={{height: 100, backgroundColor: '#fff'}} required
                                    name="mensaje" value={formData.mensaje} onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>

                    </Modal.Body>
                    
                    <Modal.Footer className="contact-modal-footer">
                        <Button variant="outline-secondary" onClick={cerrarModal} className="me-2 px-4 rounded-pill">
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            disabled={enviando}
                            className="px-4 rounded-pill shadow-sm"
                            style={{ backgroundColor: '#a1887f', borderColor: '#a1887f', fontWeight: '600' }}
                        >
                            {enviando ? "Enviando..." : "Enviar Mensaje"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Notificación de éxito */}
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