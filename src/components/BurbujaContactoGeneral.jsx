import { useState } from "react";
import { Button, Modal, Form, FloatingLabel, Toast, ToastContainer } from "react-bootstrap";
// 1. IMPORTAMOS SUPABASE
import { supabase } from '../supabaseClient'; 

export default function BurbujaContactoGeneral(){
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarToast, setMostrarToast] = useState(false);
    const [enviando, setEnviando] = useState(false); // Para desactivar botón mientras envía

    // 2. ESTADO PARA GUARDAR LOS DATOS DEL FORMULARIO
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        categoria: 'b2b', // Valor por defecto
        mensaje: ''
    });

    const abrirModal = () => setMostrarModal(true);
    const cerrarModal = () => setMostrarModal(false);

    // Función para capturar lo que escribe el usuario
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 3. FUNCIÓN DE ENVÍO A SUPABASE
    const enviarFormulario = async (e) => {
        e.preventDefault();
        setEnviando(true);
        
        try {
            // Preparamos el mensaje combinando Categoría + Texto
            // Así el admin sabe de qué se trata sin cambiar la base de datos
            const mensajeFinal = `[CATEGORÍA: ${formData.categoria.toUpperCase()}] \n${formData.mensaje}`;

            const { error } = await supabase
                .from('formulario_contacto') // Nombre de la tabla
                .insert([
                    {
                        nombre: formData.nombre,
                        correo: formData.email,
                        mensaje: mensajeFinal,
                        // telefono: dejaremos null porque este form no lo pide
                    }
                ]);

            if (error) throw error;

            // ÉXITO
            setMostrarModal(false);
            setMostrarToast(true);
            setFormData({ nombre: '', email: '', categoria: 'b2b', mensaje: '' }); // Limpiar

        } catch (error) {
            console.error("Error enviando:", error);
            alert("Hubo un problema al enviar. Intenta nuevamente.");
        } finally {
            setEnviando(false);
        }
    };

    return(
        <>
            {/* Burbuja Flotante (IZQUIERDA) */}
            <button onClick={abrirModal} 
            className="position-fixed bottom-0 start-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
            style={{
                width: 64,
                height: 64,
                zIndex: 1050,
                backgroundColor: "#4e342e", 
                border: "none",
                cursor: "pointer",
            }}
            aria-label={"Contacto General"}
            title="Formulario de Contacto Empresarial"
            >
                <span style={{fontSize: 24, color: 'white'}}>📧</span>
            </button>

            {/* Formulario Modal */}
            <Modal show={mostrarModal} onHide={cerrarModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Formulario de Contacto Empresarial</Modal.Title>
                </Modal.Header>
                
                <Form onSubmit={enviarFormulario}>
                    <Modal.Body>
                        
                        {/* NOMBRE */}
                        <Form.Group className="mb-3" controlId="Nombre">
                            <FloatingLabel label="Nombre y apellido">
                                <Form.Control 
                                    type="text" 
                                    placeholder="Tu nombre" 
                                    required
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        {/* EMAIL */}
                        <Form.Group className="mb-3" controlId="Email">
                            <FloatingLabel label="Correo electronico">
                                <Form.Control 
                                    type="email" 
                                    placeholder="ejemplo@email.com" 
                                    required
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        {/* CATEGORÍA */}
                        <Form.Group className="mb-3" controlId="Categoria">
                            <FloatingLabel label="Categoría de Consulta">
                                <Form.Select 
                                    required
                                    name="categoria"
                                    value={formData.categoria}
                                    onChange={handleChange}
                                >
                                    <option value="b2b">Consulta B2B / Mayorista</option>
                                    <option value="reclamo">Reclamo</option>
                                    <option value="otro">Otro</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Form.Group>

                        {/* MENSAJE */}
                        <Form.Group controlId="mensaje">
                            <FloatingLabel label="Mensaje">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Escribe tu mensaje aqui..."
                                    style={{height: 120}}
                                    required
                                    name="mensaje"
                                    value={formData.mensaje}
                                    onChange={handleChange}
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
                            {enviando ? "Enviando..." : "Enviar"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Notificación de envío exitoso */}
            <ToastContainer position="bottom-end" className="p-3" style={{zIndex: 1060}}>
                <Toast onClose={() => setMostrarToast(false)} show={mostrarToast} delay={3000} autohide bg="success">
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">Café Poiesis</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">✅ Mensaje guardado en base de datos.</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}