import { useState } from 'react';
import Header from './components/Header.jsx';
import InstagramFeedLite from './components/InstagramFeedLite.jsx';
import MenuConsumo from './MenuConsumo.jsx';

const urls = [
  "https://www.instagram.com/p/DFao3gnxQhB/",
  "https://www.instagram.com/p/CiEEbxEs5uB/",
  "https://www.instagram.com/p/DPP9mxkjdyW/",
];

function App() {
  const [seccionActiva, setSeccionActiva] = useState('instagram');

  return (
    <>
      <Header onMenuClick={() => setSeccionActiva('menu')} onInstagramClick={() => setSeccionActiva('instagram')} />
      <main className='app-main'>
        {seccionActiva === 'instagram' && (
          <>
            <h2 className='app-title'>Lo último en nuestro instagram ☕</h2>
            <InstagramFeedLite urls={urls} limit={3} columns={{ base: 1, md: 3, lg: 3 }} />
          </>
        )}
        {seccionActiva === 'menu' && <MenuConsumo />}
      </main>
    </>
  );
}

export default App;
