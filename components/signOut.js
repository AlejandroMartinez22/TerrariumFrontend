import { getAuth, signOut } from "firebase/auth";

export const handleSignOut = async (navigation) => {
  const auth = getAuth();
  try {
    await signOut(auth);
    console.log("Sesión cerrada con éxito");
    // Navega al login después de cerrar sesión
    navigation.replace('Login');
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};