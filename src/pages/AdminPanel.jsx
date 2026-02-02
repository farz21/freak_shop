import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 
import { Navigate } from 'react-router-dom';
import { Users, Ticket, Package, CheckCircle, Trash2, AlertTriangle, Hash } from 'lucide-react';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
  const { user } = useAuth();
  const { mostrarAlerta, productosData } = useCart(); // productosData trae el stock dinámico
  const [activeTab, setActiveTab] = useState('usuarios');
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [pedidoAEliminar, setPedidoAEliminar] = useState(null);

  useEffect(() => {
    setRegisteredUsers(JSON.parse(localStorage.getItem('freakUsers') || '[]'));
    setPedidos(JSON.parse(localStorage.getItem('freakPedidos') || '[]'));
  }, []);

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

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>CENTRAL DE COMANDO</h1>
        <p className={styles.subtitle}>Admin: {user.nombre}</p>
      </header>

      <div className={styles.adminBody}>
        <aside className={styles.sidebar}>
          <button className={activeTab === 'usuarios' ? styles.activeBtn : styles.btn} onClick={() => setActiveTab('usuarios')}><Users size={20} /> Usuarios</button>
          <button className={activeTab === 'pedidos' ? styles.activeBtn : styles.btn} onClick={() => setActiveTab('pedidos')}><Ticket size={20} /> Pedidos</button>
          <button className={activeTab === 'productos' ? styles.activeBtn : styles.btn} onClick={() => setActiveTab('productos')}><Package size={20} /> Stock</button>
        </aside>

        <section className={styles.content}>
          {activeTab === 'usuarios' && (
            <div className={styles.sectionCard}>
              <h2>Usuarios Registrados</h2>
              <table className={styles.table}>
                <thead><tr><th>Nombre</th><th>Email</th><th>Teléfono</th></tr></thead>
                <tbody>
                  {registeredUsers.map((u, i) => (
                    <tr key={i}><td>{u.nombre}</td><td>{u.email}</td><td>{u.telefono}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        {p.estado === 'PENDIENTE' && (
                          <button className={styles.completeBtn} onClick={() => cambiarEstadoPedido(p.id)}>
                            <CheckCircle size={20} />
                          </button>
                        )}
                        <button className={styles.deleteBtn} onClick={() => setPedidoAEliminar(p.id)}>
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'productos' && (
            <div className={styles.sectionCard}>
              <h2>Control de Inventario Dinámico</h2>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock Disponible</th>
                  </tr>
                </thead>
                <tbody>
                  {productosData.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td>{p.categoria.toUpperCase()}</td>
                      <td>${p.precio.toLocaleString()}</td>
                      <td className={p.stock < 3 ? styles.lowStock : ''}>
                        {p.stock === 0 ? 'AGOTADO' : `${p.stock} unidades`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
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