import Header from '../header.jsx'; 
import Footer from '../footer.jsx';
import './GranoGeneral.css'; 
import { Link } from 'react-router-dom';

function GranoGeneral() {
  const coffees = [
    { id: 1, name: 'Bolivia Anproca', notes: 'Caramelo, Miel', price: "9.500", imageUrl: '/public/BoliviaAnproca.jpg' },
    { id: 2, name: 'Colombia Caldas Manzanares', notes: 'Chocolate blanco, Dulce de leche, Zeste de limón', price: "10.500", imageUrl: '/images/colombia-caldas.jpg' },
    { id: 3, name: 'Colombia Familia Zambrano', notes: 'Frutos amarillos, Chocolate, Caramelo, Acidez media citrica', price: "15.000", imageUrl: '/images/colombia-familia.jpg' },
    { id: 4, name: 'Honduras Finca La Valentina', notes: 'Caramelo, Miel, Citrico', price: "15.000", imageUrl: '/images/honduras-valentina.jpg' },
  ];

  return (
    <>
      <Header /> 
      
      <main className="cafes-page-content">
        <h2>Nuestra Selección de Cafés de Grano</h2>
        <p className="description">
          Explora nuestros granos especiales, tostados a la perfección para resaltar sus perfiles de sabor únicos.
        </p>
        
        <div className="coffee-list">
          {coffees.map((coffee) => (
            <Link 
              key={coffee.id} 
              to={`/cafes/${coffee.id}`} 
              className="coffee-card-link" 
            >
              <div className="coffee-card">
                <img src={coffee.imageUrl} alt={coffee.name} className="coffee-image" />
                
                <h3>{coffee.name}</h3>
                <p>Notas de cata: {coffee.notes}</p>
                <p className="price">Desde: ${coffee.price}</p> 
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default GranoGeneral;