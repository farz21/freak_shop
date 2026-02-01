import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext' // <--- Importalo
import { CartProvider } from './context/CartContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* El Provider debe envolver a App para que useAuth funcione en toda la web */}
    <AuthProvider>
  <CartProvider>
    <App />
  </CartProvider>
</AuthProvider>
  </React.StrictMode>,
)