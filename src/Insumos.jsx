import './Insumos.css';
import aeropressImg from './img/aeropress.jpg';
import molinoImg from './img/molino.jpg';
import filtrosV60Img from './img/filtros-v60.jpg';
import filtrosAeropressImg from './img/filtros-aeropress.jpg';

const productos = [
  {
    nombre: 'Aeropress Clear Morada',
    descripcion: 'Morada. Vienen con filtros incluidos.',
    precio: '$59.500',
    categoria: 'Métodos de preparación',
    imagen: aeropressImg
  },
  {
    nombre: 'Molino Hario Zebrang',
    descripcion: 'Muelas de acero inoxidable.',
    precio: '$59.500',
    categoria: 'Herramientas',
    imagen: molinoImg
  },
  {
    nombre: 'Filtros V60 (40 unidades)',
    descripcion: 'Tamaño 01 o 02. Paquete de 40 unidades.',
    precio: '$4.000',
    categoria: 'Filtros',
    imagen: filtrosV60Img
  },
  {
    nombre: 'Filtros Aeropress (350 unidades)',
    descripcion: 'Filtros circulares para Aeropress.',
    precio: '$12.000',
    categoria: 'Filtros',
    imagen: filtrosAeropressImg
  },
];

function Insumos() {
  const categorias = [...new Set(productos.map(p => p.categoria))];

  return (
    <section id="seccion-insumos" className="insumos">
      <h2>Insumos y Accesorios</h2>
      {categorias.map((cat, i) => (
        <div key={i} className="categoria-bloque">
          <h3>{cat}</h3>
          <div className="productos">
            {productos.filter(p => p.categoria === cat).map((item, index) => (
              <div key={index} className="producto">
                <img src={item.imagen} alt={item.nombre} className="producto-img" />
                <h4>{item.nombre}</h4>
                <p>{item.descripcion}</p>
                <span className="precio">{item.precio}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default Insumos;
