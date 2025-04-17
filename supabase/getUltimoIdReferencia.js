import supabase from "./supabaseClient";

// getUltimoIdReferencia.js
export const obtenerSiguienteId = async () => {
  try {
    // Realiza una consulta a la tabla punto_referencia
    const { data, error } = await supabase
      .from("punto_referencia")
      .select("id")
      .order("id", { ascending: false }) // Ordenamos de manera descendente por el id
      .limit(1); // Solo tomamos el último punto

    if (error) {
      console.error("Error al obtener el último ID:", error);
      return null;
    }

    if (data.length === 0) {
      // Si no hay puntos en la tabla, el primer ID será PR001
      return "PR001";
    }

    // Obtener el último ID
    const ultimoId = data[0].id;

    // Extraer el número del ID (ejemplo: PR001 -> 1)
    const numero = parseInt(ultimoId.replace("PR", ""), 10);

    // Generar el siguiente ID
    const siguienteNumero = numero + 1;
    const siguienteId = `PR${siguienteNumero.toString().padStart(3, "0")}`;

    return siguienteId;
  } catch (error) {
    console.error("Error al obtener el siguiente ID:", error);
    return null;
  }
};
