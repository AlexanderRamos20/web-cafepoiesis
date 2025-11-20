// Contenido modificado para: src/App.jsx

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/header.jsx';
import InstagramFeedLite from './components/InstagramFeed.jsx';
import { useInstagramMedia } from "./hooks/instagramMedia";
import MenuConsumo from './MenuConsumo.jsx';
import BurbujaContacto from './components/BurbujaContaco.jsx';
import GranoGeneral from './components/PaginasCafe/GranoGeneral.jsx';
import Mapa from './components/map.jsx';
import Insumos from './Insumos.jsx';
import Footer from './components/footer.jsx';
import Preparaciones from './Preparaciones.jsx'; // 1. IMPORTA el nuevo component

function App() {
  const { media, loading, error } = useInstagramMedia(3);
  const location = useLocation();

  useEffect(() => {
    const scrollTargets = {
      '#seccion-cafes-grano': 'seccion-cafes-grano',
      '#menu-consumo': 'menu-consumo',
      '#seccion-instagram': 'seccion-instagram',
      '#seccion-insumos': 'seccion-insumos',
      '#seccion-preparaciones': 'seccion-preparaciones', // 3. AÑADE el ID para el scroll
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

        {/* 2. AÑADE la nueva sección de preparaciones aquí */}
        <section id="seccion-preparaciones">
          <Preparaciones />
        </section>

        <section id="seccion-insumos">
          <Insumos />
        </section>

        <section id="seccion-cafes-grano">
          <GranoGeneral />
        </section>

        <section id="seccion-instagram">
          <h2 className="insta-title" id="instagram-feed">
            Lo último en nuestro instagram ☕
          </h2>
          {error && (
            <p className="error-ig">Error al cargar Instagram: {error}</p>
          )}

          <InstagramFeedLite
            media={media}
            loading={loading}
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