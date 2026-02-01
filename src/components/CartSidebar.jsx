import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import styles from './CartSidebar.module.css';

const CartSidebar = () => {
  const { user } = useAuth();
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, totalPrecio, finalizarCompra } = useCart();

  if (!isCartOpen) return null;

  const handleFinalizar = () => {
    // La función finalizarCompra ya dispara la alerta estética desde el Context
    // por lo que no hace falta poner alerts ni estados aquí.
    finalizarCompra(user);
  };

  return (
    <div className={styles.overlay} onClick={() => setIsCartOpen(false)}>
      <div className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2><ShoppingBag size={20} /> MI BOLSA</h2>
          <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {cart.length === 0 ? (
            <div className={styles.empty}>
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img src={item.imagen} alt={item.nombre} className={styles.itemImg} />
                <div className={styles.itemInfo}>
                  <h4>{item.nombre}</h4>
                  <p>${item.precio.toLocaleString()}</p>
                </div>
                <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>TOTAL:</span>
              <span className={styles.totalAmount}>${totalPrecio.toLocaleString()}</span>
            </div>
            <button className={styles.checkoutBtn} onClick={handleFinalizar}>
              FINALIZAR COMPRA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;