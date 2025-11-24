import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { Clock, CalendarCheck, CalendarX } from 'lucide-react'; 

// 🎨 CONSTANTES DE ESTILO
const COLOR_DARK = '#4e342e'; 
const COLOR_ACCENT = '#a1887f'; 
const COLOR_CLOSED = '#b03a2e'; 
const CARD_RADIUS = '15px'; 
const DIAS_SEMANA_ORDEN = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

// Función auxiliar para el header decorativo (Mismo estilo que MenuConsumo)
const DecorativeCardHeader = ({ title, icon: IconComponent }) => (
    <div 
        className="py-3"
        style={{ 
            backgroundColor: COLOR_DARK, 
            color: '#fff',
            borderBottom: `4px solid ${COLOR_ACCENT}`,
            borderTopLeftRadius: CARD_RADIUS,
            borderTopRightRadius: CARD_RADIUS
        }}
    >
        <h3 className='m-0' style={{ 
            fontFamily: 'serif', 
            letterSpacing: '2px', 
            fontSize: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
        }}>
            {IconComponent && <IconComponent size={20} className="me-2" style={{ color: 'white' }}/>} 
            {title}
        </h3>
    </div>
);


function Mapa() {
    const [horarios, setHorarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY;
    // NOTA: La URL debe ser revisada para el embedding correcto
    const googleMapsSrc = `https://www.google.com/maps/embed/v1/place?q=place_id:ChIJD4GwnDzvFZYRDnGvzZUIOxE&key=${MAPS_API_KEY}`; 

    // 1. CARGA DE DATOS AL MONTAR
    useEffect(() => {
        async function fetchHorarios() {
            setLoading(true);
            const { data, error } = await supabase
                .from('horario')
                .select('dia_semana, hora_apertura, hora_cierre')
                .order('dia_semana', { ascending: true }); 

            if (error) {
                console.error("Error cargando horarios:", error);
                setHorarios([]);
            } else {
                const horariosMap = data.reduce((map, item) => {
                    map[item.dia_semana] = item;
                    return map;
                }, {});
                setHorarios(horariosMap);
            }
            setLoading(false);
        }
        fetchHorarios();
    }, []);

    // 2. LÓGICA DE RENDERIZADO DE FILA
    const renderHorarioFila = (dia) => {
        const horario = horarios[dia];
        
        if (!horario) {
            return (
                <div key={dia} className="d-flex justify-content-between border-bottom py-1" style={{ color: COLOR_CLOSED }}>
                    <span className="fw-bold">{dia}</span> 
                    <span className="fw-bold d-flex align-items-center">
                        <CalendarX size={16} className="me-2"/> Cerrado
                    </span>
                </div>
            );
        }

        // Caso Abierto
        const apertura = horario.hora_apertura.substring(0, 5); 
        const cierre = horario.hora_cierre.substring(0, 5);
        
        return (
            <div key={dia} className="d-flex justify-content-between border-bottom py-1" style={{ color: COLOR_DARK }}>
                <span className="fw-bold">{dia}</span> 
                <span className="fw-bold d-flex align-items-center">
                    <CalendarCheck size={16} className="me-2" style={{ color: COLOR_ACCENT }}/> {apertura} - {cierre}
                </span>
            </div>
        );
    };

    return (
        <section className="container py-5">
            <div className="row d-flex align-items-start"> 
                
                <div className="col-md-6 mb-4 mb-md-0">                    
                    <div className="card shadow-lg p-0 overflow-hidden border-0" 
                         style={{ borderRadius: CARD_RADIUS, borderColor: COLOR_ACCENT }}> 
                         
                        <DecorativeCardHeader title="UBICACIÓN" icon={null} />

                        <div className="card-body p-0">
                            <iframe 
                                width="100%" 
                                height="400" 
                                style={{ border: 0 }} 
                                loading="lazy" 
                                allowFullScreen 
                                referrerPolicy="no-referrer-when-downgrade" 
                                src={googleMapsSrc} >
                            </iframe>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow-lg h-100 border-0 overflow-hidden" 
                         style={{ borderRadius: CARD_RADIUS, backgroundColor: '#fff' }}> 
                        
                        <DecorativeCardHeader title="HORARIO DE ATENCIÓN" icon={Clock} />

                        <div className="card-body d-flex flex-column justify-content-center p-4">
                            
                            {loading && (
                                <div className="text-center my-4">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <p>Cargando horarios...</p>
                                </div>
                            )}

                            {!loading && (
                                <div className="text-start mx-auto w-100 p-3" style={{ maxWidth: '350px' }}> 
                                    {DIAS_SEMANA_ORDEN.map(renderHorarioFila)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Mapa;