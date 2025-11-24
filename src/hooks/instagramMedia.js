import { useEffect, useState } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function useInstagramMedia(limit = 3) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/instagram-media?limit=${limit}`,
          {
            headers: {
              "Content-Type": "application/json",
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || `HTTP ${res.status}`);
        }

        // 🔁 Normalizamos de snake_case → camelCase
        const normalized = (data.media || []).map((m) => ({
          id: m.id,
          caption: m.caption,
          permalink: m.permalink,
          mediaUrl: m.media_url,
          mediaType: m.media_type,
          thumbnailUrl: m.thumbnail_url,
          timestamp: m.timestamp,
        }));

        setMedia(normalized);
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