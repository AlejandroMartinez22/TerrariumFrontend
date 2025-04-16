    // src/hooks/useSincronizarSubparcelas.js
    import { useState } from 'react';
    import { sincronizarSubparcelas } from '../supabase/coberturaAlteracionService';

    export const useSincronizarSubparcelas = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resultados, setResultados] = useState(null);

    // Función para sincronizar con Supabase
    const sincronizar = async (subparcelasCaracteristicas) => {
        try {
        setLoading(true);
        setError(null);
        
        // Llamar al servicio de Supabase para sincronizar
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