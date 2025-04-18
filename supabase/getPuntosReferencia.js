// getPuntosReferencia.js
import supabase from './supabaseClient';

export const getPuntosReferencia = async (idConglomerado) => {
  try {
    // First get the reference points using cedula instead of id
    const { data: puntosData, error: puntosError } = await supabase
      .from('punto_referencia')
      .select('*')
      .eq('tipo', 'Referencia');
    
    if (puntosError) throw puntosError;
    
    // If there are no points, return an empty array
    if (!puntosData || puntosData.length === 0) {
      return [];
    }
    
    // Get the trayectos for each punto
    const puntoIds = puntosData.map(punto => punto.id);
    
    const { data: trayectosData, error: trayectosError } = await supabase
      .from('trayecto')
      .select('*')
      .in('id_punto_referencia', puntoIds);
    
    if (trayectosError) throw trayectosError;
    
    // Combine the data
    const puntosConTrayectos = puntosData.map(punto => {
      const trayecto = trayectosData.find(t => t.id_punto_referencia === punto.id);
      return {
        ...punto,
        trayectos: trayecto || null
      };
    });
    
    return puntosConTrayectos;
  } catch (error) {
    console.error("Error fetching puntos de referencia:", error);
    throw error;
  }
};