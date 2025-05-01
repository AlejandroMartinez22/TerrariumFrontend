/*LISTO*/
// Contexto para manejar la información del brigadista
// importar react y los hooks necesarios
import React, { createContext, useContext, useState, useEffect } from "react";
// importar firebase para la autenticación
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// importar las funciones necesarias para obtener la información del brigadista y actualizar el tutorial
import { getInfoBrigadistaFromBackend, updateTutorialCompletadoInBackend } from "../api";

// Crear el contexto para el brigadista
const BrigadistaContext = createContext();

// Proveedor del contexto para envolver la aplicación
export const BrigadistaProvider = ({ children }) => {
  // Estado para manejar la información del brigadista, el estado de carga y errores
  const [brigadista, setBrigadista] = useState(null);
  // Estado para manejar la carga de datos
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  // Estado para manejar si el tutorial ha sido completado localmente
  const [localTutorialCompletado, setLocalTutorialCompletado] = useState(false);

  // Estado para manejar el estado del tutorial completado en la base de datos
  useEffect(() => {
    // Función para obtener la información del brigadista desde el backend
    const auth = getAuth();

    // Suscribirse a los cambios de autenticación
    // Esto se ejecuta cada vez que el estado de autenticación cambia (login/logout)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Hay un usuario logueado, obtener la información del brigadista
          setLoading(true);
          const info = await getInfoBrigadistaFromBackend();
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
      
      // Actualizar también en la BD a través del backend
      if (brigadista) {
        await updateTutorialCompletadoInBackend(true);
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

  // Proveer el contexto a los componentes hijos
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

// Hook para acceder al contexto de brigadista
// Este hook permite a los componentes acceder fácilmente al contexto del brigadista
export const useBrigadista = () => useContext(BrigadistaContext);