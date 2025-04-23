import { getAuth, signOut } from "firebase/auth";
import api from "../api"; // Tu instancia de axios configurada

export const handleSignOut = async (navigation, setBrigadista, setError) => {
  const auth = getAuth();
  try {
    // 1. Cierra la sesión en Firebase
    await signOut(auth);
    
    // 2. Notifica al backend (opcional)
    try {
      await api.post('/auth/logout');
      console.log("Backend notificado del cierre de sesión");
    } catch (backendError) {
      // Si falla la comunicación con el backend, no bloqueamos el proceso
      console.warn("No se pudo notificar al backend sobre el cierre de sesión:", backendError);
    }
    
    // 3. Limpia el estado local
    setBrigadista(null);
    setError(null);
    
    console.log("Sesión cerrada con éxito");
    navigation.replace('Login'); // Navega al login después de cerrar sesión
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};