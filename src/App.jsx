import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/header.jsx';
import InstagramFeedLite from './components/InstagramFeed.jsx';
import { useInstagramMedia } from "./hooks/instagramMedia";
import MenuConsumo from './MenuConsumo.jsx';
import BurbujaCarrito from './components/BurbujaCarrito.jsx'; 
import BurbujaContactoGeneral from './components/BurbujaContactoGeneral.jsx'; 
import GranoGeneral from './components/PaginasCafe/GranoGeneral.jsx';
import Mapa from './components/map.jsx';
import Insumos from './Insumos.jsx';
import Footer from './components/footer.jsx';
import Preparaciones from './Preparaciones.jsx'; // 1. IMPORTA el nuevo component
import CallLoyverse from "./components/loyverse.jsx";
import CallHorariosCache from './components/CallHorariosCache.jsx';

function App() {
  const { media, loading, error } = useInstagramMedia(3);
  const location = useLocation();

  useEffect(() => {
    const scrollTargets = {
      '#seccion-cafes-grano': 'seccion-cafes-grano',
      '#menu-consumo': 'menu-consumo',
      '#seccion-instagram': 'seccion-instagram',
      '#seccion-insumos': 'seccion-insumos',
      '#seccion-preparaciones': 'seccion-preparaciones', 
      '#mapa': 'mapa', 
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
        <CallLoyverse />
        <CallHorariosCache />
        <section id="seccion-preparaciones">
          <Preparaciones />
        </section>

        <section id="seccion-insumos">
          <Insumos />
        </section>

        {/* 1. CAFÉS DE GRANO: Quitamos margen inferior (mb-0) y padding inferior (pb-0) */}
        <section id="seccion-cafes-grano" className="mb-0 pb-0">
          <GranoGeneral />
        </section>

        {/* 2. MENÚ DE CONSUMO (LA CARTA): 
            - pt-2: Muy poquito espacio arriba (casi pegado a Cafés)
            - pb-2: Muy poquito espacio abajo (casi pegado a Instagram)
        */}
        <section id="menu-consumo" className="py-2"> 
          <MenuConsumo />
        </section>

        {/* 3. INSTAGRAM: Quitamos padding superior (pt-0) para que suba hacia el menú */}
        <section id="seccion-instagram" className="pt-0 pb-5">
          <h2 className="insta-title mt-4">Lo último en nuestro Instagram ☕</h2>
          <InstagramFeedLite
            media={media}
            loading={loading}
            limit={3}
            columns={{ base: 1, md: 3, lg: 3 }}
          />
        </section>
        
        <section id="mapa" className="py-5">
          <Mapa/>
        </section>

        <section>
            <Footer/>
        </section>
      
      </main>
      
      <BurbujaCarrito />
      <BurbujaContactoGeneral />
    </>
  );
}

export default App;