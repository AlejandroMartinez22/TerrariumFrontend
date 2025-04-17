import supabase from './supabaseClient';

export const actualizarReferencia = async (punto, cedulaBrigadista) => {
  const { id, latitude, longitude, description, errorMedicion } = punto;

  const { error } = await supabase
    .from('punto_referencia')
    .update({
      latitud: latitude.toString(),
      longitud: longitude.toString(),
      descripcion: description,
      error: errorMedicion,
    })
    .match({
      id: id,
      cedula_brigadista: cedulaBrigadista, // Se asegura que solo el creador lo pueda modificar
    });

  if (error) {
    throw error;
  }

  console.log(`✅ Punto de referencia con ID ${id} actualizado por brigadista ${cedulaBrigadista}`);
  return id;
};
