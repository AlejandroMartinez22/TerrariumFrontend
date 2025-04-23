// hooks/useCoordenadas.js
import { useState, useEffect } from "react";
import { fetchCoordenadas } from "../api"; // La función que acabamos de crear

export function useCoordenadas(brigadista) {
  const [coordenadas, setCoordenadas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCoordenadas = async () => {
    // Solo intentamos obtener coordenadas si tenemos un brigadista con ID de conglomerado
    if (!brigadista?.idConglomerado) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCoordenadas();
      // Si la función devuelve null o undefined, usamos un array vacío
      setCoordenadas(data || []);
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error("Error al cargar coordenadas:", err);
      return [];
    }
  };

  // Efecto para cargar coordenadas al inicializar o cuando cambia el conglomerado
  useEffect(() => {
    if (brigadista?.idConglomerado) {
      getCoordenadas();
    }
  }, [brigadista?.idConglomerado]);

  return {
    coordenadas,
    fetchCoordenadas: getCoordenadas,
    isLoading,
    error,
  };
}
