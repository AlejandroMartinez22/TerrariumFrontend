import { useState } from "react";
import { 
  guardarTrayectoEnBackend, 
  actualizarTrayectoEnBackend,
  obtenerReferenciaPorIdDesdeBackend 
} from "../api";
import { useBrigadista } from "../context/BrigadistaContext";

// Hook para gestionar trayectos en la aplicación
export function useTrayectos() {
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores
  const { brigadista } = useBrigadista();
  const cedula = brigadista?.cedula; // Obtiene la cédula del brigadista

  // Guarda un nuevo trayecto en el backend
  const guardarTrayecto = async (datosTrayecto, puntoId, cedulaBrigadista) => {
    setIsLoading(true);
    setError(null);
    try {
      const cedulaAUsar = cedulaBrigadista || datosTrayecto.cedula_brigadista; // Define la cédula a usar
      
      // Obtiene el punto de referencia
      const puntoReferencia = await obtenerReferenciaPorIdDesdeBackend(puntoId);
      
      if (!puntoReferencia) throw new Error("El punto de referencia no existe");
      if (puntoReferencia.cedula_brigadista !== cedulaAUsar) 
        throw new Error("No tienes permisos para añadir trayectos a este punto de referencia");

      // Envía los datos al backend
      const result = await guardarTrayectoEnBackend(datosTrayecto, puntoId, cedulaAUsar);
      return result;
    } catch (err) {
      setError(err);
      console.error("Error al guardar trayecto:", err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Actualiza un trayecto existente en el backend
  const actualizarDatosTrayecto = async (datosTrayecto, puntoId, cedulaBrigadista = cedula) => {
    setIsLoading(true);
    setError(null);
    try {
      const cedulaAUsar = cedulaBrigadista || cedula; // Define la cédula a usar

      const datosCompletos = {
        ...datosTrayecto,
        cedula_brigadista: cedulaAUsar,
      };

      const result = await actualizarTrayectoEnBackend(datosCompletos, puntoId);
      return result;
    } catch (err) {
      setError(err);
      console.error("Error al actualizar trayecto:", err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { guardarTrayecto, actualizarDatosTrayecto, isLoading, error };
}