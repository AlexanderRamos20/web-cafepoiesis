import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    // Agregué 'pb-4' (padding bottom 4) para dar más aire abajo
    <footer className="bg-coffee-accent text-light py-3 pb-5 mt-auto shadow-sm"> 
      <Container className="d-flex justify-content-between align-items-center">
        <span className="fw-bold text-coffee-primary">
          Café Poiesis
        </span>

        <small className="text-coffee-dark">
          © 2025 Café Poiesis — Todos los derechos reservados.
        </small>
      </Container>
    </footer>
  );
};

export default Footer;