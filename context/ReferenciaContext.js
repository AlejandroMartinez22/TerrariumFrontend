// context/ReferenciaContext.js
import React, { createContext, useContext, useState } from "react";

const ReferenciaContext = createContext();

export const ReferenciaProvider = ({ children }) => {
  const [puntosReferencia, setPuntosReferencia] = useState([]);

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

  return (
    <ReferenciaContext.Provider
      value={{ puntosReferencia, setPuntosReferencia, generarReferenciaInicial }}
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
