import { useState, useEffect } from "react";
import { Button, Modal, ListGroup } from "react-bootstrap"; 
import { 
    generateWhatsAppUrl, 
    getCartItemCount, 
    getCartDetails, 
    removeFromCart 
} from "../firebaseCartService";

export default function BurbujaCarrito(){
    const [itemCount, setItemCount] = useState(0);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    const updateCartCount = () => {
        const count = getCartItemCount();
        setItemCount(count);
        setCartItems(getCartDetails()); // Actualiza el detalle de los ítems
    };

    useEffect(() => {
        // Inicializa el conteo y escucha los cambios del carrito
        updateCartCount();
        window.addEventListener('cartUpdated', updateCartCount);
        
        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    const abrirModal = () => {
        setMostrarModal(true);
    };
    const cerrarModal = () => setMostrarModal(false);

    // FUNCIÓN: Maneja la eliminación de un producto
    const handleRemoveItem = (itemId, itemName) => {
        // En una aplicación de producción, window.confirm debe reemplazarse por un Modal de Bootstrap.
        if (window.confirm(`¿Estás seguro de que quieres quitar "${itemName}" del carrito?`)) { 
            removeFromCart(itemId);
            // Actualiza el modal inmediatamente
            updateCartCount(); 
        }
    };

    const handleWhatsAppSend = () => {
        const url = generateWhatsAppUrl();
        window.open(url, '_blank');
        
        // Opcional: Limpiar el carrito después de enviar y actualizar la interfaz
        // clearCart(); 
        
        cerrarModal();
    };

    return(
        <>
            {/* 1. Burbuja Flotante - Botón de Carrito (Lado DERECHO) */}
            <button onClick={abrirModal}
            className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
            style={{
                width: 64,
                height: 64,
                zIndex: 1050,
                backgroundColor: itemCount > 0 ? "#a1887f" : "#a1887f", // Cambia color si hay ítems
                border: "none",
                cursor: "pointer",
                transition: 'background-color 0.3s',
            }}
            aria-label={"Carrito de Compra"}
            title={itemCount > 0 ? "Revisar y enviar pedido" : "Tu carrito está vacío"}
            >
                {/* Ícono de Carrito y Contador */}
                <span style={{fontSize: 24}}>🛒</span>
                {itemCount > 0 && (
                    <span 
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: '0.75rem' }}
                    >
                        {itemCount}
                    </span>
                )}
            </button>

            {/* 2. Modal de Resumen del Carrito */}
            <Modal show={mostrarModal} onHide={cerrarModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Resumen de tu Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {itemCount === 0 ? (
                        <p>Tu carrito está vacío. ¡Añade algunos productos!</p>
                    ) : (
                        <ListGroup variant="flush">
                            {cartItems.map((item) => (
                                <ListGroup.Item 
                                    key={item.id} 
                                    className="d-flex justify-content-between align-items-center py-2"
                                >
                                    {/* Nombre del Producto y Cantidad */}
                                    <div className="flex-grow-1">
                                        <span className="fw-bold d-block">{item.name}</span>
                                        <small className="text-muted">Cantidad: {item.quantity}</small>
                                    </div>

                                    {/* Botón de Eliminar */}
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => handleRemoveItem(item.id, item.name)}
                                        className="ms-3"
                                        style={{ width: '30px', height: '30px', padding: 0 }}
                                        title={`Quitar ${item.name} del carrito`} 
                                    >
                                        ❌
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {itemCount > 0 && (
                        <Button 
                            variant="success" 
                            onClick={handleWhatsAppSend}
                            style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
                        >
                            Consultar stock por WhatsApp ({itemCount} ítems)
                        </Button>
                    )}
                    <Button variant="secondary" onClick={cerrarModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}