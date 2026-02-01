import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Importamos para las alertas neón
import { useNavigate } from 'react-router-dom';
import { X, LogIn, UserPlus } from 'lucide-react';
import styles from './LoginModal.module.css';

const LoginModal = () => {
  const { login, register, setShowLogin, showLogin } = useAuth();
  const { mostrarAlerta } = useCart(); 
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '', // Nuevo campo
    nombre: '',
    telefono: ''
  });

  if (!showLogin) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validación para el teléfono: Solo números y máximo 10 caracteres
    if (name === 'telefono') {
      const soloNumeros = value.replace(/\D/g, ''); // Elimina lo que no sea número
      if (soloNumeros.length <= 10) {
        setFormData({ ...formData, [name]: soloNumeros });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // VALIDACIONES DE REGISTRO
    if (!isLogin) {
      // 1. Validar Email con Regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return mostrarAlerta("Email Inválido", "Por favor ingresa un correo real.", "error");
      }

      // 2. Validar largo del teléfono
      if (formData.telefono.length < 8) {
        return mostrarAlerta("Teléfono Corto", "Ingresa un número de contacto válido.", "info");
      }

      // 3. Confirmar que las contraseñas coincidan
      if (formData.password !== formData.confirmPassword) {
        return mostrarAlerta("Error", "Las contraseñas no coinciden.", "error");
      }
    }

    if (isLogin) {
      const loggedUser = login(formData.email, formData.password);
      if (loggedUser) {
        if (loggedUser.role === 'admin') navigate('/admin');
      } else {
        mostrarAlerta("Error", "Verifica tus credenciales.", "error");
      }
    } else {
      const success = register(formData);
      if (success) mostrarAlerta("¡Bienvenido!", "Cuenta creada con éxito.", "success");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={() => setShowLogin(false)}><X /></button>
        
        <div className={styles.header}>
          {isLogin ? <LogIn size={32} color="#00ff88" /> : <UserPlus size={32} color="#00ff88" />}
          <h2 className={styles.title}>{isLogin ? 'INICIAR SESIÓN' : 'REGISTRO FREAK'}</h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>EMAIL</label>
            <input name="email" type="email" placeholder="tu@mail.com" value={formData.email} onChange={handleChange} required />
          </div>

          {!isLogin && (
            <>
              <div className={styles.inputGroup}>
                <label>NOMBRE COMPLETO</label>
                <input name="nombre" type="text" placeholder="Peter Parker" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>TELÉFONO / WHATSAPP (Solo números)</label>
                <input name="telefono" type="tel" placeholder="381#######" value={formData.telefono} onChange={handleChange} required />
              </div>
            </>
          )}

          <div className={styles.inputGroup}>
            <label>CONTRASEÑA</label>
            <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
          </div>

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label>CONFIRMAR CONTRASEÑA</label>
              <input name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          )}

          <button type="submit" className={styles.loginBtn}>
            {isLogin ? 'ENTRAR' : 'CREAR MI CUENTA'}
          </button>
        </form>

        <div className={styles.switchContainer}>
          <p>
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
            <button className={styles.switchBtn} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;