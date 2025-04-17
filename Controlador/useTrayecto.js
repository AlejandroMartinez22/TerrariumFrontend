import supabase from "../supabaseClient";

export const useTrayecto = () => {
  const guardarTrayecto = async ({
    id,
    medio_transporte,
    duracion,
    distancia,
    id_punto_referencia,
  }) => {
    const { data, error } = await supabase.from("trayecto").insert([
      {
        id,
        medio_transporte,
        duracion,
        distancia,
        id_punto_referencia,
      },
    ]);

    if (error) {
      console.error("❌ Error al guardar trayecto:", error);
      throw error;
    }

    return data[0];
  };

  return { guardarTrayecto };
};
