import { getAuth } from "firebase/auth";

export function getCurrentUserUid() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    return user.uid; // Usuario está autenticado, devuelve el UID del usuario
  } else {
    return null; // No hay usuario autenticado
  }
}