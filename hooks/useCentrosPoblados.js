// useCentrosPoblados.js
import { useState, useEffect } from 'react';
import { getCentrosPoblados } from '../supabase/getCentroPoblado';

export function useCentrosPoblados(brigadista) {
  const [centrosPoblados, setCentrosPoblados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCentrosPoblados = async () => {
    if (!brigadista) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const centros = await getCentrosPoblados(brigadista);
      setCentrosPoblados(centros);
      setIsLoading(false);
      return centros;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error("Error al cargar centros poblados:", err);
      return [];
    }
  };

  useEffect(() => {
    fetchCentrosPoblados();
  }, [brigadista]);

  return {
    centrosPoblados,
    fetchCentrosPoblados,
    isLoading,
    error
  };
}