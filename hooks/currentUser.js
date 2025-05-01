/* ESTE ARCHIVO DEBE MANTENERSE EN EL FRONT */

// importar funciones de Firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";

// importar la función getInfoBrigadistaFromBackend para obtener información del brigadista
export const getCurrentUserUid = () => {
  // Esta función devuelve una promesa que se resuelve con el UID del usuario actual
  return new Promise((resolve) => {
    // Obtener la instancia de autenticación de Firebase
    const auth = getAuth();
    // Suscribirse a los cambios de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Para que solo escuche una vez
      if (user) {
        resolve(user.uid);
      } else {
        resolve(null);
      }
    });
  });
};
