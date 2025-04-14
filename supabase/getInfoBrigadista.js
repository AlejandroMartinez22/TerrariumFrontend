import supabase from "./supabaseClient";
import { getCurrentUserUid } from "../hooks/currentUser";

export const getInfoBrigadista = async () => {
    const uid = await getCurrentUserUid();
    if (!uid) {
      console.error("No hay usuario autenticado");
      return null;
    } else {
      try {
        // Consulta la tabla "Brigadista"
        const { data, error } = await supabase
          .from("brigadista")
          .select("nombre, id_brigada, rol, cedula")
          .eq("UID", uid);
  
        if (error) {
          console.error("Error al obtener el brigadista:", error);
          return null;
        }
  
        if (!data || data.length === 0) {
          console.error("No se encontró ningún brigadista con UID:", uid);
          return null;
        }
  
        const brigadista = data[0];
        console.log("Buscando brigada con ID:", brigadista.id_brigada);
        

        // Consulta a la tabla Brigada para obtener el idConglomerado
        // Utilizamos el id de la tabla Brigada que está almacenado como idBrigada en Brigadista
        const { data: brigadaData, error: brigadaError } = await supabase
          .from("brigada")
          .select("id_conglomerado")
          .eq("id", brigadista.id_brigada)
          .single();
        
        if (brigadaError) {
          console.error("Error al obtener el conglomerado:", brigadaError);
          return null;
        }
        
        return {
          nombre: brigadista.nombre,
          brigada: brigadista.id_brigada,
          rol: brigadista.rol,
          cedula: brigadista.cedula,
          idConglomerado: brigadaData.id_conglomerado
        };
      } catch (err) {
        console.error("Error inesperado en getInfoBrigadista:", err);
        return null;
      }
    }
  };