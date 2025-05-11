import {fetchCaracteristicasSubparcela} from '../api';

export const getCaracteristicasSubparcela = async (nombreSubparcela, idConglomerado) => {
  try {
    // Llama a la función de la API que ya maneja la comunicación con el backend
    const caracteristicas = await fetchCaracteristicasSubparcela(nombreSubparcela, idConglomerado);
    
    // Asegurarse de que la estructura de datos coincida con lo que espera el componente
    if (caracteristicas) {
      console.log("Características recibidas:", caracteristicas);
      return {
        subparcelaData: caracteristicas.subparcelaData || {},
        coberturas: caracteristicas.coberturas || [],
        alteraciones: caracteristicas.alteraciones || []
      };
    }
    return null;
  } catch (error) {
    console.error("Error en hook getCaracteristicasSubparcela:", error);
    throw error;
  }
};