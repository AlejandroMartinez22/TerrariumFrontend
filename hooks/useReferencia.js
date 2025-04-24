
/*ARCHIVO FINALIZADO, TODO LO QUE USA DE BACK ESTÁ EN EL PROYECTO DEL BACKEND*/

import { useState } from "react";
import { 
  fetchSiguienteIdReferencia, 
  guardarReferenciaEnBackend, 
  actualizarReferenciaEnBackend,
  eliminarReferenciaEnBackend,
  obtenerReferenciaPorIdDesdeBackend
} from "../api";


export function useReferencias() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSiguienteId = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const id = await fetchSiguienteIdReferencia();
      setIsLoading(false);
      return id;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error("Error al obtener siguiente ID:", err);
      return null;
    }
  };


  const guardarReferencia = async (puntoReferencia, cedulaBrigadista) => {
  setIsLoading(true);
  setError(null);
  try {
    const savedPuntoData = {
      ...puntoReferencia
    };
    
    // Seguimos pasando la cédula
    const id = await guardarReferenciaEnBackend(savedPuntoData, cedulaBrigadista);
    setIsLoading(false);
    return id;
  } catch (err) {
    setError(err);
    setIsLoading(false);
    console.error("Error al guardar referencia:", err);
    return null;
  }
};

const actualizarPuntoReferencia = async (puntoReferencia, cedulaBrigadista) => {
  setIsLoading(true);
  setError(null);
  try {
    // La verificación de permisos se hace ahora en el backend
    const result = await actualizarReferenciaEnBackend(puntoReferencia, cedulaBrigadista);
    setIsLoading(false);
    return result;
  } catch (err) {
    setError(err);
    setIsLoading(false);
    console.error("Error al actualizar referencia:", err);
    return { success: false, error: err.message };
  }
};

  const borrarReferencia = async (referenciaId, cedulaBrigadista) => {
    setIsLoading(true);
    setError(null);
    try {
      // La verificación de permisos se hace ahora en el backend
      const result = await eliminarReferenciaEnBackend(referenciaId, cedulaBrigadista);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error("Error al eliminar referencia:", err);
      return { success: false, error: err.message };
    }
  };

  const obtenerReferencia = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await obtenerReferenciaPorIdDesdeBackend(id);
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error("Error al obtener referencia:", err);
      return null;
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
};