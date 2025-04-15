import { useState } from "react";
import { generarSiguienteId } from "./genIdReferencia";
import { crearPuntoReferencia } from "./puntoReferencia";

export const useReferenciaHandler = () => {
  const [puntosReferencia, setPuntosReferencia] = useState([]);

  const handleAgregarReferencia = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    const nuevoId = generarSiguienteId(puntosReferencia);
    const nuevoPunto = crearPuntoReferencia(nuevoId, coordinate);
    setPuntosReferencia([...puntosReferencia, nuevoPunto]);
  };

  return {
    puntosReferencia,
    setPuntosReferencia,
    handleAgregarReferencia,
  };
};
