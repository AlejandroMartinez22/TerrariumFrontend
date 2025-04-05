import supabase from "./supabaseClient";
import { getCurrentUserUid } from "../backend/currentUser";

export const getInfoBrigada = async () => {
    const uid = getCurrentUserUid();
    if (!uid) {
      console.error("No hay usuario autenticado");
      return null;
    } else {
      try {
        // Consulta la tabla "Brigadista"
        const { data, error } = await supabase
          .from("Brigadista")
          .select("nombre, idBrigada, rol, cedula")
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
        
        // Consulta a la tabla Brigada para obtener el idConglomerado
        // Utilizamos el id de la tabla Brigada que está almacenado como idBrigada en Brigadista
        const { data: brigadaData, error: brigadaError } = await supabase
          .from("Brigada")
          .select("idConglomerado")
          .eq("id", brigadista.idBrigada)
          .single();
        
        if (brigadaError) {
          console.error("Error al obtener el conglomerado:", brigadaError);
          return null;
        }
        
        return {
          nombre: brigadista.nombre,
          brigada: brigadista.idBrigada,
          rol: brigadista.rol,
          cedula: brigadista.cedula,
          idConglomerado: brigadaData.idConglomerado
        };
      } catch (err) {
        console.error("Error inesperado en getInfoBrigada:", err);
        return null;
      }
    }
  };