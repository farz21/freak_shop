import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('freakCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ESTADO PARA LA ALERTA GLOBAL
  const [alerta, setAlerta] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  useEffect(() => {
    localStorage.setItem('freakCart', JSON.stringify(cart));
  }, [cart]);

  const mostrarAlerta = (title, message, type = 'success') => {
    setAlerta({ isOpen: true, title, message, type });
  };

  const cerrarAlerta = () => {
    setAlerta({ ...alerta, isOpen: false });
  };

  const addToCart = (producto) => {
    setCart((prev) => {
      if (prev.find(item => item.id === producto.id)) {
        mostrarAlerta("¡Ya lo tienes!", "Este producto ya está en tu carrito.", "info");
        return prev;
      }
      mostrarAlerta("¡Agregado!", `${producto.nombre} ya es parte de tu bolsa.`, "success");
      return [...prev, producto];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('freakCart');
  };

  const totalPrecio = cart.reduce((acc, prod) => acc + prod.precio, 0);

  const finalizarCompra = (user) => {
    if (!user) {
      mostrarAlerta("Inicia Sesión", "Debes estar logueado para realizar un pedido.", "error");
      return { success: false };
    }
    if (cart.length === 0) {
      mostrarAlerta("Carrito vacío", "No tienes productos para comprar.", "info");
      return { success: false };
    }

    const nuevoPedido = {
      id: Date.now(),
      fecha: new Date().toLocaleString(),
      usuario: user.nombre,
      email: user.email,
      telefono: user.telefono || "No registrado",
      productos: [...cart],
      total: totalPrecio,
      estado: "PENDIENTE"
    };

    const pedidosExistentes = JSON.parse(localStorage.getItem('freakPedidos') || '[]');
    localStorage.setItem('freakPedidos', JSON.stringify([nuevoPedido, ...pedidosExistentes]));

    clearCart();
    setIsCartOpen(false);
    mostrarAlerta("¡COMPRA EXITOSA!", "Tu pedido ha sido enviado al administrador.", "success");
    
    return { success: true };
  };

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, clearCart, 
      isCartOpen, setIsCartOpen, totalPrecio, 
      finalizarCompra, alerta, cerrarAlerta, mostrarAlerta 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);