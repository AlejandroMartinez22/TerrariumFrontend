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

        console.log("📤 Enviando update a Supabase...");
        console.log("📝 Valor a actualizar:", completado);

        const { data, error } = await supabase
        .from('brigadista')
        .update({ tutorial_completado: completado })
        .eq("UID", uid);

        if (error) {
        console.error("❌ Error al hacer el update en Supabase:", error);
        throw error;
        }

        if (data && data.length === 0) {
        console.warn("⚠️ El update no devolvió resultados. ¿Seguro que existe ese UID?");
        } else {
        console.log("✅ Update exitoso. Data:", data);
        }

        return data;

    } catch (error) {
        console.error("🚨 Error en updateTutorialCompletado:", error);
        throw error;
    }
    };
