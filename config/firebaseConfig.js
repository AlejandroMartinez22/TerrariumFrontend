/*Este archivo es necesario para la autenticación inicial con Firebase desde el cliente. De momento 22/04 a las 3:19 está bien así*/

import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBepJm7eK0Q6qamrYV5dg0M2HnXWJr2x6s",
  authDomain: "pruebaintegrador-33c81.firebaseapp.com",
  projectId: "pruebaintegrador-33c81",
  storageBucket: "pruebaintegrador-33c81.firebasestorage.app",
  messagingSenderId: "370711724259",
  appId: "1:370711724259:web:85ad0f65ce403c509785d6"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configuración específica para web
if (Platform.OS === 'web') {
  // Para cargar la persistencia en web de manera segura
  const loadWebAuth = async () => {
    try {
      const { browserLocalPersistence, setPersistence } = await import('firebase/auth');
      await setPersistence(auth, browserLocalPersistence);
      console.log("Persistencia web configurada correctamente");
    } catch (error) {
      console.error("Error al configurar persistencia web:", error);
    }
  };
  
  loadWebAuth();
}

export { app, auth };