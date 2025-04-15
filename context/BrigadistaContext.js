import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getInfoBrigadista } from "../supabase/getInfoBrigadista";
import { updateTutorialCompletado } from "../supabase/updateTutorialCompletado"; // Necesitarás crear esta función

const BrigadistaContext = createContext();

export const BrigadistaProvider = ({ children }) => {
  const [brigadista, setBrigadista] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localTutorialCompletado, setLocalTutorialCompletado] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setLoading(true);
          const info = await getInfoBrigadista();
          if (!info) {
            throw new Error("No se encontró información del brigadista.");
          }
          setBrigadista(info);
          // Inicializar el estado local con el valor de la base de datos
          setLocalTutorialCompletado(info.tutorial_completado || false);
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
        setLocalTutorialCompletado(false);
        setError(null);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Limpia al desmontar
  }, []);

  // Función para marcar el tutorial como completado
  
  const completarTutorial = async () => {
    try {
      // Actualizar el estado local inmediatamente
      setLocalTutorialCompletado(true);
      
      // Actualizar también en la BD
      if (brigadista) {
        await updateTutorialCompletado(true);
        // Actualizamos el objeto brigadista localmente
        setBrigadista({
          ...brigadista,
          tutorial_completado: true
        });
      }
    } catch (err) {
      setError("Error al actualizar el estado del tutorial: " + err.message);
    }
  };

  return (
    <BrigadistaContext.Provider
      value={{
        brigadista,
        setBrigadista,
        loading,
        error,
        setError,
        localTutorialCompletado,
        completarTutorial
      }}
    >
      {children}
    </BrigadistaContext.Provider>
  );
};

export const useBrigadista = () => useContext(BrigadistaContext);