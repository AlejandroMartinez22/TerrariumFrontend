// getPuntosReferencia.js
import supabase from './supabaseClient';

export const getPuntosReferencia = async (idConglomerado) => {
  try {
    if (!idConglomerado) {
      throw new Error("Se requiere el ID del conglomerado");
    }
    
    // Obtenemos las brigadas asociadas al conglomerado
    const { data: brigadas, error: brigadasError } = await supabase
      .from('brigada')
      .select('id')
      .eq('id_conglomerado', idConglomerado);
    
    if (brigadasError) throw brigadasError;
    
    if (!brigadas || brigadas.length === 0) {
      return []; // No hay brigadas para este conglomerado
    }
    
    // Obtenemos los IDs de las brigadas
    const brigadaIds = brigadas.map(brigada => brigada.id);
    
    // Obtenemos los brigadistas asociados a estas brigadas
    const { data: brigadistas, error: brigadistasError } = await supabase
      .from('brigadista')
      .select('cedula')
      .in('id_brigada', brigadaIds);
    
    if (brigadistasError) throw brigadistasError;
    
    if (!brigadistas || brigadistas.length === 0) {
      return []; // No hay brigadistas para estas brigadas
    }
    
    // Obtenemos las cédulas de los brigadistas
    const cedulasBrigadistas = brigadistas.map(brigadista => brigadista.cedula);
    
    // Ahora obtenemos los puntos de referencia asociados a estos brigadistas (por cédula)
    const { data: puntosData, error: puntosError } = await supabase
      .from('punto_referencia')
      .select('*')
      .eq('tipo', 'Referencia')
      .in('cedula_brigadista', cedulasBrigadistas);
    
    if (puntosError) throw puntosError;
    
    if (!puntosData || puntosData.length === 0) {
      return []; // No hay puntos de referencia para estos brigadistas
    }
    
    // Obtenemos los trayectos para cada punto
    const puntoIds = puntosData.map(punto => punto.id);
    
    const { data: trayectosData, error: trayectosError } = await supabase
      .from('trayecto')
      .select('*')
      .in('id_punto_referencia', puntoIds);
    
    if (trayectosError) throw trayectosError;
    
    // Combinamos los datos
    const puntosConTrayectos = puntosData.map(punto => {
      const trayectosDelPunto = trayectosData.filter(t => t.id_punto_referencia === punto.id);
      return {
        ...punto,
        trayectos: trayectosDelPunto.length > 0 ? trayectosDelPunto : []
      };
    });
    
    return puntosConTrayectos;
  } catch (error) {
    console.error("Error fetching puntos de referencia:", error);
    throw error;
  }
};