import supabase from "./supabaseClient";

export const actualizarTrayecto = async (trayecto, referenciaId) => {
  try {
    const { medioTransporte, duracion, distancia } = trayecto;

    if (!medioTransporte || medioTransporte.trim() === "") {
      throw new Error("El campo 'medio_transporte' no puede estar vacío");
    }

    const { error } = await supabase
      .from("trayecto")
      .update({
        medio_transporte: medioTransporte,
        duracion,
        distancia,
      })
      .eq("id_punto_referencia", referenciaId);

    if (error) throw error;

    console.log("Trayecto actualizado correctamente.");
    return true;
  } catch (err) {
    console.error("Error al actualizar el trayecto:", err);
    throw err;
  }
};
