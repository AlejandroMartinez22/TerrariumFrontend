// Importamos la función que realiza la llamada al backend para obtener el nombre del usuario por UID
import { getUserNameFromBackend } from '.';

/* Esta función actúa como un (envoltorio) para la función `getUserNameFromBackend` */
export const getUserNameByUID = async (id) => {
  try {
    const nombre = await getUserNameFromBackend(id);
    return nombre;
  } catch (err) {
    console.error('Error inesperado en getUserNameByUID:', err);
    return null;
  }
};