import { signInWithEmailAndPassword } from "firebase/auth";
import { Platform } from "react-native"; // ✅ ESTA LÍNEA FALTABA
import { auth } from "../config/firebaseConfig";

export const login = async (email, password) => {
  try {
    console.log(`[${Platform.OS}] Intentando login con:`, email);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(`[${Platform.OS}] Login exitoso:`, userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error(
      `[${Platform.OS}] Error en login:`,
      error.code,
      error.message
    );

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
