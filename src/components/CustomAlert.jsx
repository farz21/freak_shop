import { CheckCircle, XCircle, Info } from 'lucide-react';
import styles from './CustomAlert.module.css';

const CustomAlert = ({ isOpen, title, message, type, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}>
          {type === 'success' && <CheckCircle size={70} color="#00ff88" />}
          {type === 'error' && <XCircle size={70} color="#ff4444" />}
          {type === 'info' && <Info size={70} color="#00d1ff" />}
        </div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <button className={styles.btn} onClick={onClose}>ENTENDIDO</button>
      </div>
    </div>
  );
};

export default CustomAlert;