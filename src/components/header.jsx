import { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom'; 
import LoginModal from './LoginModal';

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [expanded, setExpanded] = useState(false); 

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (sectionId) => {
    setExpanded(false); 

    if (location.pathname === '/') {
      const section = document.getElementById(sectionId);
      const headerOffset = 80;
      
      if (section) {
        const elementPosition = section.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  // ESTILO GENERAL DEL MENÚ (Más elegante)
  const linkStyle = {
    cursor: 'pointer',
    fontFamily: "'Lato', sans-serif", // Fuente limpia
    fontWeight: '700', 
    letterSpacing: '2px', // Espaciado premium
    textTransform: 'uppercase', 
    fontSize: '0.8rem', // Tamaño delicado
    transition: 'all 0.3s ease',
    padding: '8px 0', // Área de clic
    margin: '0 15px'  // Separación entre ítems
  };

  // ESTILO ESPECÍFICO PARA ADMIN (Sin opacidad, con borde elegante)
  const adminStyle = {
    ...linkStyle,
    border: '1px solid rgba(255, 255, 255, 0.4)', // Borde sutil semitransparente
    borderRadius: '50px', // Redondeado
    padding: '8px 20px', // Más relleno a los lados
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Fondo apenas visible
  };

  return (
    <header className="sticky-top shadow-sm">
      <Navbar 
        expand="lg" 
        bg="dark" 
        variant="dark" 
        className="bg-coffee-accent"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        style={{ padding: '12px 0', backgroundColor: '#4e342e' }}
      >
        <Container fluid className="position-relative">

          {/* LOGO Y MARCA */}
          <Navbar.Brand
            onClick={() => handleNavigation('root')}
            className="d-flex align-items-center"
            style={{ cursor: 'pointer', paddingLeft: '1rem', zIndex: 10001 }}
          >
            <img
              src="/logo-cafepoiesis.jpg"
              alt="Logo"
              width="45"
              height="45"
              className="me-2 rounded-circle border border-white shadow-sm"
              style={{ objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://placehold.co/35x35/4e342e/ffffff?text=CP'; }}
            />
            <span className="text-light" style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontWeight: '700', 
                fontSize: '1.5rem',
                letterSpacing: '1px'
            }}>
              Cafépoiesis
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ zIndex: 10001, border: 'none' }} />

          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
            <Nav className="align-items-center mt-3 mt-lg-0">
              
              <Nav.Link onClick={() => handleNavigation('seccion-preparaciones')} className="text-light" style={linkStyle}>
                Preparaciones
              </Nav.Link>

              <Nav.Link onClick={() => handleNavigation('seccion-insumos')} className="text-light" style={linkStyle}>
                Insumos
              </Nav.Link>

              <Nav.Link onClick={() => handleNavigation('seccion-cafes-grano')} className="text-light" style={linkStyle}>
                Cafés
              </Nav.Link>

              <Nav.Link onClick={() => handleNavigation('menu-consumo')} className="text-light" style={linkStyle}>
                Menú
              </Nav.Link>

              <Nav.Link onClick={() => handleNavigation('seccion-instagram')} className="text-light" style={linkStyle}>
                Instagram
              </Nav.Link>

              <Nav.Link onClick={() => handleNavigation('mapa')} className="text-light" style={linkStyle}>
                Ubicación
              </Nav.Link>

              {/* BOTÓN ADMIN DESTACADO PERO ELEGANTE */}
              <Nav.Link
                onClick={() => {
                    setExpanded(false);
                    setShowLoginModal(true);
                }}
                className="text-light mt-2 mt-lg-0"
                style={adminStyle}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#4e342e';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = 'white';
                }}
              >
                Admin
              </Nav.Link>

            </Nav>
          </Navbar.Collapse>

          {/* Espaciador invisible para equilibrar el logo en escritorio */}
          <div className="d-none d-lg-block" style={{ width: '180px' }}></div>

        </Container>
      </Navbar>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </header>
  );
};

export default Header;