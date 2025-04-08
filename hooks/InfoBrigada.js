import { useEffect, useState } from "react";
import { getInfoBrigada } from "../supabase/getInfoBrigadista";

export const  InfoBrigada = (  ) => {
  const [brigadaInfo, setBrigadaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrigadaInfo = async () => {
      try {
        setLoading(true);
        const info = await getInfoBrigada();
        setBrigadaInfo(info);
      } catch (err) {
        console.error("Error al obtener información de brigada:", err);
        setError("No se pudo cargar la información");
      } finally {
        setLoading(false);
      }
    };

    fetchBrigadaInfo();
  }, []);

  return {
    brigadaInfo,
    loading,
    error,
  };
  
};
