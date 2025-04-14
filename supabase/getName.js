import supabase from './supabaseClient';

export const getUserNameByUID = async (id) => {
  try {

    // Consulta la tabla "Usuarios" para encontrar el registro con el UID especificado
      const { data, error } = await supabase
          .from('brigadista')
      .select('nombre')
      .eq('UID', id);

    // Verificar si hay un error en la consulta
      if (error) {
      console.error('Error al obtener el usuario:', error);
      return null;
      }

    // Verificar si se encontraron datos
    if (!data || data.length === 0) {
      console.error('No se encontró ningún usuario con UID:', id);
          return null;
      }
    
    // Verificar si hay más de un resultado
    if (data.length > 1) {
      console.warn('Se encontraron múltiples usuarios con el mismo UID:', id);
      // Tomamos el primer resultado
    }
    
    return data[0].nombre;
    
  } catch (err) {
    console.error('Error inesperado en getUserNameByUID:', err);
      return null;
  }
};