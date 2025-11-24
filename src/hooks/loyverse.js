import { useEffect } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function useCallLoyverse() {
  useEffect(() => {
    async function callFn() {
      try {
        await fetch(
          `${SUPABASE_URL}/functions/v1/loyverse-products`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({}),
          }
        );
      } catch (err) {
        console.error("Error llamando función:", err);
      }
    }

    callFn();
  }, []);
}