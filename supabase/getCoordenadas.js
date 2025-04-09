import supabase from "./supabaseClient";

export const getCoordenadasByConglomerado = async (conglomeradoId) => {
  try {
    // Consulta para obtener las coordenadas de subparcelas relacionadas con el conglomerado
    const { data, error } = await supabase
      .from("Coordenada")
      .select(`
        latitud,
        longitud,
        Subparcela!Coordenada_id_subparcela_fkey(id_conglomerado)
      `) // Usa la relación con Subparcela
      .eq("Subparcela!Coordenada_id_subparcela_fkey.id_conglomerado", conglomeradoId);

    if (error) {
      console.error("Error al obtener las coordenadas:", error);
      return [];
    }

    // Mapea las coordenadas a un array más manejable
    const coordenadasArray = data.map((coordenada) => ({
      latitud: coordenada.latitud,
      longitud: coordenada.longitud,
    }));

    console.log("Array de coordenadas:", coordenadasArray);
    return coordenadasArray;
  } catch (err) {
    console.error("Error inesperado en getCoordenadasByConglomerado:", err);
    return [];
  }
};