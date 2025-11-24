import { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import LoginModal from './LoginModal';

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    const headerOffset = 80;
    if (section) {
      const elementPosition = section.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="sticky-top shadow-sm">
      <Navbar expand="lg" bg="dark" variant="dark" className="bg-coffee-accent">
        <Container fluid className="position-relative">

          {/* Marca (Logo) */}
          <Navbar.Brand
            onClick={() => scrollToSection('home')}
            className="fs-3 fw-bold text-coffee-primary d-flex align-items-center"
            style={{ cursor: 'pointer', paddingLeft: '1rem' }}
          >
            <img
              src="/logo-cafepoiesis.jpg"
              alt="Logo Café Poiesis"
              width="30"
              height="30"
              className="me-2 rounded-circle"
              onError={(e) => {
                e.target.src = 'https://placehold.co/30x30/4e342e/ffffff?text=CP';
              }}
            />
            <span style={{ color: '#f5f5f5', fontWeight: 'bold' }}>CaféPoiesis</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
            <Nav className="fs-5 align-items-center">
              <Nav.Link onClick={() => scrollToSection('menu-consumo')} className="text-coffee-dark mx-3">
                Menú
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection('seccion-preparaciones')} className="text-coffee-dark mx-3">
                Preparaciones
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection('seccion-insumos')} className="text-coffee-dark mx-3">
                Insumos
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection('seccion-cafes-grano')} className="text-coffee-dark mx-3">
                Cafés
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection('mapa')} className="text-coffee-dark mx-3">
                Cómo llegar
              </Nav.Link>
              <Nav.Link onClick={() => scrollToSection('seccion-instagram')} className="text-coffee-dark mx-3">
                Instagram
              </Nav.Link>
              <Nav.Link
                onClick={() => setShowLoginModal(true)}
                className="text-coffee-dark mx-3"
                style={{
                  fontWeight: '600',
                  color: '#A1887F !important'
                }}
              >
                Admin
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>

          <div className="d-none d-lg-block" style={{ width: '170px' }}></div>

        </Container>
      </Navbar>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </header>
  );
};

export default Header;