import { getUltimoIdMuestraDeBack } from "../api";
import { guardarMuestraEnBackend } from "../api";

// Hook para obtener el siguiente ID de muestra
// Este hook se encarga de obtener el siguiente ID de muestra desde el backend
export const siguienteIdMuestra = async () => {
  try {
    const id = await getUltimoIdMuestraDeBack();
    return id;
  } catch (error) {
    console.error("Error al obtener el siguiente ID de muestra:", error);
    return null;
  }
};

// Hook para guardar una muestra
// Este hook se encarga de guardar una muestra en el backend
export const guardarMuestra = async (muestraData) => {
    try{
        const id = await guardarMuestraEnBackend(muestraData);
        return id;
    } catch (error) {
        console.error("Error al guardar la muestra:", error);
        return null;
    }
};
