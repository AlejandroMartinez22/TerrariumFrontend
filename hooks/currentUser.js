import { getAuth, onAuthStateChanged } from "firebase/auth";

export const getCurrentUserUid = () => {
  return new Promise((resolve) => {
    const auth = getAuth();
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
