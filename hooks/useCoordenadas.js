import { useState, useEffect } from 'react';
import { getCoordenadas } from '../supabase/getCoordenadas';

export function useCoordenadas(brigadista) {
  const [coordenadas, setCoordenadas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoordenadas = async () => {
    if (!brigadista?.idConglomerado) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCoordenadas(brigadista);
      setCoordenadas(data);
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error("Error al cargar coordenadas:", err);
      return [];
    }
  };

  useEffect(() => {
    fetchCoordenadas();
  }, [brigadista?.idConglomerado]);

  return {
    coordenadas,
    fetchCoordenadas,
    isLoading,
    error
  };
}