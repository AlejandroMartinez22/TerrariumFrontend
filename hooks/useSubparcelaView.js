import { fetchCaracteristicasSubparcela, getSubparcelaId } from '../api';

export const useSubparcela = () => {
  // Función para obtener el ID de la subparcela basado en su nombre y el ID del conglomerado
  const obtenerIdSubparcela = async (nombreSubparcela, conglomeradoId) => {
    try {
      // Verificar que los parámetros necesarios estén presentes
      if (!nombreSubparcela || !conglomeradoId) {
        console.error("Faltan parámetros para obtener ID de subparcela:", 
          { nombreSubparcela, conglomeradoId });
        return null;
      }

      console.log(`Obteniendo ID de subparcela para: ${nombreSubparcela} en conglomerado: ${conglomeradoId}`);
      
      // Llamar a la API con el nombre de la subparcela y el ID del conglomerado
      const idSubparcela = await getSubparcelaId(nombreSubparcela, conglomeradoId);
      
      console.log(`ID de subparcela obtenido: ${idSubparcela}`);
      return idSubparcela;
    } catch (error) {
      console.error("Error al obtener el ID de la subparcela:", error);
      return null;
    }
  };

  return {
    obtenerIdSubparcela
  };
};

// Función para obtener características de la subparcela
export const getCaracteristicasSubparcela = async (nombreSubparcela, idConglomerado) => {
  try {
    // Verificar que los parámetros necesarios estén presentes
    if (!nombreSubparcela || !idConglomerado) {
      console.error("Faltan parámetros para obtener características de subparcela:", 
        { nombreSubparcela, idConglomerado });
      return null;
    }

    console.log(`Obteniendo características para subparcela: ${nombreSubparcela} en conglomerado: ${idConglomerado}`);

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