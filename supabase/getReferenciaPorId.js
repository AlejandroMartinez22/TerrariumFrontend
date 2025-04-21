// en supabase/getReferenciaPorId.js
import supabase from './supabaseClient';

export const obtenerReferenciaPorId = async (id) => {
  try {
    const { data, error } = await supabase
      .from('punto_referencia')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;  // Esto debe retornar el objeto con todos los campos, incluyendo cedula_brigadista
  } catch (error) {
    console.error("Error al obtener referencia por ID:", error);
    throw error;
  }
};