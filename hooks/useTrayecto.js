import { useState } from 'react';
import { insertarTrayecto} from '../supabase/saveTrayecto';
import { actualizarTrayecto } from '../supabase/updateTrayecto';

export function useTrayectos() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const guardarTrayecto = async (datosTrayecto, puntoId) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await insertarTrayecto(datosTrayecto, puntoId);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error("Error al guardar trayecto:", err);
      return null;
    }
  };

  const actualizarDatosTrayecto = async (datosTrayecto, puntoId) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await actualizarTrayecto(datosTrayecto, puntoId);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error("Error al actualizar trayecto:", err);
      return { success: false, error: err };
    }
  };

  return {
    guardarTrayecto,
    actualizarDatosTrayecto,
    isLoading,
    error
  };
}