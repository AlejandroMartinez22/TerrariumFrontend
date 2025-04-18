// saveReferencia.js
import supabase from './supabaseClient';

export const insertarReferencia = async (puntoReferencia, cedulaBrigadista) => {
  try {
    // Prepare the data object for insertion with correct column names
    const puntoData = {
      id: puntoReferencia.id,
      latitud: puntoReferencia.latitude,
      longitud: puntoReferencia.longitude,
      descripcion: puntoReferencia.description,
      error: puntoReferencia.errorMedicion,  // Cambiado de error_medicion a error
      cedula_brigadista: cedulaBrigadista,
      tipo: puntoReferencia.tipo || 'Referencia'  // Añadido el campo tipo que está en tu tabla
    };

    // Insert into database
    const { data, error } = await supabase
      .from('punto_referencia')
      .insert(puntoData)
      .select();

    if (error) throw error;
    
    // Return the ID of the inserted record
    return data[0].id;
  } catch (error) {
    console.error("Error al insertar punto de referencia:", error);
    throw error;
  }
};