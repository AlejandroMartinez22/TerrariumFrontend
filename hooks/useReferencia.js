import { useState } from "react";
import { obtenerSiguienteId } from "../supabase/getUltimoIdReferencia";
import { insertarReferencia } from "../supabase/saveReferencia";
import { actualizarReferencia } from "../supabase/updateReferencia";
import { eliminarReferencia } from "../supabase/deleteReferencia";

export function useReferencias() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSiguienteId = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const id = await obtenerSiguienteId();
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
      // Pass the object with cedula_brigadista instead of id_brigadista
      const savedPuntoData = {
        ...puntoReferencia,
        cedula_brigadista: cedulaBrigadista
      };
      
      const id = await insertarReferencia(savedPuntoData, cedulaBrigadista);
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
      // Update with cedula_brigadista instead of id_brigadista
      const updatedPuntoData = {
        ...puntoReferencia,
        cedula_brigadista: cedulaBrigadista
      };
      
      const result = await actualizarReferencia(updatedPuntoData, cedulaBrigadista);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error("Error al actualizar referencia:", err);
      return { success: false, error: err };
    }
  };

  const borrarReferencia = async (referenciaId) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await eliminarReferencia(referenciaId);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error("Error al eliminar referencia:", err);
      return { success: false, error: err };
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