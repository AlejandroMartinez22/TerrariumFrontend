import { useState, useEffect } from "react";
import { getPuntosReferenciaByConglomerado } from "../api"; // Función que obtiene los puntos de referencia desde el backend

// Hook personalizado para gestionar los puntos de referencia
export function usePuntosReferencia(brigadista) {
  const [puntosReferencia, setPuntosReferencia] = useState([]); // Almacena los puntos obtenidos
  const [isLoading, setIsLoading] = useState(true); // Indica si la solicitud está en curso
  const [error, setError] = useState(null); // Captura errores

  // Procesa los puntos para asegurar que las coordenadas sean números válidos
  const processPuntos = (rawPuntos) => {
    return rawPuntos
      .map((punto) => ({
        id: punto.id,
        title: punto.titulo || "Punto de referencia",
        description: punto.descripcion || "",
        errorMedicion: punto.error || "", // Asignación del error de medición
        tipo: punto.tipo || "referencia",
        latitude: typeof punto.latitud === "string" ? parseFloat(punto.latitud) : punto.latitud,
        longitude: typeof punto.longitud === "string" ? parseFloat(punto.longitud) : punto.longitud,
        trayecto: punto.trayectos,
        index: punto.orden || 0,
      }))
      .filter((punto) => !isNaN(punto.latitude) && !isNaN(punto.longitude)); // Filtra puntos con coordenadas inválidas
  };

  // Obtiene los puntos de referencia según el brigadista
  const fetchPuntosReferencia = async () => {
    if (!brigadista?.idConglomerado) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getPuntosReferenciaByConglomerado(brigadista.idConglomerado);
      setPuntosReferencia(processPuntos(data)); // Procesa y almacena los datos
    } catch (err) {
      console.error("Error al cargar puntos de referencia:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Ejecuta la función cuando cambia el brigadista
  useEffect(() => {
    fetchPuntosReferencia();
  }, [brigadista]);

  return { puntosReferencia, setPuntosReferencia, fetchPuntosReferencia, isLoading, error };
}