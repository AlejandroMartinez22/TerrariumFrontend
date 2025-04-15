import { useState } from "react";
import { generarSiguienteId } from "./genIdReferencia";
import { crearPuntoReferencia } from "./puntoReferencia";

export const useReferenciaHandler = () => {
  const [puntosReferencia, setPuntosReferencia] = useState([]);

  const generarReferenciaInicial = (coordinate) => {
    const nuevoId = generarSiguienteId(puntosReferencia);
    return crearPuntoReferencia(nuevoId, coordinate);
  };

  return {
    puntosReferencia,
    setPuntosReferencia,
    generarReferenciaInicial,
  };
};
