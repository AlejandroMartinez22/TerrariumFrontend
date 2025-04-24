import { useState } from "react";
import { 
  guardarTrayectoEnBackend, 
  actualizarTrayectoEnBackend,
  obtenerReferenciaPorIdDesdeBackend 
} from "../api";
import { useBrigadista } from "../context/BrigadistaContext";

export function useTrayectos() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { brigadista } = useBrigadista();
  const cedula = brigadista?.cedula;

  const guardarTrayecto = async (datosTrayecto, puntoId, cedulaBrigadista) => {
    setIsLoading(true);
    setError(null);
    try {
      // Use cedulaBrigadista from parameters or from datosTrayecto
      const cedulaAUsar = cedulaBrigadista || datosTrayecto.cedula_brigadista;
      
      // Get reference point
      const puntoReferencia = await obtenerReferenciaPorIdDesdeBackend(puntoId);
      
      if (!puntoReferencia) {
        throw new Error("El punto de referencia no existe");
      }
      
      if (puntoReferencia.cedula_brigadista !== cedulaAUsar) {
        throw new Error(
          "No tienes permisos para añadir trayectos a este punto de referencia"
        );
      }
      
      // Send data to backend
      const result = await guardarTrayectoEnBackend(datosTrayecto, puntoId, cedulaAUsar);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error("Error al guardar trayecto:", err);
      return { success: false, error: err.message };
    }
  };

  const actualizarDatosTrayecto = async (
    datosTrayecto,
    puntoId,
    cedulaBrigadista = cedula
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      // Usar la cédula pasada como parámetro o caer en la del contexto
      const cedulaAUsar = cedulaBrigadista || cedula;
      
      // Toda la validación del punto de referencia y el trayecto ahora se hace en el backend
      const datosCompletos = {
        ...datosTrayecto,
        cedula_brigadista: cedulaAUsar,
      };

      const result = await actualizarTrayectoEnBackend(datosCompletos, puntoId);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      console.error("Error al actualizar trayecto:", err);
      return { success: false, error: err.message };
    }
  };

  return {
    guardarTrayecto,
    actualizarDatosTrayecto,
    isLoading,
    error,
  };
}