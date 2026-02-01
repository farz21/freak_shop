import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  // 1. Efecto para recuperar la sesión al cargar la página
  useEffect(() => {
    const savedUser = localStorage.getItem('freakSession');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 2. Función de Registro (Guarda múltiples campos)
  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('freakUsers') || '[]');
    
    if (users.find(u => u.email === userData.email)) {
      alert("Este email ya está registrado.");
      return false;
    }

    const newUser = { 
      ...userData, 
      role: 'user',
      createdAt: new Date().toISOString() 
    };

    users.push(newUser);
    localStorage.setItem('freakUsers', JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem('freakSession', JSON.stringify(newUser));
    setShowLogin(false);
    return true;
  };

  // 3. Función de Login (Modificada para retornar el usuario/rol)
  const login = (email, password) => {
    let foundUser = null;

    // Caso especial: Admin fijo
    if (email === 'admin@admin.com' && password === '123') {
      foundUser = { 
        email, 
        role: 'admin', 
        nombre: 'Administrador Central' 
      };
    } else {
      // Buscar en los usuarios registrados en localStorage
      const users = JSON.parse(localStorage.getItem('freakUsers') || '[]');
      foundUser = users.find(u => u.email === email && u.password === password);
    }
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('freakSession', JSON.stringify(foundUser));
      setShowLogin(false);
      return foundUser; // Retornamos el objeto para que el modal maneje la redirección
    }
    
    return null; // Retornamos null si las credenciales no coinciden
  };

  // 4. Función de Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('freakSession');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      showLogin, 
      setShowLogin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};