import { useState } from "react";
import { insertarTrayecto } from "../supabase/saveTrayecto";
import { actualizarTrayecto } from "../supabase/updateTrayecto";
import { obtenerTrayectoPorId } from "../supabase/getTrayectoPorId";
import { obtenerReferenciaPorIdDesdeBackend } from "../api";
import { useBrigadista } from "../context/BrigadistaContext";

export function useTrayectos() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { brigadista } = useBrigadista();
  const cedula = brigadista?.cedula;

  const guardarTrayecto = async (datosTrayecto, puntoId, cedulaBrigadista = cedula) => {
    setIsLoading(true);
    setError(null);
    try {
      // Usar la cédula pasada como parámetro o caer en la del contexto
      const cedulaAUsar = cedulaBrigadista || cedula;
      
      // Verificar que el punto de referencia pertenezca al brigadista
      const puntoReferencia = await obtenerReferenciaPorIdDesdeBackend(puntoId);

      if (!puntoReferencia) {
        throw new Error("El punto de referencia no existe");
      }

      if (puntoReferencia.cedula_brigadista !== cedulaAUsar) {
        throw new Error(
          "No tienes permisos para añadir trayectos a este punto de referencia"
        );
      }

      // Guardar con la cedula del brigadista
      const datosCompletos = {
        ...datosTrayecto,
        cedula_brigadista: cedulaAUsar,
      };

      const result = await insertarTrayecto(datosCompletos, puntoId);
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
      
      // Validar punto de referencia como primer paso
      const puntoReferencia = await obtenerReferenciaPorIdDesdeBackend(puntoId);

      if (!puntoReferencia) {
        throw new Error("El punto de referencia no existe");
      }

      console.log(
        "cedula en base de datos:",
        puntoReferencia.cedula_brigadista
      );
      console.log("cedula del usuario:", cedulaAUsar);
      
      if (
        String(puntoReferencia.cedula_brigadista) !== String(cedulaAUsar)
      ) {
        throw new Error(
          "No tienes permisos para modificar este punto de referencia"
        );
      }

      // Validar trayecto
      const trayectoExistente = await obtenerTrayectoPorId(
        datosTrayecto.idTrayecto
      );
      if (!trayectoExistente) {
        throw new Error("El trayecto no existe");
      }

      const datosCompletos = {
        ...datosTrayecto,
        cedula_brigadista: cedulaAUsar,
      };

      const result = await actualizarTrayecto(datosCompletos, puntoId);
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