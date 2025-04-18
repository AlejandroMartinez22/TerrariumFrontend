import { useState, useEffect } from "react";
import { getPuntosReferencia } from "../supabase/getPuntosReferencia";

export function usePuntosReferencia(brigadista) {
  const [puntosReferencia, setPuntosReferencia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Procesar los puntos para asegurar que las coordenadas sean números
  const processPuntos = (rawPuntos) => {
    return rawPuntos
      .map((punto) => {
        // Asegurar que las coordenadas sean números
        const latitude =
          typeof punto.latitud === "string"
            ? parseFloat(punto.latitud)
            : punto.latitud;
        const longitude =
          typeof punto.longitud === "string"
            ? parseFloat(punto.longitud)
            : punto.longitud;

        return {
          id: punto.id,
          title: punto.titulo || `Punto de referencia`,
          description: punto.descripcion || "",
          errorMedicion: punto.error || "", // Aquí asignamos error a errorMedicion
          tipo: punto.tipo || "referencia",
          latitude: latitude,
          longitude: longitude,
          trayecto: punto.trayectos,
          index: punto.orden || 0,
        };
      })
      .filter((punto) => !isNaN(punto.latitude) && !isNaN(punto.longitude));
  };

  const fetchPuntosReferencia = async () => {
    if (!brigadista || !brigadista.cedula) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getPuntosReferencia(brigadista.cedula);
      // Procesar los datos para asegurar que las coordenadas son números
      setPuntosReferencia(processPuntos(data));
    } catch (err) {
      console.error("Error al cargar puntos de referencia:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPuntosReferencia();
  }, [brigadista]);

  return {
    puntosReferencia,
    setPuntosReferencia,
    fetchPuntosReferencia,
    isLoading,
    error,
  };
}
