/**
 * Ese hook permite verificar si un punto geográfico está dentro de 
 * una distancia máxima permitida con respecto a un punto central de referencia.
 * En este caso se usa para validar que los puntos de referencia se añadan a una distancia coherente del conglomerado
 * Pero podría usarse también en componentes que necesiten verificar distancias entre coordenadas o validar si un punto está dentro de una zona permitida.
 */

import { useState } from 'react';


// Se retorna un objeto con funciones para cálculos geoespaciales


export const useValidacionGeografica = () => {

    /**
     * Calcula la distancia entre dos puntos geográficos utilizando la fórmula de Haversine. Un método recomendado para calcular distancias geográficas
     * cortas a medianas en la superficie terrestre, considerando su curvatura.
     * 
     * Esta implementación específica:
     * - Utiliza el radio medio de la Tierra (6371 km)
     * - Convierte las coordenadas de grados decimales a radianes para el cálculo
     * - Devuelve la distancia en metros
     * 
     * lat1 - Latitud del primer punto en grados decimales
     * lon1 - Longitud del primer punto en grados decimales
     * lat2 - Latitud del segundo punto en grados decimales
     * lon2 - Longitud del segundo punto en grados decimales
     * returns {Number} ->  Distancia en metros entre los dos puntos
     */


    const calcularDistancia = (lat1, lon1, lat2, lon2) => {
        // Radio medio de la Tierra en metros (6371 kilómetros)
        const R = 6371e3; 
        
        // Convertimos las coordenadas de grados a radianes
        // Las funciones trigonométricas en JavaScript requieren ángulos en radianes

        const φ1 = (lat1 * Math.PI) / 180;  // φ (phi) representa la latitud en radianes
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;  // Δ (delta) representa la diferencia
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;  // λ (lambda) representa la longitud

        // Aplicación de la fórmula de Haversine:
        // a = sin²(Δφ/2) + cos(φ1)·cos(φ2)·sin²(Δλ/2)

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            
        // c = 2·atan2(√a, √(1−a))
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        // Distancia = radio de la Tierra · c
        const d = R * c;  // Resultado en metros

        return d;
    };

    /**
     * Verifica si un punto geográfico está dentro de la distancia máxima permitida respecto a un punto central de referencia
     *
     * punto - Punto a verificar con formato {latitude, longitude}
     *  centro - Punto central de referencia con formato {latitude, longitude}
     * distanciaMaxima - Distancia máxima permitida en metros
     * return {Object} Objeto con la propiedad 'valido' (true/false)
     */

    const validarDistanciaPunto = (punto, centro, distanciaMaxima) => {
        
        // Utilizar la función calcularDistancia para obtener la separación entre puntos
        const distancia = calcularDistancia(
            punto.latitude,
            punto.longitude,
            centro.latitude,
            centro.longitude
        );
        
        // Punto válido si está dentro de la distancia máxima permitida
        const valido = distancia <= distanciaMaxima;
        
        return { valido };
    };

    // Exponer las funciones que proporciona este hook
    return {
        calcularDistancia,
        validarDistanciaPunto
    };
};