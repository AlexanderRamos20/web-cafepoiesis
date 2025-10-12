
function Mapa() {
    return (
        <section className="container">
            <div className="row d-flex align-items-center"> 
                <div className="col-md-6">
                    <h2 className='app-title text-center'> Cómo llegar 🗺️ </h2>
                    <iframe 
                        width="600" 
                        height="300" 
                        style={{ border: 0 }} 
                        loading="lazy" 
                        allowFullScreen 
                        referrerPolicy="no-referrer-when-downgrade" /* Buena práctica de seguridad */
                    
                        src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJD4GwnDzvFZYRDnGvzZUIOxE&key=AIzaSyAgQ8_hudJnNtRjzvwxKFQeWnmzcWpCHrw">
                    </iframe>
                </div>

                <div className="col-md-6 text-center p-4 border rounded shadow-sm h-100 d-flex flex-column justify-content-center">
                    <h3 className='mb-4 fw-bold'> Horario de atención </h3>
                    <div className="text-start mx-auto w-auto"> {/* Contenedor para alinear el texto a la izquierda sin afectar al h3 */}
                        <p className="fs-5 mb-2"><i className="bi bi-calendar-check me-2 text-success"></i>Lunes a Viernes: <span className="fw-bold">10:00 - 19:00</span></p>
                        <p className="fs-5 mb-2"><i className="bi bi-calendar-check me-2 text-success"></i>Sábados: <span className="fw-bold">15:00 - 19:00</span></p>
                        <p className="fs-5 mb-0 text-danger"><i className="bi bi-calendar-x me-2"></i>Domingos: <span className="fw-bold">Cerrado</span></p>
                    </div>
</div>

/* Nota: Cambié col-md-6 a col-md-4 para que coincida con tu estructura original de 8 + 4 = 12 */
            </div>
        </section>
    );
}

export default Mapa;