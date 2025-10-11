import { useEffect, useMemo, useState } from "react";
import "./InstagramFeedLite.css"

/** carga el scrip de insta una sola ves */
function useInstagramScript(){
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (window.instgrm?.Embeds) {setReady(true); return;}
        const s = document.createElement("script");
        s.async = true;
        s.src = "https://www.instagram.com/embed.js";
        s.onload = () => setReady(true);
        document.body.appendChild(s);
    },[]);
    return ready;
}

/** crea un marco temporal mientras cargan los post */
function SkeletonCard(){
    return(
        <div className="ig-card ig-skeleton" aria-hidden="true">
            <div className="ig-skel-media"></div>
            <div className="ig-skel-text"></div>
        </div>
    );
}

/** carga el contenido traido de insta con el ambed.js */
export default function InstagramFeedLite({
    urls = [],
    limit = 6,
    columns = {base:2,md:3,lg:4},
    className = "",
}){
    const ready = useInstagramScript();
    const [hydrated, setHydrated] = useState(false);
    const list = useMemo(() => urls.slice(0,limit), [urls, limit]);

    //pide al script que procese los post cuando esten listos
    useEffect (() => {
        if (ready && window.instgrm?.Embeds?.process){
            window.instgrm.Embeds.process();
            //le da un tiempo que aparezcan los iframes
            const t = setTimeout(() => setHydrated(true), 800);
            return() => clearTimeout(t);
        }
    },[ready, list]);
    const gridStyle = {
        "--ig-cols-base": columns.base ?? 2,
        "--ig-cols-md": columns.md ?? columns.base ?? 2,
        "--ig-cols-lg": columns.lg ?? columns.md ?? columns.base ?? 2,
    };
    return(
        <section className={`ig-wrap ${className}`} style={gridStyle} aria-label="Instagram">
            {!hydrated && Array.from({ length: Math.min(limit, 6)}).map((_, i) => <SkeletonCard key={i}></SkeletonCard>)}
            {list.map((u) => (
                <div className="ig-card" key={u}>
                    {/** aqui el script cambia de el blockquote por el embed*/}
                    <blockquote 
                    className="instagram-media"
                    data-instgrm-permalink={u}
                    data-instgrm-captioned="false"
                    data-instgrm-version="14"
                    style={{background: "transparent"}}>
                        <a href={u} target="_blank" rel="noreferrer">Ver en Instagram</a>
                    </blockquote>
                </div>
            ))}
        </section>
    );
}