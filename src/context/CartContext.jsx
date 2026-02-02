import { createContext, useState, useContext, useEffect } from 'react';
import { productos as productosIniciales } from '../data/productos'; // Importa tus productos

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Estado para los productos (para que el stock sea dinámico)
  const [productosData, setProductosData] = useState(() => {
    const savedStock = localStorage.getItem('freakStock');
    return savedStock ? JSON.parse(savedStock) : productosIniciales;
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('freakCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [alerta, setAlerta] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  useEffect(() => {
    localStorage.setItem('freakCart', JSON.stringify(cart));
    localStorage.setItem('freakStock', JSON.stringify(productosData));
  }, [cart, productosData]);

  const cerrarAlerta = () => setAlerta({ ...alerta, isOpen: false });
  const mostrarAlerta = (title, message, type = 'success') => setAlerta({ isOpen: true, title, message, type });

  const addToCart = (producto, cantidad = 1) => {
    // Buscar el producto en nuestro estado de stock actual
    const prodEnStock = productosData.find(p => p.id === producto.id);
    
    setCart((prev) => {
      const itemExistente = prev.find(item => item.id === producto.id);
      const cantidadEnCarrito = itemExistente ? itemExistente.cantidad : 0;

      if (cantidadEnCarrito + cantidad > prodEnStock.stock) {
        mostrarAlerta("Sin Stock", `Solo quedan ${prodEnStock.stock} unidades.`, "info");
        return prev;
      }

      if (itemExistente) {
        return prev.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      }
      return [...prev, { ...producto, cantidad }];
    });
    mostrarAlerta("¡Agregado!", `${producto.nombre} añadido.`, "success");
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));

  const totalPrecio = cart.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
  const totalItems = cart.reduce((acc, prod) => acc + prod.cantidad, 0);

  const finalizarCompra = (user) => {
    if (!user) return { success: false };
    
    // 2. DESCONTAR STOCK REAL AL FINALIZAR
    const nuevosProductos = productosData.map(p => {
      const comprado = cart.find(item => item.id === p.id);
      return comprado ? { ...p, stock: p.stock - comprado.cantidad } : p;
    });

    setProductosData(nuevosProductos);

    const nuevoPedido = {
      id: Date.now(),
      fecha: new Date().toLocaleString(),
      usuario: user.nombre,
      productos: cart.map(item => ({
        nombre: item.nombre,
        cantidad: item.cantidad, // <-- Detalle de cantidad para el Admin
        subtotal: item.precio * item.cantidad
      })),
      total: totalPrecio,
      estado: "PENDIENTE"
    };

    const pedidos = JSON.parse(localStorage.getItem('freakPedidos') || '[]');
    localStorage.setItem('freakPedidos', JSON.stringify([nuevoPedido, ...pedidos]));

    setCart([]);
    setIsCartOpen(false);
    mostrarAlerta("¡ÉXITO!", "Pedido enviado.", "success");
    return { success: true };
  };

  return (
    <CartContext.Provider value={{ 
      cart, productosData, addToCart, removeFromCart, 
      totalPrecio, totalItems, finalizarCompra, alerta, cerrarAlerta,
      isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);