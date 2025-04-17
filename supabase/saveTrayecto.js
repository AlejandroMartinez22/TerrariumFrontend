import supabase from './supabaseClient';  // Asegúrate de importar tu instancia de Supabase
import { obtenerSiguienteIdTrayecto } from './getUltimoIdTrayecto';  // Importa la función para obtener el siguiente ID de trayecto

export const insertarTrayecto = async (trayecto, idReferencia) => {
  try {
    const siguienteId = await obtenerSiguienteIdTrayecto();
    
    if (!siguienteId) {
      throw new Error("No se pudo generar el siguiente ID para el trayecto");
    }

    // Change here: use camelCase to match what's coming from the component
    const { medioTransporte, duracion, distancia } = trayecto;

    // Validation with the camelCase variable
    if (!medioTransporte || medioTransporte.trim() === "") {
      throw new Error("El campo 'medio_transporte' no puede estar vacío");
    }

    console.log("Valor de medio_transporte: ", medioTransporte);

    const { error } = await supabase
      .from('trayecto')
      .insert([
        {
          id: siguienteId,
          // Map the camelCase to snake_case for the database
          medio_transporte: medioTransporte,
          duracion,
          distancia,
          id_punto_referencia: idReferencia,
        },
      ]);

    if (error) throw error;

    console.log("Trayecto insertado correctamente con ID:", siguienteId);
  } catch (error) {
    console.error("Error al insertar el trayecto:", error);
  }
};