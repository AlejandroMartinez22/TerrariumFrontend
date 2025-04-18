import supabase from './supabaseClient';

export async function obtenerReferenciaPorId(id) {
  try {
    const { data, error } = await supabase
      .from('punto_referencia')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error al obtener punto de referencia:', error);
    throw error;
  }
}