import supabase from './supabaseClient';
import { getCurrentUserUid } from "../hooks/currentUser";

export const updateTutorialCompletado = async (completado) => {
    try {
        console.log("⏳ Iniciando actualización de tutorial...");

        const uid = await getCurrentUserUid();
        console.log("✅ UID obtenido:", uid);

        if (!uid) {
            console.warn("⚠️ No hay usuario autenticado.");
            throw new Error("No hay usuario autenticado");
        }

        // 1. Primero obtenemos la información del brigadista actual para conocer su brigada
        const { data: brigadistaData, error: brigadistaError } = await supabase
            .from('brigadista')
            .select('id_brigada, rol')
            .eq("UID", uid)
            .single();

        if (brigadistaError) {
            console.error("❌ Error al obtener información del brigadista:", brigadistaError);
            throw brigadistaError;
        }

        const idBrigada = brigadistaData.id_brigada;
        const rol = brigadistaData.rol;

        console.log("👥 ID de brigada del usuario:", idBrigada);
        console.log("👤 Rol del usuario:", rol);

        // Verificar que el usuario sea Jefe de brigada
        if (rol !== "Jefe de brigada" && completado === true) {
            console.warn("⚠️ Solo el Jefe de brigada puede completar el tutorial para toda la brigada");
            
            // Actualizar solo el usuario actual
            const { data, error } = await supabase
                .from('brigadista')
                .update({ tutorial_completado: completado })
                .eq("UID", uid);

            if (error) {
                console.error("❌ Error al actualizar el tutorial para el usuario:", error);
                throw error;
            }
            
            return data;
        }

        console.log("📤 Enviando update a Supabase para toda la brigada...");
        console.log("📝 Valor a actualizar:", completado);

        // 2. Actualizamos el tutorial_completado para todos los miembros de la brigada
        const { data, error } = await supabase
            .from('brigadista')
            .update({ tutorial_completado: completado })
            .eq("id_brigada", idBrigada);

        if (error) {
            console.error("❌ Error al hacer el update en Supabase para la brigada:", error);
            throw error;
        }

        console.log(`✅ Tutorial actualizado exitosamente para todos los miembros de la brigada ${idBrigada}`);
        return data;

    } catch (error) {
        console.error("🚨 Error en updateTutorialCompletado:", error);
        throw error;
    }
};