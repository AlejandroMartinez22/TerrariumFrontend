// getCoordenadas.js
import supabase from "./supabaseClient";

export const getCoordenadas = async (brigadista) => {
  if (!brigadista || !brigadista.idConglomerado) {
    console.error("El contexto del brigadista no está definido o no tiene un idConglomerado válido.");
    return [];
  }

  try {
    const { data: subparcelas, error: subparcelasError } = await supabase
      .from("subparcela")
      .select("nombre_subparcela, latitud, longitud")
      .eq("id_conglomerado", brigadista.idConglomerado);

    if (subparcelasError) {
      console.error("Error al obtener subparcelas:", subparcelasError);
      return [];
    }

    if (!subparcelas || subparcelas.length === 0) {
      console.warn("No se encontraron subparcelas para el conglomerado:", brigadista.idConglomerado);
      return [];
    }

    return subparcelas.map((subparcela) => ({
      nombre_subparcela: subparcela.nombre_subparcela,
      latitud: parseFloat(subparcela.latitud),
      longitud: parseFloat(subparcela.longitud),
    }));
  } catch (err) {
    console.error("Error inesperado en getCoordenadas:", err);
    return [];
  }
};
