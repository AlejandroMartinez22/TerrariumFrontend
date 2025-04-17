import supabase from './supabaseClient'; // Asegúrate de que la ruta sea correcta

export const eliminarReferencia = async (puntoId) => {
  try {
    // Eliminamos directamente el punto de referencia
    // La eliminación en cascada se encargará de eliminar el trayecto asociado
    const { data, error } = await supabase
      .from('punto_referencia')
      .delete()
      .eq('id', puntoId);

    if (error) {
      throw error;
    }

    console.log(`✅ Punto de referencia ${puntoId} eliminado correctamente`);
    return { success: true, data };
  } catch (error) {
    console.error(`❌ Error al eliminar punto de referencia ${puntoId}:`, error);
    return { success: false, error };
  }
};