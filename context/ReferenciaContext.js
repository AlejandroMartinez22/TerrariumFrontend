import React, { createContext, useContext, useState } from "react";

const ReferenciaContext = createContext();

export const ReferenciaProvider = ({ children }) => {
  const [puntosReferencia, setPuntosReferencia] = useState([]);

  // 🔧 Esta función ahora recibe el ID como argumento
  const generarReferenciaInicial = (id, coordinate) => {
    return {
      id,
      title: "",
      description: "",
      coordinate,
      errorMedicion: "",
    };
  };

  const resetReferencias = () => {
    setPuntosReferencia([]);
  };

  return (
    <ReferenciaContext.Provider
      value={{
        puntosReferencia,
        setPuntosReferencia,
        generarReferenciaInicial,
        resetReferencias,
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
