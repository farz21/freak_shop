import { useCart } from '../context/CartContext';
import { X, Trash2 } from 'lucide-react';
import styles from './CartView.module.css';

const CartView = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, totalItems } = useCart();
  const totalPrecio = cart.reduce((acc, prod) => acc + prod.precio, 0);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h2>TU PEDIDO</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <div className={styles.items}>
          {cart.length === 0 ? <p>El carrito está vacío...</p> : 
            cart.map(prod => (
              <div key={prod.id} className={styles.item}>
                <img src={prod.imagen} alt={prod.nombre} />
                <div>
                  <h4>{prod.nombre}</h4>
                  <p>${prod.precio.toLocaleString()}</p>
                </div>
                <button onClick={() => removeFromCart(prod.id)}><Trash2 size={18}/></button>
              </div>
            ))
          }
        </div>

        {cart.length > 0 && (
          <div className={styles.footer}>
            <h3>Total: ${totalPrecio.toLocaleString()}</h3>
            <button className={styles.btnFinalizar}>FINALIZAR COMPRA</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartView;