import { useState } from "react";
import { generarReferenciaId } from "./genIdReferencia";
import { crearPuntoReferencia } from "./puntoReferencia";

export const useReferenciaHandler = () => {
  const [puntosReferencia, setPuntosReferencia] = useState([]);

  const generarReferenciaInicial = (coordinate) => {
    const nuevoId = generarReferenciaId(puntosReferencia);
    return crearPuntoReferencia(nuevoId, coordinate);
  };

  return {
    puntosReferencia,
    setPuntosReferencia,
    generarReferenciaInicial,
  };
};
