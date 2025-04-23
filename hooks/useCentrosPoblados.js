// useCentrosPoblados.js
import { useState, useEffect } from 'react';
import { fetchCoordenadasCentroPoblado } from '../api';

export function getCentrosPoblados(brigadista) {
  const [centrosPoblados, setCentrosPoblados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCentrosPobladosData = async () => {
    setIsLoading(true);
    setError(null);

    if (!brigadista.idConglomerado) return;

    try {
      const data = await fetchCoordenadasCentroPoblado();
      setCentrosPoblados(data || []);
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error('Error al cargar centros poblados:', err);
      return [];
    }
  };

  useEffect(() => {
    getCentrosPobladosData();
  }, []);

  return {
    centrosPoblados,
    fetchCentrosPoblados: getCentrosPobladosData,
    isLoading,
    error,
  };
}