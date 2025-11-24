import { useState, useEffect } from "react";
import { Button, Modal, ListGroup } from "react-bootstrap"; 
import { 
    generateWhatsAppUrl, 
    getCartItemCount, 
    getCartDetails, 
    removeFromCart,
    submitOrderToSupabase, // <--- IMPORTAR ESTA NUEVA FUNCIÓN
    clearCart              // <--- IMPORTAR ESTA NUEVA FUNCIÓN
} from "../firebaseCartService";

export default function BurbujaCarrito(){
    const [itemCount, setItemCount] = useState(0);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [procesando, setProcesando] = useState(false); // Para evitar doble clic

    const updateCartCount = () => {
        const count = getCartItemCount();
        setItemCount(count);
        setCartItems(getCartDetails()); 
    };

    useEffect(() => {
        updateCartCount();
        window.addEventListener('cartUpdated', updateCartCount);
        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    const abrirModal = () => setMostrarModal(true);
    const cerrarModal = () => setMostrarModal(false);

    const handleRemoveItem = (itemId, itemName) => {
        if (window.confirm(`¿Estás seguro de que quieres quitar "${itemName}" del carrito?`)) { 
            removeFromCart(itemId);
            updateCartCount(); 
        }
    };

    // --- FUNCIÓN PRINCIPAL MODIFICADA ---
    const handleWhatsAppSend = async () => {
        setProcesando(true); // Desactivar botón para que no le den 2 veces
        
        // 1. Generamos el link antes de cualquier cosa
        const url = generateWhatsAppUrl();

        try {
            // 2. Intentamos guardar en SUPABASE (Carrito, Detalle, Log)
            await submitOrderToSupabase();
            
            // 3. Si guardó bien, abrimos WhatsApp
            window.open(url, '_blank');
            
            // 4. Limpiamos el carro local y cerramos
            clearCart(); 
            cerrarModal();
            
            // Feedback opcional (puedes quitarlo si prefieres que sea silencioso)
            // alert("¡Pedido registrado en el sistema!"); 

        } catch (error) {
            console.error("Error al guardar pedido:", error);
            // FALLBACK: Si falla la base de datos (ej: internet lento),
            // abrimos WhatsApp igual para no perder la venta.
            alert("Hubo un problema registrando el historial, pero te redirigiremos a WhatsApp.");
            window.open(url, '_blank');
        } finally {
            setProcesando(false);
        }
    };

    return(
        <>
            {/* 1. Burbuja Flotante */}
            <button onClick={abrirModal}
            className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
            style={{
                width: 64,
                height: 64,
                zIndex: 1050,
                backgroundColor: itemCount > 0 ? "#a1887f" : "#a1887f", 
                border: "none",
                cursor: "pointer",
                transition: 'background-color 0.3s',
            }}
            aria-label={"Carrito de Compra"}
            title={itemCount > 0 ? "Revisar y enviar pedido" : "Tu carrito está vacío"}
            >
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

            {/* 2. Modal de Resumen */}
            <Modal show={mostrarModal} onHide={cerrarModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Resumen de tu Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {itemCount === 0 ? (
                        <p className="text-center text-muted">Tu carrito está vacío ☕</p>
                    ) : (
                        <ListGroup variant="flush">
                            {cartItems.map((item) => (
                                <ListGroup.Item 
                                    key={item.id} 
                                    className="d-flex justify-content-between align-items-center py-2"
                                >
                                    <div className="flex-grow-1">
                                        <span className="fw-bold d-block">{item.name}</span>
                                        <small className="text-muted">
                                            {item.quantity} x ${item.price ? item.price.toLocaleString('es-CL') : '0'}
                                        </small>
                                    </div>

                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => handleRemoveItem(item.id, item.name)}
                                        className="ms-3"
                                        style={{ width: '30px', height: '30px', padding: 0 }}
                                        title="Quitar del carrito"
                                    >
                                        ❌
                                    </Button>
                                </ListGroup.Item>
                            ))}
                            {/* Total estimado (Opcional) */}
                            <ListGroup.Item className="fw-bold text-end bg-light mt-2">
                                Total: ${cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString('es-CL')}
                            </ListGroup.Item>
                        </ListGroup>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {itemCount > 0 && (
                        <Button 
                            variant="success" 
                            onClick={handleWhatsAppSend}
                            disabled={procesando} // Desactivar si está guardando
                            style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
                        >
                            {procesando ? "Registrando..." : `Consultar por WhatsApp (${itemCount})`}
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