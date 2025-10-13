import React, { useEffect, useState } from 'react'; 
import { useLocation } from 'react-router-dom'; 
import Header from './components/header.jsx';
import InstagramFeedLite from './components/InstagramFeedLite.jsx';
import MenuConsumo from './MenuConsumo.jsx';
import BurbujaContacto from './components/BurbujaContaco.jsx';
import GranoGeneral from './components/PaginasCafe/GranoGeneral.jsx'; 
import Mapa from './components/map.jsx';

const urls = [
  "https://www.instagram.com/p/DFao3gnxQhB/",
  "https://www.instagram.com/p/CiEEbxEs5uB/",
  "https://www.instagram.com/p/DPP9mxkjdyW/",
];

function App() {
  const location = useLocation(); 
  const [seccionActiva, setSeccionActiva] = useState('instagram');

  useEffect(() => {
    if (location.hash === '#seccion-cafes-grano') {
      const section = document.getElementById('seccion-cafes-grano');
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
      <Header 
        onMenuClick={() => setSeccionActiva('menu')} 
        onInstagramClick={() => setSeccionActiva('instagram')} 
      />
      <Mapa />
      <main className="app-main">
        <section id="seccion-cafes-grano">
          <GranoGeneral /> 
        </section>

        {seccionActiva === 'instagram' && (
          <>
            <h2 className="app-title">Lo último en nuestro Instagram ☕</h2>
            <InstagramFeedLite
              urls={urls}
              limit={3}
              columns={{ base: 1, md: 3, lg: 3 }}
            />
          </>
        )}

        {seccionActiva === 'menu' && <MenuConsumo />}
      </main>
      <BurbujaContacto />
    </>
  );
}

export default App;
