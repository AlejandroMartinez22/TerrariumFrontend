import { getArbolesBySubparcela } from "../api";

// Hook para obtener árboles de una subparcela
// Este hook se encarga de obtener los árboles de una subparcela específica
// y maneja el estado de carga y errores.
export const getArbolesSubparcela = async (subparcelaId, idConglomerado) => {
  try {
    const arboles = await getArbolesBySubparcela(subparcelaId, idConglomerado);
    return arboles;
  } catch (error) {
    console.error("Error al obtener los árboles de la subparcela:", error);
    return null;
  }
}