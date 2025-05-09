import { useState } from "react";

import { getUltimoIdMuestraDeBack } from "../api";
import { guardarMuestraEnBackend } from "../api";

export const siguienteIdMuestra = async () => {
  try {
    const id = await getUltimoIdMuestraDeBack();
    return id;
  } catch (error) {
    console.error("Error al obtener el siguiente ID de muestra:", error);
    return null;
  }
};

export const guardarMuestra = async (muestraData) => {
    try{
        const id = await guardarMuestraEnBackend(muestraData);
        return id;
    } catch (error) {
        console.error("Error al guardar la muestra:", error);
        return null;
    }
};
