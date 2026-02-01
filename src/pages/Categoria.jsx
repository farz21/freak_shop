import { useParams } from 'react-router-dom';
import { productos } from '../data/productos'; // Importas los datos
import ProductCard from '../components/ProductCard';

const Categoria = () => {
  const { tipo } = useParams();

  // Filtramos los productos según la categoría de la URL
  const filtrados = productos.filter(p => p.categoria === tipo);

  return (
    <div style={{ padding: '40px' }}>
      <h2 style={{ textTransform: 'uppercase', color: '#00ff88' }}>{tipo}</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {filtrados.map(prod => (
          <ProductCard key={prod.id} producto={prod} />
        ))}
      </div>
    </div>
  );
};

export default Categoria;