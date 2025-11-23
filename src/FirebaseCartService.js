// Nombre: Servicio de Carrito (Simulación de DB con LocalStorage + Sync Supabase)
import { supabase } from './supabaseClient';

const CART_KEY = 'poiesis_cart';
const CART_ID_KEY = 'poiesis_cart_id';

// Helper para obtener ID de carrito persistente
const getOrCreateCartId = () => {
    let cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) {
        cartId = crypto.randomUUID();
        localStorage.setItem(CART_ID_KEY, cartId);
    }
    return cartId;
};

// Función para sincronizar con Supabase (Fire and Forget)
const syncCartToSupabase = async () => {
    const cart = getCartDetails();
    const total = cart.reduce((sum, item) => sum + (item.quantity * 0), 0); // Precio pendiente

    // Intentamos obtener el ID numérico de la BD guardado previamente
    let dbCartId = localStorage.getItem('poiesis_db_cart_id');

    try {
        if (!dbCartId) {
            // Si no tenemos ID, creamos un nuevo carrito
            const { data, error } = await supabase
                .from('carrito')
                .insert([{
                    total: total,
                    estado: 'activo'
                }])
                .select('id_carrito')
                .single();

            if (error) throw error;
            if (data) {
                dbCartId = data.id_carrito;
                localStorage.setItem('poiesis_db_cart_id', dbCartId);
            }
        } else {
            // Si tenemos ID, actualizamos el total
            const { error } = await supabase
                .from('carrito')
                .update({
                    total: total,
                    updated_at: new Date().toISOString()
                })
                .eq('id_carrito', dbCartId); // Usamos id_carrito

            if (error) {
                // Si falla (ej. borrado en BD), limpiamos ID local y reintentamos (recursivo simple)
                console.warn("Error updating cart, maybe deleted?", error);
                localStorage.removeItem('poiesis_db_cart_id');
                return syncCartToSupabase();
            }
        }

        // 2. Sincronizar detalles
        // Primero limpiamos detalles antiguos
        await supabase.from('detalle_carrito').delete().eq('id_carrito', dbCartId);

        // Insertamos nuevos
        if (cart.length > 0) {
            const itemsToInsert = cart.map(item => ({
                id_carrito: dbCartId, // Usamos el ID entero
                id_producto: typeof item.id === 'number' ? item.id : null, // Solo si es ID válido de producto
                cantidad: item.quantity,
                precio_unitario_actual: 0 // Placeholder, idealmente vendría del producto
            }));

            // Filtramos ítems sin ID de producto válido si es estricto, 
            // pero el esquema pide id_producto NOT NULL.
            // Si item.id no es número (ej. generado localmente), esto fallará.
            // Asumiremos que los productos tienen ID numérico correcto.
            const validItems = itemsToInsert.filter(i => i.id_producto);

            if (validItems.length > 0) {
                const { error: detailsError } = await supabase
                    .from('detalle_carrito')
                    .insert(validItems);

                if (detailsError) throw detailsError;
            }
        }
    } catch (error) {
        console.error("Error syncing cart to Supabase:", error);
    }
};

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
    syncCartToSupabase(); // Sync async
};

export const removeFromCart = (productId) => {
    let cart = getCartDetails();
    cart = cart.filter(item => item.id != productId);

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    dispatchCartUpdate();
    syncCartToSupabase(); // Sync async
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
    syncCartToSupabase(); // Sync async (will clear details)
};