import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Terminal, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart(); // Extraemos setIsCartOpen del contexto
  const { user, logout, setShowLogin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.logoContainer}>
        <Terminal size={28} color="#00ff88" />
        <Link to="/" className={styles.logoText} onClick={closeMenu}>
          FREAK<span className={styles.hideMobile}>_SHOP</span>
        </Link>
      </div>

      {/* Botón Hamburguesa */}
      <button className={styles.mobileMenuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Navegación */}
      <ul className={`${styles.navLinks} ${isMenuOpen ? styles.navActive : ''}`}>
        <li><Link to="/categoria/accesorios" className={styles.link} onClick={closeMenu}>Accesorios</Link></li>
        <li><Link to="/categoria/coleccionables" className={styles.link} onClick={closeMenu}>Coleccionables</Link></li>
        <li><Link to="/categoria/outfit" className={styles.link} onClick={closeMenu}>Outfit</Link></li>
      </ul>

      <div className={styles.rightSection}>
        {user ? (
          <div className={styles.userMenu}>
            <div className={styles.userInfo}>
              <UserIcon size={20} color="#00ff88" />
              <span className={styles.userName}>
                {user.role === 'admin' ? 'ADMIN' : (user.nombre ? user.nombre.split(' ')[0].toUpperCase() : 'FREAK')}
              </span>
            </div>
            
            {user.role === 'admin' && (
              <Link to="/admin" className={styles.adminBadge} onClick={closeMenu}>PANEL</Link>
            )}

            <button onClick={() => { logout(); closeMenu(); }} className={styles.logoutBtn} title="Salir">
              <LogOut size={22} />
            </button>
          </div>
        ) : (
          <button className={styles.loginBtn} onClick={() => { setShowLogin(true); closeMenu(); }}>
            INGRESAR
          </button>
        )}

        {/* Al hacer clic aquí, se abre la Sidebar del Carrito */}
        <div 
          className={styles.cartContainer} 
          onClick={() => setIsCartOpen(true)}
          style={{ cursor: 'pointer' }} 
        >
          <ShoppingCart size={28} color="#00ff88" />
          {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;