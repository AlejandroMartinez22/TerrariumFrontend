/*Este archivo es necesario para la autenticación inicial con Firebase desde el cliente. De momento 22/04 a las 3:19 está bien así*/
// importar el módulo Platform de react-native
import { Platform } from 'react-native';
// importar los métodos initializeApp y getAuth de firebase/app y firebase/auth respectivamente
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// configuración de Firebase
// Esta configuración es necesaria para inicializar Firebase en la aplicación
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
// Inicializar la autenticación de Firebase
const auth = getAuth(app);

// Configuración específica para web
if (Platform.OS === 'web') {
  // Para cargar la persistencia en web de manera segura
  const loadWebAuth = async () => {
    try {
      // Importar el módulo browserLocalPersistence de firebase/auth
      const { browserLocalPersistence, setPersistence } = await import('firebase/auth');
      // Configurar la persistencia de la autenticación en el navegador
      await setPersistence(auth, browserLocalPersistence);
    } catch (error) {
      console.error("Error al configurar persistencia web:", error);
    }
  };
  
  // Llamar a la función para cargar la persistencia en web
  loadWebAuth();
}

// Exportar la aplicación y la autenticación para su uso en otros módulos
export { app, auth };