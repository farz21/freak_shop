import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { X, ShoppingCart, Plus, Minus } from 'lucide-react';
import styles from './ProductCard.module.css';

const ProductCard = ({ producto }) => {
  const { user, setShowLogin } = useAuth();
  // 1. Traemos productosData del contexto
  const { addToCart, productosData } = useCart(); 
  const [showModal, setShowModal] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  // 2. Buscamos la versión "en vivo" del producto para tener el stock actualizado
  const productoEnVivo = productosData.find(p => p.id === producto.id) || producto;

  const handleAdd = (e, cant = 1) => {
    if (e) e.stopPropagation(); 
    if (!user) {
      setShowLogin(true);
    } else {
      // Usamos el producto original para la lógica, el Context se encarga del resto
      addToCart(productoEnVivo, cant); 
      setCantidad(1);
    }
  };

  const incrementar = () => {
    if (cantidad < productoEnVivo.stock) setCantidad(prev => prev + 1);
  };

  const decrementar = () => {
    if (cantidad > 1) setCantidad(prev => prev - 1);
  };

  return (
    <>
      <div className={styles.card}>
        <img src={productoEnVivo.imagen} alt={productoEnVivo.nombre} className={styles.image} />
        
        <div className={styles.content}>
          <h3 className={styles.title}>{productoEnVivo.nombre}</h3>
          <p className={styles.price}>${productoEnVivo.precio.toLocaleString()}</p>
          
          <div className={styles.actions}>
            <button className={styles.btnSecundario} onClick={() => setShowModal(true)}>
              Ver más
            </button>
            <button 
              onClick={(e) => handleAdd(e, 1)} 
              className={styles.btnPrimario}
              // 3. Usamos productoEnVivo para deshabilitar si no hay stock
              disabled={productoEnVivo.stock === 0}
            >
              {productoEnVivo.stock === 0 ? 'Sin Stock' : 'Añadir'}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE DETALLE */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
              <X size={24} />
            </button>
            
            <div className={styles.modalBody}>
              <div className={styles.modalImageContainer}>
                <img src={productoEnVivo.imagen} alt={productoEnVivo.nombre} />
              </div>
              
              <div className={styles.modalInfo}>
                <span className={styles.categoryBadge}>{productoEnVivo.categoria.toUpperCase()}</span>
                <h2>{productoEnVivo.nombre}</h2>
                <p className={styles.description}>
                  {productoEnVivo.descripcion}
                </p>
                
                <div className={styles.stockInfo}>
                  {/* 4. Aquí ahora se verá el stock que baja en tiempo real */}
                  Disponibles: <span className={productoEnVivo.stock === 0 ? styles.noStockText : ''}>
                    {productoEnVivo.stock} unidades
                  </span>
                </div>

                {productoEnVivo.stock > 0 && (
                  <div className={styles.selectorCantidad}>
                    <button onClick={decrementar} className={styles.cantBtn}><Minus size={18}/></button>
                    <span className={styles.cantValor}>{cantidad}</span>
                    <button onClick={incrementar} className={styles.cantBtn}><Plus size={18}/></button>
                  </div>
                )}

                <div className={styles.modalFooter}>
                  <span className={styles.modalPrice}>${(productoEnVivo.precio * cantidad).toLocaleString()}</span>
                  <button 
                    className={styles.modalAddBtn} 
                    disabled={productoEnVivo.stock === 0}
                    onClick={() => { handleAdd(null, cantidad); setShowModal(false); }}
                  >
                    <ShoppingCart size={20} /> 
                    {productoEnVivo.stock === 0 ? 'SIN STOCK' : 'AÑADIR'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;