import React from 'react';
import { Button } from 'react-bootstrap';
import { addToCart } from '../FirebaseCartService'; 

export default function AddToCartControls({ productoId, nombreProducto }) {
    
    // La cantidad es fija en 1 por solicitud del cliente para Insumos/Preparaciones.
    const finalCantidad = 1;

    const handleAddToCart = () => {
        // 1. Guarda el producto en el carrito con cantidad 1
        addToCart(productoId, nombreProducto, finalCantidad);
        
        // 2. Notifica al usuario
        alert(`¡${nombreProducto} añadido! Revisa el ícono del carrito para enviar tu pedido.`);

        // 3. Actualiza el contador de la burbuja del carrito
        window.dispatchEvent(new Event('cartUpdated')); 
    };

    return (
        <div className="d-flex flex-column mt-auto pt-2" style={{ width: '100%' }}>
            
            {/* Se elimina el selector de cantidad y solo queda el botón */}
            <Button 
                variant="success" 
                onClick={handleAddToCart}
                className="btn-sm"
                style={{ backgroundColor: '#4e342e', borderColor: '#4e342e' }} 
            >
                Añadir al Carro
            </Button>
        </div>
    );
}