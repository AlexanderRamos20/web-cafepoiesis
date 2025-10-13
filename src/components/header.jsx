import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky-top shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-dark bg-coffee-accent">
        <div className="container">
          <Link className="navbar-brand fs-3 fw-bold text-coffee-primary" to="/">
            <img
              src="/logo-cafepoiesis.jpg"
              alt="Logo Café Poiesis"
              width="30"
              height="auto"
              className="me-2 rounded-circle"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/30x30/4e342e/ffffff?text=CP';
              }}
            />
            Café Poiesis
          </Link>

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

              <button
                className="nav-link text-coffee-dark mx-3 btn btn-link"
                onClick={() => scrollToSection('menu-consumo')}
              >
                Menú
              </button>

              <button
                className="nav-link text-coffee-dark mx-3 btn btn-link"
                onClick={() => scrollToSection('seccion-insumos')}
              >
                Insumos
              </button>

              <Link className="nav-link text-coffee-dark mx-3" to="/#seccion-cafes-grano">
                Cafés
              </Link>

              <button
                className="nav-link text-coffee-dark mx-3 btn btn-link"
                onClick={() => scrollToSection('seccion-instagram')}
              >
                Instagram
              </button>
            </div>

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
};

export default Header;
