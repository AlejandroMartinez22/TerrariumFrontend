import supabase from './supabaseClient';

export const getCentrosPoblados = async (brigadista) => {
    console.log("Iniciando getCentrosPoblados con brigadista:", brigadista);
    if (!brigadista?.idConglomerado) {
      console.log("No hay idConglomerado en brigadista");
      return [];
    }
  
    try {
      console.log("Consultando brigadas con idConglomerado:", brigadista.idConglomerado);
      const { data: brigadas, error: errorBrigadas } = await supabase
        .from('brigada')
        .select('id')
        .eq('id_conglomerado', brigadista.idConglomerado);
  
      if (errorBrigadas) {
        console.error("Error en consulta de brigadas:", errorBrigadas);
        throw errorBrigadas;
      }
      
      console.log("Brigadas encontradas:", brigadas);
      const idsBrigadas = brigadas.map(b => b.id);
      
      if (idsBrigadas.length === 0) {
        console.log("No se encontraron brigadas");
        return [];
      }
  
      console.log("Consultando brigadistas con idsBrigadas:", idsBrigadas);
      const { data: brigadistas, error: errorBrigadistas } = await supabase
        .from('brigadista')
        .select('cedula')
        .in('id_brigada', idsBrigadas);
  
      if (errorBrigadistas) {
        console.error("Error en consulta de brigadistas:", errorBrigadistas);
        throw errorBrigadistas;
      }
      
      console.log("Brigadistas encontrados:", brigadistas);
      const cedulas = brigadistas.map(b => b.cedula);
      
      if (cedulas.length === 0) {
        console.log("No se encontraron cédulas de brigadistas");
        return [];
      }
  
      console.log("Consultando puntos con cedulas:", cedulas);
      const { data: centros, error: errorCentros } = await supabase
        .from('punto_referencia')
        .select('latitud, longitud, descripcion, tipo')
        .eq('tipo', 'Centro Poblado')
        .in('cedula_brigadista', cedulas);
  
      if (errorCentros) {
        console.error("Error en consulta de centros poblados:", errorCentros);
        throw errorCentros;
      }
      
      console.log("Centros poblados encontrados:", centros);
      
      // Formato riguroso de validación de coordenadas numéricas
      const centrosFormateados = centros.map(centro => {
        try {
          // Asegúrate de que cualquier formato de string se convierta correctamente
          // a un número válido, incluso si contiene caracteres no numéricos
          let lat = centro.latitud;
          let lng = centro.longitud;
          
          // Si son strings, intenta limpiarlos y convertirlos
          if (typeof lat === 'string') {
            lat = parseFloat(lat.replace(/[^\d.-]/g, ''));
          }
          if (typeof lng === 'string') {
            lng = parseFloat(lng.replace(/[^\d.-]/g, ''));
          }
          
          // Verificación adicional para coordenadas inválidas
          if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
            console.warn("Coordenadas inválidas encontradas:", centro);
            return null; // Omitir este centro
          }
          
          // Verificar rangos válidos para coordenadas (latitud: -90 a 90, longitud: -180 a 180)
          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            console.warn("Coordenadas fuera de rango:", { lat, lng });
            return null; // Omitir este centro
          }
          
          return {
            ...centro,
            latitud: lat,
            longitud: lng
          };
        } catch (error) {
          console.error("Error procesando coordenadas:", error, centro);
          return null;
        }
      }).filter(Boolean); // Eliminar entradas nulas
      
      console.log("Centros formateados para devolver:", centrosFormateados);
      return centrosFormateados;
    } catch (error) {
      console.error('Error al obtener centros poblados:', error.message);
      return [];
    }
};