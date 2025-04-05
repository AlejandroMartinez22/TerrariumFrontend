import { 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { Platform } from 'react-native';
import { auth } from '../config/firebaseConfig';

export const login = async (email, password) => {
  try {
    console.log(`[${Platform.OS}] Intentando login con:`, email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(`[${Platform.OS}] Login exitoso:`, userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error(`[${Platform.OS}] Error en login:`, error.code, error.message);
    
    // Mejorar mensajes de error
    if (error.code === 'auth/invalid-credential' || 
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/wrong-password') {
      throw new Error('Email o contraseña incorrectos');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Problema de conexión. Verifica tu red.');
    } else {
      throw new Error(`Error al iniciar sesión: ${error.message}`);
    }
  }
};