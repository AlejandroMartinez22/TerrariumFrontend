import { useState } from 'react';
import { sincronizarSubparcelas } from '../api'; // Se cambia de Supabase a API

// Hook para sincronizar subparcelas con el backend
export const useSincronizarSubparcelas = () => {
    const [loading, setLoading] = useState(false); // Estado de carga
    const [error, setError] = useState(null); // Manejo de errores
    const [resultados, setResultados] = useState(null); // Almacena los resultados de la sincronización

    // Función para sincronizar subparcelas con el backend
    const sincronizar = async (subparcelasCaracteristicas) => {
        try {
            setLoading(true);
            setError(null);

            // Llamada a la API para sincronizar los datos
            const result = await sincronizarSubparcelas(subparcelasCaracteristicas);
            
            setResultados(result);
            return result;
        } catch (err) {
            setError(err.message || 'Error al sincronizar con la base de datos');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { sincronizar, loading, error, resultados };
};