import supabase from './supabaseClient';

export const insertarReferencia = async (punto, cedulaBrigadista) => {
  const { id, latitude, longitude, description, errorMedicion } = punto;

  const { error } = await supabase
    .from('punto_referencia')
    .insert([
      {
        id,
        latitud: latitude.toString(),
        longitud: longitude.toString(),
        tipo: 'punto referencia', // ajusta según el tipo real si lo tienes
        descripcion: description,
        error: errorMedicion,
        cedula_brigadista: cedulaBrigadista,
      },
    ]);

  if (error) throw error;

  return id;
};
