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
        .select("*")
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
        id: subparcela.id,
        id_conglomerado: subparcela.id_conglomerado,
        nombre_subparcela: subparcela.nombre_subparcela,
        latitud: parseFloat(subparcela.latitud),
        longitud: parseFloat(subparcela.longitud), //El resultado de esta consulta se procesa y se devuelve como un array de objetos,
        //donde cada objeto representa una subparcela con propiedades como id, id_conglomerado, nombre_subparcela, latitud y longitud.
      }));

    } catch (err) {
      console.error("Error inesperado en getCoordenadas:", err);
      return [];
    }
  };
