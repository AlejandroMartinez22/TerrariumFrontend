import { fetchCaracteristicasSubparcela, getSubparcelaId, fetchIndividuosByConglomerado } from '../api';

// Hook para obtener el ID de la subparcela
// Este hook se encarga de obtener el ID de la subparcela a partir del nombre y el ID del conglomerado
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
      
      // Llamar a la API con el nombre de la subparcela y el ID del conglomerado
      const idSubparcela = await getSubparcelaId(nombreSubparcela, conglomeradoId);
      
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

    // Llama a la función de la API que ya maneja la comunicación con el backend
    const caracteristicas = await fetchCaracteristicasSubparcela(nombreSubparcela, idConglomerado);
    
    // Asegurarse de que la estructura de datos coincida con lo que espera el componente
    if (caracteristicas) {
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

// Función para obtener individuos por conglomerado
// Este hook se encarga de obtener los individuos de un conglomerado específico
export const getIndividuosByConglomerado = async (idConglomerado) => {
  try {
    // Verificar que el ID del conglomerado esté presente
    if (!idConglomerado) {
      console.error("Falta el ID del conglomerado para obtener individuos.");
      return null;
    }


    // Llama a la función de la API que ya maneja la comunicación con el backend
    const individuos = await fetchIndividuosByConglomerado(idConglomerado);
    
    return individuos;
  } catch (error) {
    console.error("Error al obtener individuos por conglomerado:", error);
    throw error;
  }
};