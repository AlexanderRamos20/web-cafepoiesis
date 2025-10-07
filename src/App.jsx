import React, { useEffect } from 'react'; 
import { useLocation } from 'react-router-dom'; 
import InstagramFeedLite from './components/InstagramFeedLite.jsx';
import Header from './components/header.jsx';
import BurbujaContacto from './components/BurbujaContaco.jsx';
import GranoGeneral from './components/PaginasCafe/GranoGeneral.jsx'; 
import Mapa from './components/map.jsx';

const urls = [
    "https://www.instagram.com/p/DFao3gnxQhB/",
    "https://www.instagram.com/p/CiEEbxEs5uB/",
    "https://www.instagram.com/p/DPP9mxkjdyW/",
]
function App() {
    const location = useLocation(); 

    useEffect(() => {
        if (location.hash === '#seccion-cafes-grano') {
            const section = document.getElementById('seccion-cafes-grano');
            const timer = setTimeout(() => {
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100); 

            return () => clearTimeout(timer); 
        }
    }, [location.hash]); 

    return(
        <>
            <Header/>
            <Mapa/>
            <main className='app-main'>
                
                <section id="seccion-cafes-grano">
                  <GranoGeneral /> 
                </section>
                
                <h2 className='app-title'>Lo ultimo en nuestro instagram ☕</h2>
                <InstagramFeedLite
                urls = {urls}
                limit = {3}
                columns = {{base:1, md:3, lg:3}}
                />
            </main>
            <BurbujaContacto/>
        </>
    );
}

export default App