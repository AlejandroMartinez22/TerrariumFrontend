import { getAuth, signOut } from "firebase/auth";
import {useBrigadista} from "../context/BrigadistaContext"

export const handleSignOut = async (navigation, setBrigadista, setError) => {
  const auth = getAuth();
  try {
    await signOut(auth);
    setBrigadista(null);
    setError(null);
    console.log("Sesión cerrada con éxito");
    navigation.replace('Login'); // Navega al login después de cerrar sesión
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};