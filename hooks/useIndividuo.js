    import { getUltimoIdIndividuoDeBack, guardarIndividuoEnBackend } from "../api";

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

    // Función para guardar un individuo en el backend
    const guardarIndividuo = async (individuoData) => {
        try {
        const id = await guardarIndividuoEnBackend(individuoData);
        return id;
        } catch (error) {
        console.error("Error al guardar el individuo:", error);
        return null;
        }
    };

    return {
        siguienteIdIndividuo,
        guardarIndividuo
    };
    };