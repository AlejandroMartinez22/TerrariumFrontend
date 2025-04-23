    /*PARTE DEL INICIO DE SESIÓN, */
    /*CORRECTO, REVISADO EL 22/04 16:46 PM*/
    /*DOCUMENTADO*/
    /*ESTE ARCHIVO SI DEBE MANTENERSE EN EL FRONTEND*/

// Importamos la función que realiza la llamada al backend para obtener el nombre del usuario por UID
import { getUserNameFromBackend } from '.';

/** Esta función actúa como un (envoltorio) para la función `getUserNameFromBackend`, */

export const getUserNameByUID = async (id) => {
  try {
    // Solicitamos el nombre al backend usando el UID
    const nombre = await getUserNameFromBackend(id);
    return nombre;
  } catch (err) {
    // Si ocurre un error inesperado, lo registramos en consola y devolvemos null
    console.error('Error inesperado en getUserNameByUID:', err);
    return null;
  }
};