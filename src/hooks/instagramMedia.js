import { useEffect, useState } from "react";

const IG_USER_ID = import.meta.env.VITE_IG_USER_ID;
const IG_TOKEN   = import.meta.env.VITE_IG_ACCESS_TOKEN;

export function useInstagramMedia(limit = 6) {
  const [media, setMedia]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true);
        setError(null);

        if (!IG_USER_ID || !IG_TOKEN) {
          throw new Error(
            "Faltan VITE_IG_USER_ID o VITE_IG_ACCESS_TOKEN en el .env"
          );
        }

        const fields = [
          "id",
          "caption",
          "permalink",
          "media_url",
          "media_type",
          "thumbnail_url",
          "timestamp",
        ].join(",");
        
        const url =
          `https://graph.instagram.com/v24.0/${IG_USER_ID}/media` +
          `?fields=${fields}` +
          `&access_token=${IG_TOKEN}` +
          `&limit=${limit}`;

        const res  = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
          console.error("Respuesta de Instagram:", data);
          throw new Error(
            data.error?.message || "Error al llamar a Instagram Graph API"
          );
        }

        setMedia(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();
  }, [limit]);

  return { media, loading, error };
}