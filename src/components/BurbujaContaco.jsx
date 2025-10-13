import { useState } from "react";
import { Button, Modal, Form, FloatingLabel, Toast, ToastContainer } from "react-bootstrap";

export default function BurbujaContacto(){
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarToast, setMostrarToast] = useState(false);

    const abrirModal= () => setMostrarModal(true);
    const cerrarModal= () => setMostrarModal(false);
    const enviarFormulario = (e) => {
        e.preventDefault();
        setMostrarModal(false);
        setMostrarToast(true);
        e.target.reset();
    };

    return(
        <>
            {/**burbuja flotante */}
            <button onClick={abrirModal} variant="primary"
            className="position-fixed bottom-0 start-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
            style={{
                width: 64,
                height: 64,
                zIndex: 1050,
                backgroundColor: "#a1887f",
                border: "none",
            }}
            aria-label={"Contacto"}
            title="Contacto"
            >
                <span style={{fontSize: 24}}>💬</span>
            </button>

            {/**formulario dentro del modal */}
            <Modal show={mostrarModal} onHide={cerrarModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Formulario de contacto</Modal.Title>
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
                            <FloatingLabel label="Categoria">
                                <Form.Select required>
                                    <option value={"consulta"}>Consulta</option>
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
                        <Button type="submit" variant="primary">Enviar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/**notificacion de envio exitoso */}
            <ToastContainer position="bottom-start" className="p-3">
                <Toast onClose={() => setMostrarToast(false)} show={mostrarToast} delay= {2500} autohide bg="success">
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">Café Poiesis</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">✅Mensaje enviado correctamente✅</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}