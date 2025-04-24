
/*TRABAJANDO EN ESTE ARCHIVO 6:36 PM */

import { useState } from "react";
import { fetchSiguienteIdReferencia, guardarReferenciaEnBackend, actualizarReferenciaEnBackend } from "../api";
import { eliminarReferencia } from "../supabase/deleteReferencia";
import { obtenerReferenciaPorId } from "../supabase/getReferenciaPorId";

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
      // Primero verificamos que el punto pertenezca al brigadista
      const referenciaExistente = await obtenerReferenciaPorId(referenciaId);
      
      if (!referenciaExistente) {
        throw new Error("El punto de referencia no existe");
      }
      
      // Validar que el brigadista sea el propietario del punto
      if (referenciaExistente.cedula_brigadista !== cedulaBrigadista) {
        throw new Error("No tienes permisos para eliminar este punto de referencia");
      }
      
      const result = await eliminarReferencia(referenciaId);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error("Error al eliminar referencia:", err);
      return { success: false, error: err.message };
    }
  };

  return {
    getSiguienteId,
    guardarReferencia,
    actualizarPuntoReferencia,
    borrarReferencia,
    isLoading,
    error
  };
}