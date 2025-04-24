/*ESTE ARCHIVO SI DEBE MANTENERSE EN EL FRONTEND*/
/*La responsabilidad del frontend es la autenticación del usuario, la obtención del token y el envío de ese token al backend para su verificación.*/

import { signInWithEmailAndPassword} from "firebase/auth";  // Importamos funciones necesarias desde Firebase para autenticar usuarios
import { auth } from "../config/firebaseConfig"; // Importamos nuestra instancia de autenticación de Firebase ya configurada
import { verifyTokenAndGetUser } from "../api"; // Importamos nuestra función personalizada que verifica el token con el backend y obtiene datos del usuario

/**
 * Hook de login.
 * 
 * Esta función realiza el proceso completo de autenticación de un usuario:
 * 1. Autentica al usuario con Firebase usando email y contraseña.
 * 2. Obtiene el token de Firebase del usuario autenticado.
 * 3. Envía el token al backend para su verificación y obtención de datos adicionales (nombre, rol, etc.).
 * 4. Devuelve un objeto con la información del usuario.
**/


export const login = async (email, password) => {
  try {

    // Imprimimos en consola el intento de login con el email proporcionad
    console.log(`Intentando login con:`, email);
    
    // Autenticación con Firebase (frontend)
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    console.log(`Login exitoso:`, userCredential.user.uid);
    
    // Obtener token de Firebase para verificación en el backend
    console.log("Obteniendo token ID de Firebase...");
    const idToken = await userCredential.user.getIdToken();
    console.log("Token obtenido, enviando al backend...");
    
    //Verificar token en backend y obtener datos adicionales
    const userData = await verifyTokenAndGetUser(idToken);
    
    console.log("Datos completos del usuario:", userData);
    
    // Combinar datos de Firebase y del backend
    // Retornamos un objeto con la información del usuario y el nombre obtenido del backend
    return {
      ...userCredential.user,
      nombre: userData.nombre
    };
    
  } catch (error) {
     // Si ocurre un error en cualquier parte del proceso, lo capturamos aquí
    console.error(
      `Error en login:`,
      error.code,
      error.message
    );

    // Dependiendo del tipo de error, lanzamos un mensaje más específico
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        throw new Error("Email o contraseña incorrectos, intente nuevamente");

      case "auth/invalid-email":
        throw new Error("Por favor ingrese un email válido");

      case "auth/network-request-failed":
        throw new Error(
          "Problema de conexión. Verifica tu red e intenta nuevamente"
        );

      default:
        throw new Error("Ocurrió un error inesperado. Intenta más tarde.");
    }
  }
};
