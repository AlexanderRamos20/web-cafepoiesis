import { supabase } from './supabaseClient'; // Importamos cliente para guardar en BD

const CART_KEY = 'poiesis_cart';

const dispatchCartUpdate = () => {
    window.dispatchEvent(new Event('cartUpdated'));
};

export const getCartDetails = () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
};

export const getCartItemCount = () => {
    const cart = getCartDetails();
    return cart.reduce((total, item) => total + item.quantity, 0);
};

export const getProductQuantity = (id) => {
    const cart = getCartDetails();
    const item = cart.find(p => p.id == id);
    return item ? item.quantity : 0;
};

// --- MODIFICACIÓN 1: Ahora recibimos y guardamos el PRECIO ---
export const addToCart = (id, name, quantity, price = 0) => {
    const cart = getCartDetails();
    const existingItemIndex = cart.findIndex(item => item.id == id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Guardamos el precio. Si viene como string "$9.500", lo limpiamos a número
        let numericPrice = price;
        if (typeof price === 'string') {
            numericPrice = parseInt(price.replace(/\D/g, '')) || 0; // Quita '$' y '.'
        }

        cart.push({ id, name, quantity, price: numericPrice });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    dispatchCartUpdate();
};

export const removeFromCart = (productId) => {
    let cart = getCartDetails();
    cart = cart.filter(item => item.id != productId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    dispatchCartUpdate(); 
};

// --- NUEVA FUNCIÓN: GUARDAR EN BASE DE DATOS (La Magia) ---
export const submitOrderToSupabase = async () => {
    const cart = getCartDetails();
    if (cart.length === 0) return null;

    try {
        // 1. OBTENER USUARIO (Será null si es anónimo)
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user ? user.id : null; 

        // 2. CREAR CARRITO (Tabla 'carrito')
        const { data: carritoData, error: carritoError } = await supabase
            .from('carrito')
            .insert([
                { 
                    id_usuario: userId, // null si no hay login
                    estado: 'creado'    // Estado inicial
                }
            ])
            .select() // Necesario para que nos devuelva el ID generado
            .single();

        if (carritoError) throw carritoError;
        const idCarritoNuevo = carritoData.id_carrito;

        // 3. PREPARAR DETALLES (Tabla 'detalle_carrito')
        const detallesParaInsertar = cart.map(item => {
            // Truco: Si el ID es complejo (ej: "1-250g-Grano"), sacamos solo el número inicial
            const idProductoReal = parseInt(item.id.toString().split('-')[0]);

            return {
                id_carrito: idCarritoNuevo,
                id_producto: idProductoReal,
                cantidad: item.cantidad || item.quantity,
                precio_unitario_actual: item.price || 0 // Precio guardado al añadir
            };
        });

        // Insertar detalles
        const { error: detalleError } = await supabase
            .from('detalle_carrito')
            .insert(detallesParaInsertar);

        if (detalleError) throw detalleError;

        // 4. CREAR LOG HISTÓRICO (Tabla 'logs_carrito')
        // Generamos un texto plano resumen
        const resumenTexto = cart.map(i => `[${i.quantity}x ${i.name} ($${i.price})]`).join(', ');

        const { error: logError } = await supabase
            .from('logs_carrito')
            .insert([
                {
                    id_carrito: idCarritoNuevo,
                    accion: 'creacion_pedido',
                    descripcion: `Pedido Web Generado: ${resumenTexto}`
                }
            ]);

        if (logError) throw logError;

        return idCarritoNuevo; // Devolvemos el ID por si queremos usarlo

    } catch (error) {
        console.error("Error guardando pedido en Supabase:", error);
        throw error; // Lanzamos el error para que la UI sepa que falló
    }
};

export const generateWhatsAppUrl = () => {
    const cart = getCartDetails();
    const phoneNumber = "56937576440"; 
    const itemsText = cart.map(item => `- ${item.name}: ${item.quantity} ud(s)`).join('\n');
    let message = `¡Hola! Me gustaría hacer el siguiente pedido:\n\n${itemsText || 'Consultando...'}`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

export const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    dispatchCartUpdate();
};