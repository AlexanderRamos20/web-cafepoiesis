import './MenuConsumo.css';
import expresoImg from './img/expreso.jpg';
import brownieImg from './img/brownie.jpg';
import barraChocolateImg from './img/barra_chocolate.jpg';

const productos = [
  {
    nombre: 'Espresso',
    descripcion: 'Intenso y aromático',
    precio: '$2.000',
    categoria: 'Café preparado',
    imagen: expresoImg
  },
  {
    nombre: 'Brownie',
    descripcion: 'Clásico, húmedo y delicioso. Ideal para acompañar tu café.',
    precio: '$1.800',
    categoria: 'Pastelería',
    imagen: brownieImg
  },
  {
    nombre: 'Barra de Chocolate Bogo 70%',
    descripcion: 'Chocolate ecuatoriano 70% cacao. Bean to Bar artesanal.',
    precio: '$5.900',
    categoria: 'Chocolates Bean to Bar',
    imagen: barraChocolateImg
  },
];

function MenuConsumo() {
  return (
    <section className="menu-consumo">
      <h2>Menú de Consumo Directo</h2>
      <div className="productos">
        {productos.map((item, index) => (
          <div key={index} className="producto">
            <img src={item.imagen} alt={item.nombre} className="producto-img" />
            <h3>{item.nombre}</h3>
            <p>{item.descripcion}</p>
            <span className="precio">{item.precio}</span>
            <p className="categoria">{item.categoria}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MenuConsumo;
