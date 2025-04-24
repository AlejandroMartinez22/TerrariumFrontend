    import { useState } from 'react';
    import { sincronizarSubparcelas } from '../api'; // Cambiado de supabase a api

    export const useSincronizarSubparcelas = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resultados, setResultados] = useState(null);

    // Función para sincronizar con el backend
    const sincronizar = async (subparcelasCaracteristicas) => {
        try {
        setLoading(true);
        setError(null);
        
        // Ahora llamamos a la API en lugar de al servicio de Supabase directamente
        const result = await sincronizarSubparcelas(subparcelasCaracteristicas);
        
        setResultados(result);
        setLoading(false);
        return result;
        } catch (err) {
        setError(err.message || 'Error al sincronizar con la base de datos');
        setLoading(false);
        throw err;
        }
    };

    return {
        sincronizar,
        loading,
        error,
        resultados
    };
    };