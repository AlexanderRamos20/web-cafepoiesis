import { useState } from "react";
import { Button, Modal, Form, FloatingLabel, Toast, ToastContainer } from "react-bootstrap";
// Importar la función para guardar el formulario de contacto en la BD (futuro)
// import { saveContactForm } from '../firebaseService'; 

export default function BurbujaContactoGeneral(){
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarToast, setMostrarToast] = useState(false);

    const abrirModal= () => setMostrarModal(true);
    const cerrarModal= () => setMostrarModal(false);
    const enviarFormulario = (e) => {
        e.preventDefault();
        
        // TODO: En la Unidad 3, aquí se debe implementar la llamada a la BD (tabla formulario_contacto)
        
        setMostrarModal(false);
        setMostrarToast(true);
        e.target.reset(); // Limpia el formulario
    };

    return(
        <>
            {/* Burbuja Flotante de Contacto General (Lado Derecho) */}
            <button onClick={abrirModal} 
            className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
            style={{
                width: 64,
                height: 64,
                zIndex: 1050,
                backgroundColor: "#4e342e", // Marrón oscuro para diferenciar del carrito
                border: "none",
                cursor: "pointer",
            }}
            aria-label={"Contacto General"}
            title="Formulario de Contacto"
            >
                <span style={{fontSize: 24, color: 'white'}}>📧</span>
            </button>

            {/* Formulario Modal (RF11) */}
            <Modal show={mostrarModal} onHide={cerrarModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Formulario de Contacto Empresarial</Modal.Title>
                </Modal.Header>
                <Form onSubmit={enviarFormulario}>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="Nombre">
                            <FloatingLabel label="Nombre y apellido">
                                <Form.Control type="text" placeholder="Tu nombre" required/>
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="Email">
                            <FloatingLabel label="Correo electronico">
                                <Form.Control type="email" placeholder="ejemplo@email.com" required/>
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="Categoria">
                            <FloatingLabel label="Categoría de Consulta">
                                <Form.Select required>
                                    <option value={"b2b"}>Consulta B2B / Mayorista</option>
                                    <option value={"reclamo"}>Reclamo</option>
                                    <option value={"otro"}>Otro</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group controlId="mensaje">
                            <FloatingLabel label="Mensaje">
                                <Form.Control
                                as="textarea"
                                placeholder="Escribe tu mensaje aqui..."
                                style={{height: 120}}
                                required
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={cerrarModal}>Cancelar</Button>
                        <Button type="submit" variant="primary" style={{ backgroundColor: '#a1887f', borderColor: '#a1887f' }}>Enviar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Notificación de envío exitoso */}
            <ToastContainer position="bottom-end" className="p-3">
                <Toast onClose={() => setMostrarToast(false)} show={mostrarToast} delay= {2500} autohide bg="success">
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">Café Poiesis</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">✅ Mensaje enviado correctamente ✅</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}