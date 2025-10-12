import InstagramFeedLite from './components/InstagramFeedLite.jsx';
import Header from './components/header.jsx';
import BurbujaContacto from './components/BurbujaContaco.jsx';

const urls = [
    "https://www.instagram.com/p/DFao3gnxQhB/",
    "https://www.instagram.com/p/CiEEbxEs5uB/",
    "https://www.instagram.com/p/DPP9mxkjdyW/",
]
function App() {
    return(
        <>
            <Header/>
            <main className='app-main'>
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
