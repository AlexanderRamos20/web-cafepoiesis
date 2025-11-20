import { useState, useEffect } from "react";
import { generateWhatsAppUrl, getCartItemCount } from "../FirebaseCartService.js";

export default function BurbujaCarrito(){
    const [itemCount, setItemCount] = useState(0);

    const updateCartCount = () => {
        setItemCount(getCartItemCount());
    };

    useEffect(() => {
        updateCartCount();
        window.addEventListener('cartUpdated', updateCartCount);
        
        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    const handleWhatsAppClick = () => {
        const url = generateWhatsAppUrl();
        window.open(url, '_blank');
        // clearCart(); // Limpiar el carrito después de enviar, si el modelo lo requiere
    };

    return(
        <>
            {/* Burbuja Flotante - Botón de Carrito (Lado Izquierdo) */}
            <button onClick={handleWhatsAppClick}
            className="position-fixed bottom-0 start-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
            style={{
                width: 64,
                height: 64,
                zIndex: 1050,
                backgroundColor: itemCount > 0 ? "#a1887f" : "#cccccc", // Color de acento si hay ítems
                border: "none",
                cursor: "pointer",
                transition: 'background-color 0.3s',
            }}
            aria-label={"Carrito de Compra"}
            title={itemCount > 0 ? "Enviar Pedido por WhatsApp" : "Tu carrito está vacío"}
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
        </>
    );
}