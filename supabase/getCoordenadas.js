// getCoordenadas.js
import supabase from "./supabaseClient";

export const getCoordenadas = async (brigadista) => {
  if (!brigadista || !brigadista.idConglomerado) {
    console.error("El contexto del brigadista no está definido o no tiene un idConglomerado válido.");
    return [];
  }

  try {
    const { data: subparcelas, error: subparcelasError } = await supabase
      .from("Subparcela")
      .select("id")
      .eq("id_conglomerado", brigadista.idConglomerado);

    if (subparcelasError) {
      console.error("Error al obtener subparcelas:", subparcelasError);
      return [];
    }

    if (!subparcelas || subparcelas.length === 0) {
      console.warn("No se encontraron subparcelas para el conglomerado:", brigadista.idConglomerado);
      return [];
    }

    const subparcelaIds = subparcelas.map((subparcela) => subparcela.id);

    const { data: coordenadas, error: coordenadasError } = await supabase
      .from("Coordenada")
      .select("latitud, longitud, id_subparcela")
      .in("id_subparcela", subparcelaIds);

    if (coordenadasError) {
      console.error("Error al obtener coordenadas:", coordenadasError);
      return [];
    }

    if (!coordenadas || coordenadas.length === 0) {
      console.warn("No se encontraron coordenadas para las subparcelas proporcionadas.");
      return [];
    }

    return coordenadas;
  } catch (err) {
    console.error("Error inesperado en getCoordenadas:", err);
    return [];
  }
};
