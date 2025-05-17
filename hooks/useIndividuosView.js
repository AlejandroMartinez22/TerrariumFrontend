import { useState, useEffect } from 'react';
import { fetchIndividuosByConglomerado, fetchCoordenadas } from '../api';

// Función para convertir de grados a radianes
const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};

// Función para convertir de radianes a grados
const toDegrees = (radians) => {
    return radians * (180 / Math.PI);
};

/**
 * Calcula la nueva posición geográfica basada en un punto de inicio, azimut y distancia
 * @param {number} lat1 - Latitud del punto inicial en grados
 * @param {number} lon1 - Longitud del punto inicial en grados
 * @param {number} azimuth - Azimut en grados (0° = Norte, 90° = Este, etc.)
 * @param {number} distance - Distancia en metros
 * @returns {Object} - Objeto con las nuevas coordenadas {latitud, longitud}
 */
const calculateCoordinates = (lat1, lon1, azimuth, distance) => {
    // Convertir a radianes
    const latRad = toRadians(lat1);
    const lonRad = toRadians(lon1);
    const azimuthRad = toRadians(azimuth);

    // Radio de la Tierra en metros
    const R = 6371000;

    // Distancia angular en radianes
    const angularDistance = distance / R;

    // Calcular la nueva latitud
    const newLatRad = Math.asin(
        Math.sin(latRad) * Math.cos(angularDistance) +
        Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(azimuthRad)
    );

    // Calcular la nueva longitud
    const newLonRad = lonRad + Math.atan2(
        Math.sin(azimuthRad) * Math.sin(angularDistance) * Math.cos(latRad),
        Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(newLatRad)
    );

    // Convertir de radianes a grados
    const newLat = toDegrees(newLatRad);
    const newLon = toDegrees(newLonRad);

    return {
        latitud: newLat,
        longitud: newLon
    };
};

/**
 * Hook para obtener y procesar los datos de individuos (árboles)
 * @param {string} idConglomerado - ID del conglomerado
 * @returns {Object} - Objeto con los datos procesados y estados del hook
 */
const useIndividuoView = (idConglomerado) => {
    const [individuos, setIndividuos] = useState([]);
    const [individuosAgrupados, setIndividuosAgrupados] = useState({
        Brinzal: [],
        Latizal: [],
        Fustal: [],
        'Fustal Grande': []
    });
    const [subparcelas, setSubparcelas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para agrupar los individuos por tamaño
    const agruparPorTamaño = (individuos) => {
        const grupos = {
            Brinzal: [],
            Latizal: [],
            Fustal: [],
            'Fustal Grande': []
        };

        individuos.forEach(individuo => {
            const tamaño = individuo.tamaño_individuo;

            // Si el tamaño existe y corresponde a uno de nuestros grupos
            if (tamaño && grupos.hasOwnProperty(tamaño)) {
                grupos[tamaño].push(individuo);
            } else {
                // Si no tiene tamaño o es uno desconocido, podemos asignarlo a otra categoría o ignorarlo
                console.warn(`Árbol con ID ${individuo.id} tiene un tamaño no reconocido: ${tamaño}`);
            }
        });

        return grupos;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Obtener datos de individuos y coordenadas en paralelo
                const [individuosData, coordenadasData] = await Promise.all([
                    fetchIndividuosByConglomerado(idConglomerado),
                    fetchCoordenadas()
                ]);

                setSubparcelas(coordenadasData || []);

                // Procesar los individuos añadiendo sus coordenadas
                if (individuosData && coordenadasData) {
                    const individuosConCoordenadas = individuosData.map(individuo => {
                        // Buscar la subparcela correspondiente al individuo
                        const subparcelaCorrespondiente = coordenadasData.find(
                            subparcela => subparcela.id === individuo.id_subparcela
                        );

                        // Si encontramos la subparcela y el individuo tiene azimut y distancia
                        if (
                            subparcelaCorrespondiente &&
                            individuo.azimut !== undefined &&
                            individuo.distancia_del_centro !== undefined
                        ) {
                            // Calcular las nuevas coordenadas
                            const { latitud, longitud } = calculateCoordinates(
                                subparcelaCorrespondiente.latitud,
                                subparcelaCorrespondiente.longitud,
                                individuo.azimut,
                                individuo.distancia_del_centro
                            );

                            // Devolver el individuo con las coordenadas calculadas
                            return {
                                ...individuo,
                                latitud,
                                longitud
                            };
                        }

                        // Si no se encontró la subparcela o faltan datos, devolver el individuo sin cambios
                        return individuo;
                    });

                    // Guardar los individuos procesados
                    setIndividuos(individuosConCoordenadas);

                    // Agrupar los individuos por tamaño
                    const grupos = agruparPorTamaño(individuosConCoordenadas);
                    setIndividuosAgrupados(grupos);

                }
            } catch (err) {
                console.error('Error en useIndividuoView:', err);
                setError(err.message || 'Error al obtener datos');
            } finally {
                setLoading(false);
            }
        };

        if (idConglomerado) {
            fetchData();
        }
    }, [idConglomerado]);

    return {
        individuos,
        individuosAgrupados,
        subparcelas,
        loading,
        error
    };
};

export default useIndividuoView;