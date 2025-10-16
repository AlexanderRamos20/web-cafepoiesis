// Contenido completo y final para tu archivo: src/Insumos.jsx

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
    subCategoria: 'Cafetera',
    imagen: aeropressImg
  },
  {
    nombre: 'Molino Hario Zebrang',
    descripcion: 'Muelas de acero inoxidable.',
    precio: '$59.500',
    subCategoria: 'Accesorio',
    imagen: molinoImg
  },
  {
    nombre: 'Filtros V60 (40 unidades)',
    descripcion: 'Tamaño 01 o 02. Paquete de 40 unidades.',
    precio: '$4.000',
    // --- AQUÍ ESTÁ EL CAMBIO ---
    subCategoria: 'Filtros', 
    imagen: filtrosV60Img
  },
  {
    nombre: 'Filtros Aeropress (350 unidades)',
    descripcion: 'Filtros circulares para Aeropress.',
    precio: '$12.000',
    // --- Y AQUÍ ---
    subCategoria: 'Filtros', 
    imagen: filtrosAeropressImg
  },
];

function Insumos() {
  return (
    <section id="seccion-insumos" className="insumos container py-5">
      <h2 className="text-center">Insumos y Accesorios</h2>
      
      <div className="row justify-content-center g-4 mt-2">
        {productos.map((item, index) => (
          <div key={index} className="col-auto">
            <div className="card h-100" style={{ width: '18rem' }}>
              <img src={item.imagen} className="card-img-top producto-img" alt={item.nombre} />
              <div className="card-body text-center d-flex flex-column">
                <h5 className="card-title">{item.nombre}</h5>
                
                {item.subCategoria && (
                  <p className="card-text text-muted fst-italic">{item.subCategoria}</p>
                )}

                <p className="card-text small">{item.descripcion}</p>
                <p className="card-text fw-bold mt-auto">{item.precio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Insumos;