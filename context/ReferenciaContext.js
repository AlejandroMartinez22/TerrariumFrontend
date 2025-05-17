// importar React y los hooks necesarios de react
import React, { createContext, useContext, useState, useEffect } from "react";
// importar el metodo getPuntosReferenciaByConglomerado desde la API
import { getPuntosReferenciaByConglomerado } from "../api";

// Crear el contexto para los puntos de referencia
const ReferenciaContext = createContext();

// Proveedor del contexto para envolver la aplicación
export const ReferenciaProvider = ({ children }) => {
  // Estado para manejar los puntos de referencia, el estado de carga y errores
  const [puntosReferencia, setPuntosReferencia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para manejar la referencia inicial
  const generarReferenciaInicial = (coordinate) => {
    const id = `PR00${puntosReferencia.length + 1}`;
    return {
      id,
      title: "",
      description: "",
      coordinate,
      errorMedicion: "",
    };
  };

  // Función para cargar puntos desde la base de datos
  const cargarPuntosReferencia = async (cedulaBrigadista) => {
    if (!cedulaBrigadista) {
      console.warn("cargarPuntosReferencia: cedulaBrigadista es undefined o null");
      return [];
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Obtener los puntos de referencia usando la función importada
      const puntos = await getPuntosReferenciaByConglomerado(cedulaBrigadista);
      
      // Actualizar el estado con los puntos recuperados
      setPuntosReferencia(puntos);
      
      return puntos;
    } catch (err) {
      console.error("Error al cargar puntos de referencia:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar un nuevo punto de referencia
  const agregarPuntoReferencia = (nuevoPunto) => {
    setPuntosReferencia(prevPuntos => {
      const puntosActualizados = [...prevPuntos, nuevoPunto];
      return puntosActualizados;
    });
  };

  // Función para verificar si hay al menos 4 puntos de referencia
  const tieneSuficientesPuntos = () => {
    const cantidad = puntosReferencia.length;
    return cantidad >= 4;
  };


  return (
    <ReferenciaContext.Provider
      value={{
        puntosReferencia,
        setPuntosReferencia,
        cargarPuntosReferencia,
        agregarPuntoReferencia,
        generarReferenciaInicial,
        tieneSuficientesPuntos,
        loading,
        error
      }}
    >
      {children}
    </ReferenciaContext.Provider>
  );
};

// Hook para acceder al contexto de referencia
export const useReferencia = () => {
  // Obtener el contexto de ReferenciaContext
  const context = useContext(ReferenciaContext);
  if (!context) {
    throw new Error("useReferencia debe usarse dentro de un ReferenciaProvider");
  }
  return context;
};