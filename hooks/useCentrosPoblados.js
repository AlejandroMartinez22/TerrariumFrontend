// src/hooks/useCentrosPoblados.js
import { useState, useEffect } from "react";
import { fetchCoordenadasCentroPoblado } from "../api";

export function useCentrosPoblados(brigadista) {
  const [centrosPoblados, setCentrosPoblados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCentrosPoblados = async () => {
    setIsLoading(true);
    setError(null);

    if (!brigadista || !brigadista.idConglomerado) {
      console.log("No hay brigadista o ID de conglomerado disponible");
      setCentrosPoblados([]);
      setIsLoading(false);
      return [];
    }

    try {
      console.log(
        "Solicitando centros poblados para conglomerado:",
        brigadista.idConglomerado
      );
      const data = await fetchCoordenadasCentroPoblado(
        brigadista.idConglomerado
      );

      // Verificar si data es null o undefined y proporcionar un array vacío en ese caso
      const centrosData = data || [];
      console.log(`Recibidos ${centrosData.length} centros poblados`);

      setCentrosPoblados(centrosData);
      return centrosData;
    } catch (err) {
      console.error("Error al cargar centros poblados:", err);
      setError(err);
      // Establecer un array vacío para evitar errores al intentar mapear
      setCentrosPoblados([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCentrosPoblados();
  }, [brigadista]);

  return {
    centrosPoblados,
    fetchCentrosPoblados,
    isLoading,
    error,
  };
}
