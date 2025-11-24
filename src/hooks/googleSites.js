import { useEffect } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Acepta un objeto de opciones con la bandera 'force'
export function useCallHorariosCache(options = { force: false }) {
  const { force } = options; 

  useEffect(() => {
    async function callHorariosFn() {
      // 1. CONSTRUIR LA URL
      // Si force es true, añade "?force=true" a la URL
      const queryString = force ? '?force=true' : '';
      const url = `${SUPABASE_URL}/functions/v1/caching-horario-googleSites${queryString}`;
      
      try {
        const response = await fetch(url, {
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 
          },
        });

        if (force) {
            // Manejo de respuesta para la actualización forzada (opcional)
            const data = await response.json();
            console.log(`Actualización forzada completada. Estado de caché: ${data.source}`);
            // Aquí puedes añadir lógica para notificar al usuario admin
        }
        
      } catch (err) {
        console.error("Error llamando función de caché de horarios:", err);
      }
    }

    callHorariosFn();
    
  }, [force]); // Incluir 'force' en las dependencias es crucial para la reutilización

}