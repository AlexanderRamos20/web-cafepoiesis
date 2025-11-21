// Nombre: Servicio de Carrito (Simulación de DB con LocalStorage)
const CART_KEY = 'poiesis_cart';

// Notificar a toda la app que hubo un cambio
const dispatchCartUpdate = () => {
    window.dispatchEvent(new Event('cartUpdated'));
};

/**
 * Obtiene el carrito actual.
 */
export const getCartDetails = () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
};

/**
 * Cuenta el TOTAL de artículos (suma de cantidades).
 */
export const getCartItemCount = () => {
    const cart = getCartDetails();
    return cart.reduce((total, item) => total + item.quantity, 0);
};

/**
 * [CRUCIAL] Obtiene la cantidad de un producto específico.
 * Usa '==' para que funcione aunque el ID sea texto y el del producto número.
 */
export const getProductQuantity = (id) => {
    const cart = getCartDetails();
    const item = cart.find(p => p.id == id); // '==' es importante aquí
    return item ? item.quantity : 0;
};

/**
 * Añade productos al carro.
 */
export const addToCart = (id, name, quantity) => {
    const cart = getCartDetails();
    const existingItemIndex = cart.findIndex(item => item.id == id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({ id, name, quantity });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    dispatchCartUpdate();
};

/**
 * Quita un producto del carro.
 */
export const removeFromCart = (productId) => {
    let cart = getCartDetails();
    cart = cart.filter(item => item.id != productId);
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    dispatchCartUpdate(); 
};

/**
 * Genera link de WhatsApp.
 */
export const generateWhatsAppUrl = () => {
    const cart = getCartDetails();
    const phoneNumber = "56937576440"; 
    const itemsText = cart.map(item => `- ${item.name}: ${item.quantity} unidad(es)`).join('\n');
    
    let message = `¡Hola! Me gustaría hacer el siguiente pedido:\n\n`;
    if (itemsText) {
        message += itemsText;
    } else {
        message += "Consultando productos...";
    }

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

export const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    dispatchCartUpdate();
};