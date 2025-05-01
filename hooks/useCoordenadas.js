// Importamos React y los hooks necesarios
import { useState, useEffect } from "react";
import { fetchCoordenadas } from "../api"; // Función para obtener coordenadas del backend

// Hook personalizado para gestionar las coordenadas
export function useCoordenadas(brigadista) {
  const [coordenadas, setCoordenadas] = useState([]); // Almacena las coordenadas
  const [isLoading, setIsLoading] = useState(false); // Indica si la solicitud está en curso
  const [error, setError] = useState(null); // Captura errores

  // Función para obtener coordenadas si hay un brigadista válido
  const getCoordenadas = async () => {
    if (!brigadista?.idConglomerado) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCoordenadas();
      setCoordenadas(data || []); // Evita valores nulos
    } catch (err) {
      setError(err);
      console.error("Error al cargar coordenadas:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Ejecuta la función cuando cambia el brigadista
  useEffect(() => {
    if (brigadista?.idConglomerado) {
      getCoordenadas();
    }
  }, [brigadista?.idConglomerado]);

  return { coordenadas, fetchCoordenadas: getCoordenadas, isLoading, error };
}