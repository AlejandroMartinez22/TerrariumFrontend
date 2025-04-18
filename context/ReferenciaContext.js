import React, { createContext, useContext, useState, useEffect } from "react";
import { getPuntosReferencia } from "../supabase/getPuntosReferencia"; // Ajusta la ruta según corresponda

const ReferenciaContext = createContext();

export const ReferenciaProvider = ({ children }) => {
  const [puntosReferencia, setPuntosReferencia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const puntos = await getPuntosReferencia(cedulaBrigadista);
      
      // Depuración - verificar lo que se está obteniendo
      console.log("Puntos cargados de la BD:", puntos);
      console.log("Cantidad de puntos cargados:", puntos.length);
      
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
      console.log("Punto agregado. Total puntos:", puntosActualizados.length);
      return puntosActualizados;
    });
  };

  // Función para verificar si hay al menos 4 puntos de referencia
  const tieneSuficientesPuntos = () => {
    const cantidad = puntosReferencia.length;
    console.log("Verificando cantidad de puntos:", cantidad);
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

export const useReferencia = () => {
  const context = useContext(ReferenciaContext);
  if (!context) {
    throw new Error("useReferencia debe usarse dentro de un ReferenciaProvider");
  }
  return context;
};