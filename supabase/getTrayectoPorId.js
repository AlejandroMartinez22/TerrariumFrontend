// Archivo: supabase/getTrayectoPorId.js
import supabase from './supabaseClient';

export async function obtenerTrayectoPorId(id) {
  try {
    const { data, error } = await supabase
      .from('trayecto')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      // Si el error es porque no encontró resultados, retornamos null
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error al obtener trayecto:', error);
    throw error;
  }
}