import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/header.jsx';
import InstagramFeedLite from './components/InstagramFeedLite.jsx';
import MenuConsumo from './MenuConsumo.jsx';
import BurbujaContacto from './components/BurbujaContaco.jsx';
import GranoGeneral from './components/PaginasCafe/GranoGeneral.jsx';
import Mapa from './components/map.jsx';
import Insumos from './Insumos.jsx';
import Footer from './components/footer.jsx';

const urls = [
  "https://www.instagram.com/p/DFao3gnxQhB/",
  "https://www.instagram.com/p/CiEEbxEs5uB/",
  "https://www.instagram.com/p/DPP9mxkjdyW/",
];

function App() {
  const location = useLocation();

  useEffect(() => {
    const scrollTargets = {
      '#seccion-cafes-grano': 'seccion-cafes-grano',
      '#menu-consumo': 'menu-consumo',
      '#seccion-instagram': 'seccion-instagram',
      '#seccion-insumos': 'seccion-insumos',
    };

    const targetId = scrollTargets[location.hash];
    if (targetId) {
      const section = document.getElementById(targetId);
      const timer = setTimeout(() => {
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <>
      <Header />

      <main className="app-main">
        <section id="menu-consumo">
          <MenuConsumo />
        </section>

        <section id="seccion-insumos">
          <Insumos />
        </section>

        <section id="seccion-cafes-grano">
          <GranoGeneral />
        </section>

        <section id="seccion-instagram">
          <h2 className="app-title">Lo último en nuestro Instagram ☕</h2>
          <InstagramFeedLite
            urls={urls}
            limit={3}
            columns={{ base: 1, md: 3, lg: 3 }}
          />
        </section>
        
        <section id="mapa">
          <Mapa/>
        </section>

        <section>
            <Footer/>
        </section>
      
      </main>
      <BurbujaContacto />
    </>
  );
}

export default App;
