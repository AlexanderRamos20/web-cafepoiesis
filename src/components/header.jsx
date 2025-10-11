import React from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


const Header = () => {
    return (
        <header className="sticky-top shadow-sm">
            <nav className="navbar navbar-expand-lg navbar-dark bg-coffee-accent">
                <div className="container"> 
                    <a className="navbar-brand fs-3 fw-bold text-coffee-primary" href="#home">
                        <img src="logo-cafepoiesis.jpg" alt="Logo Café Poiesis" width="30" height="auto" className="me-2 rounded-circle"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/30x30/4e342e/ffffff?text=CP' }}
                        /> 
                        Café Poiesis
                    </a>

                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#basic-navbar-nav" 
                        aria-controls="basic-navbar-nav" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="basic-navbar-nav">

                        <div className="navbar-nav me-auto fs-5"> 
                            <a className="nav-link text-coffee-dark mx-3" href="#home">Cómo llegar</a>
                            <a className="nav-link text-coffee-dark mx-3" href="#link">Menú</a>
                            <a className="nav-link text-coffee-dark mx-3" href="#link">Insumos</a>
                            <a className="nav-link text-coffee-dark mx-3" href="#link">Cafés</a>
                            <a className="nav-link text-coffee-dark mx-3" href="#link">Instagram</a>
                        </div>
                        
                        {/* Para desplegar formulario de contacto */}
                        <div className="navbar-nav ms-auto">
                            <button 
                                className="btn btn-sm btn-coffee-primary rounded-pill px-4" 
                                onClick={() => console.log('Abrir Contacto')}
                            >
                                Contacto
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;