import { supabase } from "./supabaseClient";

export const guardarReferencia = async ({ id, latitude, longitude, description, error }) => {
  const data = {
    latitude,
    longitude,
    description,
    error,
  };

  if (id) {
    const { error: updateError } = await supabase
      .from('referencias')
      .update(data)
      .eq('id', id);

    if (updateError) throw updateError;
  } else {
    const { error: insertError } = await supabase
      .from('referencias')
      .insert([data]);

    if (insertError) throw insertError;
  }
};
