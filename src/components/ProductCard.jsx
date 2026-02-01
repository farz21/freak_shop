import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ producto }) => {
  const { user, setShowLogin } = useAuth();
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.stopPropagation(); 
    if (!user) {
      setShowLogin(true);
    } else {
      // Ahora solo llamamos a addToCart. 
      // La alerta estética se dispara sola desde el Contexto.
      addToCart(producto); 
    }
  };

  return (
    <div className={styles.card}>
      <img src={producto.imagen} alt={producto.nombre} className={styles.image} />
      
      <div className={styles.content}>
        <h3 className={styles.title}>{producto.nombre}</h3>
        <p className={styles.price}>${producto.precio.toLocaleString()}</p>
        
        <div className={styles.actions}>
          <button className={styles.btnSecundario}>Ver más</button>
          <button onClick={handleAdd} className={styles.btnPrimario}>
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;