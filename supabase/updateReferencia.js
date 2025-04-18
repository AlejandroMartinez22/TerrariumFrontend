// updateReferencia.js 
import supabase from './supabaseClient';  

export const actualizarReferencia = async (puntoReferencia, cedulaBrigadista) => {
  try {
    // Make sure we have an ID
    if (!puntoReferencia.id) {
      return { success: false, error: "ID de punto no proporcionado" };
    }
    
    // Prepare the data object for update with the correct column names
    const puntoData = {
      latitud: puntoReferencia.latitude,
      longitud: puntoReferencia.longitude,
      descripcion: puntoReferencia.description,
      error: puntoReferencia.errorMedicion,  // Aquí está el cambio - usando 'error' en lugar de 'error_medicion'
      cedula_brigadista: cedulaBrigadista,
    };
    
    // Update in database
    const { error } = await supabase
      .from('punto_referencia')
      .update(puntoData)
      .eq('id', puntoReferencia.id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar punto de referencia:", error);
    return { success: false, error };
  }
};