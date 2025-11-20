const CART_KEY = 'cafepoiesis_cart';
const PHONE_NUMBER = '56937576440'; 

export const getCartItems = () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : {};
};

export const addToCart = (productId, name, quantity) => {
    const cart = getCartItems();
    const key = String(productId); 
    const existing = cart[key];
    
    if (existing) {
        cart[key] = { id: productId, name, quantity: existing.quantity + quantity };
    } else {
        cart[key] = { id: productId, name, quantity };
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const removeFromCart = (productId) => {
    const cart = getCartItems();
    const key = String(productId);
    
    if (cart[key]) {
        cart[key].quantity -= 1;
        
        if (cart[key].quantity <= 0) {
            delete cart[key];
        }
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const clearCart = () => {
    localStorage.removeItem(CART_KEY);
};

export const generateWhatsAppUrl = () => {
    const cart = getCartItems();
    const items = Object.values(cart);
    
    if (items.length === 0) {
        return "https://wa.me/" + PHONE_NUMBER + "?text=" + 
               encodeURIComponent("Hola Cafépoiesis! Quiero hacer una consulta.");
    }
    
    let message = "Hola Cafépoiesis! Este es mi pedido:\n\n";
    
    items.forEach(item => {
        message += ` - ${item.quantity} x ${item.name}\n`;
    });
    
    message += "\nTotal de ítems diferentes: " + items.length;
    message += "\n\nPor favor, confirmen disponibilidad y precio. Gracias!";
    
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
};

export const getCartItemCount = () => {
    const cart = getCartItems();
    return Object.keys(cart).length;
};