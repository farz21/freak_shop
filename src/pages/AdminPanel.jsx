import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 
import { Navigate } from 'react-router-dom';
import { Users, Ticket, Package, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
  // --- 1. ESTADOS Y CONTEXTOS ---
  const { user } = useAuth();
  const { mostrarAlerta, productosData } = useCart(); // Datos dinámicos del stock
  const [activeTab, setActiveTab] = useState('usuarios'); // Controla qué pestaña se ve
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [pedidoAEliminar, setPedidoAEliminar] = useState(null); // Guarda el ID del pedido a borrar para el modal

  // --- 2. EFECTOS (Carga de datos al montar el componente) ---
  useEffect(() => {
    // Recuperamos los datos guardados en el navegador
    setRegisteredUsers(JSON.parse(localStorage.getItem('freakUsers') || '[]'));
    setPedidos(JSON.parse(localStorage.getItem('freakPedidos') || '[]'));
  }, []);

  // --- 3. LÓGICA DE GESTIÓN DE PEDIDOS ---
  const cambiarEstadoPedido = (id) => {
    const nuevosPedidos = pedidos.map(p => 
      p.id === id ? { ...p, estado: 'ENTREGADO' } : p
    );
    setPedidos(nuevosPedidos);
    localStorage.setItem('freakPedidos', JSON.stringify(nuevosPedidos));
    mostrarAlerta("ACTUALIZADO", "El pedido ha sido marcado como entregado.", "success");
  };

  const confirmarEliminacion = () => {
    if (pedidoAEliminar) {
      const nuevosPedidos = pedidos.filter(p => p.id !== pedidoAEliminar);
      setPedidos(nuevosPedidos);
      localStorage.setItem('freakPedidos', JSON.stringify(nuevosPedidos));
      setPedidoAEliminar(null);
      mostrarAlerta("ELIMINADO", "El ticket ha sido borrado del sistema.", "info");
    }
  };

  // --- 4. SEGURIDAD (Solo administradores) ---
  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  return (
    <div className={styles.container}>
      {/* --- ENCABEZADO DEL PANEL --- */}
      <header className={styles.header}>
        <h1 className={styles.title}>CENTRAL DE COMANDO</h1>
        <p className={styles.subtitle}>Admin: {user.nombre}</p>
      </header>

      <div className={styles.adminBody}>
        {/* --- BARRA LATERAL (MENÚ) --- */}
        <aside className={styles.sidebar}>
          <button className={activeTab === 'usuarios' ? styles.activeBtn : styles.btn} onClick={() => setActiveTab('usuarios')}>
            <Users size={20} /> Usuarios
          </button>
          <button className={activeTab === 'pedidos' ? styles.activeBtn : styles.btn} onClick={() => setActiveTab('pedidos')}>
            <Ticket size={20} /> Pedidos
          </button>
          <button className={activeTab === 'productos' ? styles.activeBtn : styles.btn} onClick={() => setActiveTab('productos')}>
            <Package size={20} /> Stock
          </button>
        </aside>

        {/* --- CONTENIDO PRINCIPAL (CAMBIA SEGÚN LA PESTAÑA) --- */}
        <section className={styles.content}>
          
          {/* PESTAÑA 1: USUARIOS REGISTRADOS */}
          {activeTab === 'usuarios' && (
            <div className={styles.sectionCard}>
              <h2>Usuarios Registrados</h2>
              <div className={styles.tableResponsive}> {/* Contenedor para scroll móvil */}
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredUsers.map((u, i) => (
                      <tr key={i}>
                        <td>{u.nombre}</td>
                        <td>{u.email}</td>
                        <td>{u.telefono}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PESTAÑA 2: LISTADO DE PEDIDOS (TICKETS) */}
          {activeTab === 'pedidos' && (
            <div className={styles.sectionCard}>
              <h2>Tickets de Venta Detallados</h2>
              <div className={styles.ticketsGrid}>
                {pedidos.map((p) => (
                  <div key={p.id} className={`${styles.ticketCard} ${p.estado === 'ENTREGADO' ? styles.entregado : ''}`}>
                    <div className={styles.ticketHeader}>
                      <strong>TICKET #{p.id.toString().slice(-4)}</strong>
                      <span className={p.estado === 'ENTREGADO' ? styles.badgeSuccess : styles.statusBadge}>
                        {p.estado}
                      </span>
                    </div>
                    <div className={styles.clientInfo}>
                      <p><strong>Cliente:</strong> {p.usuario}</p>
                      <p><strong>Fecha:</strong> {p.fecha}</p>
                    </div>
                    
                    {/* Tabla simplificada de productos dentro del ticket */}
                    <div className={styles.productTable}>
                      <div className={styles.tableHeader}>
                        <span>PRODUCTO (CANT.)</span>
                        <span>SUBTOTAL</span>
                      </div>
                      {p.productos.map((item, idx) => (
                        <div key={idx} className={styles.tableRow}>
                          <span className={styles.prodName}>
                            {item.nombre} <strong>({item.cantidad})</strong>
                          </span>
                          <span className={styles.prodPrice}>
                            ${(item.precio * item.cantidad).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.ticketFooter}>
                      <div>
                        <span className={styles.totalLabel}>TOTAL: </span>
                        <span className={styles.totalValue}>${p.total.toLocaleString()}</span>
                      </div>
                      {/* Botones de acción del pedido */}
                      <div className={styles.actions}>
                        {p.estado === 'PENDIENTE' && (
                          <button className={styles.completeBtn} onClick={() => cambiarEstadoPedido(p.id)} title="Marcar entregado">
                            <CheckCircle size={20} />
                          </button>
                        )}
                        <button className={styles.deleteBtn} onClick={() => setPedidoAEliminar(p.id)} title="Borrar ticket">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PESTAÑA 3: CONTROL DE INVENTARIO (Aquí es donde se arregló el desborde) */}
          {activeTab === 'productos' && (
            <div className={styles.sectionCard}>
              <h2>Control de Inventario Dinámico</h2>
              <div className={styles.tableResponsive}> {/* Envuelve la tabla para que sea deslizable en móviles */}
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className={styles.categoryColumn}>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosData.map((p) => (
                      <tr key={p.id}>
                        <td>{p.nombre}</td>
                        <td className={styles.categoryColumn}>{p.categoria.toUpperCase()}</td>
                        <td>${p.precio.toLocaleString()}</td>
                        {/* Clase lowStock si quedan menos de 3 unidades */}
                        <td className={p.stock < 3 ? styles.lowStock : ''}>
                          {p.stock === 0 ? 'AGOTADO' : `${p.stock} u.`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* --- 5. MODAL DE CONFIRMACIÓN (Capa flotante) --- */}
      {pedidoAEliminar && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmModal}>
            <AlertTriangle size={50} color="#ff4444" />
            <h3>¿BORRAR TICKET?</h3>
            <p>Esta acción no se puede deshacer.</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setPedidoAEliminar(null)}>CANCELAR</button>
              <button className={styles.confirmBtn} onClick={confirmarEliminacion}>BORRAR AHORA</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;