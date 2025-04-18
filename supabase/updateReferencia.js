import supabase from './supabaseClient';  

export const actualizarReferencia = async (puntoReferencia, cedulaBrigadista) => {
  try {
    // Make sure we have an ID
    if (!puntoReferencia.id) {
      return { success: false, error: "ID de punto no proporcionado" };
    }
    
    // Primero verificamos si el brigadista es el creador del punto
    const { data: puntoExistente, error: errorConsulta } = await supabase
      .from('punto_referencia')
      .select('cedula_brigadista')
      .eq('id', puntoReferencia.id)
      .single();
    
    if (errorConsulta) {
      throw errorConsulta;
    }
    
    // Si el brigadista actual no es el creador, retornamos error
    if (puntoExistente.cedula_brigadista !== cedulaBrigadista) {
      return { 
        success: false, 
        error: "No tienes permiso para modificar este punto. Solo el creador puede modificarlo." 
      };
    }
    
    // Prepare the data object for update with the correct column names
    const puntoData = {
      latitud: puntoReferencia.latitude,
      longitud: puntoReferencia.longitude,
      descripcion: puntoReferencia.description,
      error: puntoReferencia.errorMedicion,
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