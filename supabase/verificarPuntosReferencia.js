import supabase from "./supabaseClient"; // Ajusta la ruta según tu estructura de proyecto

export const verificarPuntosReferencia = async (cedulaBrigadista) => {
  try {
    if (!cedulaBrigadista) {
      console.warn("verificarPuntosReferencia: No se proporcionó cedulaBrigadista");
      return 0;
    }

    // Consulta específica para puntos de referencia
    const { data, error } = await supabase
      .from("punto_referencia")
      .select("id")
      .eq("cedula_brigadista", cedulaBrigadista)
      .eq("tipo", "Referencia");

    if (error) {
      console.error("Error al consultar puntos de referencia:", error);
      return 0;
    }

    console.log(`Se encontraron ${data.length} puntos de referencia para el brigadista ${cedulaBrigadista}`);
    return data.length;
  } catch (err) {
    console.error("Error inesperado al verificar puntos:", err);
    return 0;
  }
};

export const haySuficientesPuntosReferencia = async (cedulaBrigadista, minimo = 4) => {
  const cantidad = await verificarPuntosReferencia(cedulaBrigadista);
  const suficientes = cantidad >= minimo;
  console.log(`¿Hay al menos ${minimo} puntos? ${suficientes} (${cantidad} encontrados)`);
  return suficientes;
};