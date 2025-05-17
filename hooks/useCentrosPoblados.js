// Importación de hooks y función API para obtener coordenadas de centros poblados
import { useState, useEffect } from "react";
import { fetchCoordenadasCentroPoblado } from "../api";

/*
  Hook personalizado para obtener centros poblados relacionados con un brigadista.
  - Maneja estado de carga y errores.
  - Solicita datos al backend si el brigadista tiene un ID de conglomerado válido.
*/
export function useCentrosPoblados(brigadista) {
  const [centrosPoblados, setCentrosPoblados] = useState([]); // Estado de los centros poblados
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  /*
    Función asíncrona para obtener los centros poblados del backend.
    - Verifica si el brigadista tiene un ID de conglomerado antes de solicitar datos.
    - Maneja errores y devuelve un array vacío si la solicitud falla.
  */
  const fetchCentrosPoblados = async () => {
    setIsLoading(true);
    setError(null);

    if (!brigadista || !brigadista.idConglomerado) {
      setCentrosPoblados([]);
      setIsLoading(false);
      return [];
    }

    try {
      const data = await fetchCoordenadasCentroPoblado(brigadista.idConglomerado);

      // Verifica si los datos recibidos son válidos, si no, asigna un array vacío
      const centrosData = data || [];

      setCentrosPoblados(centrosData);
      return centrosData;
    } catch (err) {
      console.error("Error al cargar centros poblados:", err);
      setError(err);
      setCentrosPoblados([]); // Previene errores en la interfaz al trabajar con datos vacíos
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /*
    Hook `useEffect` que ejecuta `fetchCentrosPoblados` cada vez que `brigadista` cambia.
    - Permite la actualización automática de datos si el brigadista es modificado.
  */
  useEffect(() => {
    fetchCentrosPoblados();
  }, [brigadista]);

  // Retorno de valores y funciones para uso en otros componentes
  return {
    centrosPoblados, // Lista de centros poblados obtenidos
    fetchCentrosPoblados, // Función para volver a solicitar datos
    isLoading, // Estado de carga
    error, // Estado de error
  };
}