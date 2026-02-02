import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import styles from './Home.module.css';


const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Datos para el carrusel
  const slides = [
    {
      id: 1,
      type: 'product',
      title: "ANILLO KAIOSHIN",
      desc: "Cambia las lineas temporales a tu placer.",
      img: "/images/anillo-goku.jfif",
      color: "#00ff88"
    },
    {
      id: 2,
      type: 'upcoming',
      title: "PRÓXIMAMENTE: COLECCIÓN STAR WARS",
      desc: "Nuevos sables de luz con sonido real. Elige tu camino.",
      img: "/images/sables.jpg", 
      color: "#00d1ff"
    },
    {
      id: 3,
      type: 'product',
      title: "PULSERA DRAGÓN",
      desc: "Forjada en fuego, diseñada para coleccionistas.",
      img: "/images/pulsera.jpeg",
      color: "#ff4444"
    }
  ];

  // Cambio automático cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className={styles.homeContainer}>
      <header className={styles.hero}>
        <h1 className={styles.mainTitle}>
          BIENVENIDOS A LA <span className={styles.glitch}>FREAK SHOP</span>
        </h1>
        <p className={styles.mainSubtitle}>Equipamiento de nivel legendario para tu setup.</p>
      </header>

      {/* CARRUSEL NEÓN */}
      <div className={styles.carouselContainer}>
        <button className={styles.navBtn} onClick={prevSlide}><ChevronLeft size={40} /></button>
        
        <div className={styles.carouselFrame}>
          {slides.map((slide, index) => (
            <div 
              key={slide.id} 
              className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${slide.img})` }}
            >
              <div className={styles.slideContent}>
                {slide.type === 'upcoming' && <span className={styles.badge}><Zap size={14} /> EXCLUSIVO</span>}
                <h2 style={{ color: slide.color }}>{slide.title}</h2>
                <p>{slide.desc}</p>
                <button className={styles.btnExplorar} style={{ borderColor: slide.color }}>
                  {slide.type === 'upcoming' ? 'AVÍSAME AL LANZAR' : 'VER PRODUCTO'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className={styles.navBtn} onClick={nextSlide}><ChevronRight size={40} /></button>
      </div>

      <section className={styles.features}>
        <div className={styles.featureItem}>
          <h3>ENVÍOS INTERGALÁCTICOS</h3>
          <p>Llegamos a cada rincón de la galaxia (y de Tucumán).</p>
        </div>
        <div className={styles.featureItem}>
          <h3>PAGO EN CRÉDITOS</h3>
          <p>Aceptamos todas las tarjetas y transferencias imperiales.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;