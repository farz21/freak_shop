import { Terminal, Github, Instagram, Twitter, Mail, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Sección Marca */}
        <div className={styles.section}>
          <div className={styles.logo}>
            <Terminal size={24} color="#00ff88" />
            <span>FREAK<span className={styles.neonText}>_SHOP</span></span>
          </div>
          <p className={styles.description}>
            Tu central de suministros geek. Desde el borde exterior hasta tu escritorio.
          </p>
          <div className={styles.socials}>
            {/* target="_blank" abre en otra pestaña, rel="..." es por seguridad */}
            <a 
              href="https://github.com/farz21" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.socialIcon}
              title="GitHub"
            >
              <Github size={20} />
            </a>
            
          </div>
        </div>

        {/* Sección Enlaces Rápidos */}
        <div className={styles.section}>
          <h4 className={styles.title}>NAVEGACIÓN</h4>
          <ul className={styles.links}>
            <li><a href="/categoria/accesorios">Accesorios</a></li>
            <li><a href="/categoria/coleccionables">Coleccionables</a></li>
            <li><a href="/categoria/merch">Merchandising</a></li>
          </ul>
        </div>

        {/* Sección Contacto */}
        <div className={styles.section}>
          <h4 className={styles.title}>CONTACTO</h4>
          <div className={styles.contactItem}>
            <MapPin size={16} color="#00ff88" />
            <span>San Miguel de Tucumán, AR</span>
          </div>
          {/*
          <div className={styles.contactItem}>
            <Mail size={16} color="#00ff88" />
            <span>soporte@freakshop.com</span>
          </div>*/}
        </div>

      </div>

      <div className={styles.bottomBar}>
        <p>&copy; {year} Freak Shop - Todos los derechos reservados.</p>
        <div className={styles.systemStatus}>
          <span className={styles.dot}></span> SISTEMA OPERATIVO
        </div>
      </div>
    </footer>
  );
};

export default Footer;