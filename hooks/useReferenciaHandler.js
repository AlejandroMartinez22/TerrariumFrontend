// hooks/useReferenciaHandler.js
import { useState } from "react";

export const useReferenciaHandler = () => {
  const [puntosReferencia, setPuntosReferencia] = useState([]);

  const handleAgregarReferencia = (event) => {
    const { coordinate } = event.nativeEvent;
    setPuntosReferencia((prev) => [...prev, coordinate]);
  };

  return {
    puntosReferencia,
    handleAgregarReferencia,
  };
};
