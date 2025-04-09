import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getInfoBrigadista } from "../supabase/getInfoBrigadista";

const BrigadistaContext = createContext();

export const BrigadistaProvider = ({ children }) => {
  const [brigadista, setBrigadista] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setLoading(true);
          const info = await getInfoBrigadista(); // ahora ya espera el UID correctamente
          if (!info) {
            throw new Error("No se encontró información del brigadista.");
          }
          setBrigadista(info);
          setError(null);
        } catch (err) {
          setError(err.message);
          setBrigadista(null);
        } finally {
          setLoading(false);
        }
      } else {
        // No hay usuario logueado
        setBrigadista(null);
        setError(null);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Limpia al desmontar
  }, []);

  return (
    <BrigadistaContext.Provider
      value={{
        brigadista,
        setBrigadista,
        loading,
        error,
        setError,
      }}
    >
      {children}
    </BrigadistaContext.Provider>
  );
};

export const useBrigadista = () => useContext(BrigadistaContext);
