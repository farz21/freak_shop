import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Categoria from './pages/Categoria';
import LoginModal from './components/LoginModal';
import AdminPanel from './pages/AdminPanel';
import CartSidebar from './components/CartSidebar';
import CustomAlert from './components/testt';
import { useCart } from './context/CartContext'; 
import Footer from './components/Footer';

function App() {
  // Extraemos los datos de la alerta global del contexto
  const { alerta, cerrarAlerta } = useCart();

  return (
    <BrowserRouter>
      <Navbar />
      <CartSidebar />
      <LoginModal />
      
      {/* Alerta Global estilo SweetAlert */}
      <CustomAlert 
        isOpen={alerta.isOpen}
        title={alerta.title}
        message={alerta.message}
        type={alerta.type}
        onClose={cerrarAlerta}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:tipo" element={<Categoria />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;