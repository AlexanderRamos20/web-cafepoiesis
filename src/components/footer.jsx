import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { supabase } from '../supabaseClient';

const Footer = () => {
  const [horario, setHorario] = useState(null);

  useEffect(() => {
    const fetchHorario = async () => {
      try {
        const { data, error } = await supabase
          .from('horario')
          .select('*')
          .limit(1)
          .single();

        if (!error && data) {
          setHorario(data);
        }
      } catch (error) {
        console.error('Error fetching horario:', error);
      }
    };

    fetchHorario();
  }, []);

  return (
    <footer className="bg-coffee-accent text-light py-4 pb-5 mt-auto shadow-sm">
      <Container className="text-center">
        <div className="mb-2">
          <span className="fw-bold text-coffee-primary fs-4">
            Café Poiesis
          </span>
          {horario && (
            <div className="text-coffee-dark mt-1" style={{ fontSize: '0.9rem' }}>
              🕒 {horario.dia_semana}: {horario.hora_apertura?.slice(0, 5)} - {horario.hora_cierre?.slice(0, 5)}
            </div>
          )}
        </div>

        <div className="text-coffee-dark fs-6">
          © 2025 Café Poiesis — Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;