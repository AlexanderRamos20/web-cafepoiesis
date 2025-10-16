import React from 'react';

function MenuConsumo() {
  const nombreDelArchivoPDF = "carta-2022-verano-1.pdf"; 

  return (
    // --- CAMBIO 1: Aumentamos el padding superior de 40px a 70px ---
    <div className="menu-container" style={{ textAlign: 'center', padding: '70px 20px' }}>
      <a 
        href={`/${nombreDelArchivoPDF}`} 
        download
        className="enlace-descarga" 
        style={{
          // --- CAMBIO 2: Aumentamos el tamaño de la fuente de 1.2em a 1.4em ---
          fontSize: '1.4em', 
          color: '#4a2c2a',   
          textDecoration: 'underline',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Haz click aqui para descargar la carta completa
      </a>
    </div>
  );
}

export default MenuConsumo;