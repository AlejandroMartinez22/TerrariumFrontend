// Archivo finalizado, toda la lógica del backend está en el proyecto del backend

import { useState } from "react";
import { 
  fetchSiguienteIdReferencia, 
  guardarReferenciaEnBackend, 
  actualizarReferenciaEnBackend,
  eliminarReferenciaEnBackend,
  obtenerReferenciaPorIdDesdeBackend
} from "../api";

// Hook para gestionar referencias en la aplicación
export function useReferencias() {
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores

  // Obtiene el siguiente ID disponible para una referencia
  const getSiguienteId = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const id = await fetchSiguienteIdReferencia();
      return id;
    } catch (err) {
      setError(err);
      console.error("Error al obtener siguiente ID:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Guarda una nueva referencia en el backend
  const guardarReferencia = async (puntoReferencia, cedulaBrigadista) => {
    setIsLoading(true);
    setError(null);
    try {
      const id = await guardarReferenciaEnBackend(puntoReferencia, cedulaBrigadista);
      return id;
    } catch (err) {
      setError(err);
      console.error("Error al guardar referencia:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Actualiza una referencia existente en el backend
  const actualizarPuntoReferencia = async (puntoReferencia, cedulaBrigadista) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await actualizarReferenciaEnBackend(puntoReferencia, cedulaBrigadista);
      return result;
    } catch (err) {
      setError(err);
      console.error("Error al actualizar referencia:", err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Elimina una referencia del backend
  const borrarReferencia = async (referenciaId, cedulaBrigadista) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await eliminarReferenciaEnBackend(referenciaId, cedulaBrigadista);
      return result;
    } catch (err) {
      setError(err);
      console.error("Error al eliminar referencia:", err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Obtiene una referencia por su ID
  const obtenerReferencia = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await obtenerReferenciaPorIdDesdeBackend(id);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error al obtener referencia:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getSiguienteId,
    guardarReferencia,
    actualizarPuntoReferencia,
    borrarReferencia,
    obtenerReferencia, 
    isLoading,
    error
  };
}