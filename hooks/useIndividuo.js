import { getUltimoIdIndividuoDeBack } from "../api";

export const useIndividuo = () => {
  // Función para obtener el siguiente ID de individuo (árbol)
    const siguienteIdIndividuo = async () => {
        try {
        const id = await getUltimoIdIndividuoDeBack();
        return id;
        } catch (error) {
        console.error("Error al obtener el siguiente ID de individuo:", error);
        return null;
        }
    };

    return {
        siguienteIdIndividuo
    };
};

