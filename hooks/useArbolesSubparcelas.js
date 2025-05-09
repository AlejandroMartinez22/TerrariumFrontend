import { getArbolesBySubparcela } from "../api";

export const getArbolesSubparcela = async (subparcelaId, idConglomerado) => {
  try {
    const arboles = await getArbolesBySubparcela(subparcelaId, idConglomerado);
    return arboles;
  } catch (error) {
    console.error("Error al obtener los árboles de la subparcela:", error);
    return null;
  }
}