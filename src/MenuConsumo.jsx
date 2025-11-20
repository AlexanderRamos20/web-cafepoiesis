import React from 'react';

function MenuConsumo() {
    const nombreDelArchivoPDF = "carta-2022-verano-1.pdf"; 

    return (
        <div className="menu-container text-center py-5">
            <h2 className="app-title mb-4" style={{ color: '#4e342e' }}>¿Necesitas ver todos los precios?</h2>
            
            <div 
                className="card shadow-lg mx-auto p-4 d-flex flex-column align-items-center" 
                style={{ maxWidth: '400px', backgroundColor: '#fff8f2', border: '2px solid #a1887f' }}
            >
                <span style={{ fontSize: '3rem', color: '#a1887f', marginBottom: '1rem' }}>📄</span>
                
                <h3 className="fs-5 mb-3 fw-bold" style={{ color: '#241616' }}>
                    Descarga nuestra Carta Completa
                </h3>
                
                <p className="text-muted small mb-3">
                    Incluye todas nuestras preparaciones, insumos, y lista de precios detallada. (Formato PDF)
                </p>

                <a 
                    href={`/${nombreDelArchivoPDF}`} 
                    download
                    className="btn btn-primary btn-lg" 
                    style={{
                        backgroundColor: '#4e342e',
                        borderColor: '#4e342e',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#241616'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#4e342e'}
                >
                    Descargar PDF
                </a>
            </div>
        </div>
    );
}

export default MenuConsumo;