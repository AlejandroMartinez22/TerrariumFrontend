import { useState, useEffect } from 'react';

/**
 * Hook personalizado para calcular el tamaño del individuo y la altura total
 * basado en los valores de diámetro, distancia horizontal y ángulos.
 * 
 * @param {Object} values - Objeto con los valores del formulario
 * @returns {Object} - Objeto con los valores calculados y funciones de actualización
 */
export const useCalculosIndividuoArboreo = (values) => {
    const [tamanoIndividuo, setTamanoIndividuo] = useState('Por determinar');
    const [alturaTotal, setAlturaTotal] = useState('0.0');

    // Función para calcular el tamaño del individuo basado en el diámetro
    const calcularTamanoIndividuo = (diametro) => {
        if (!diametro || isNaN(parseFloat(diametro))) {
        return 'Por determinar';
        }
        
        const diametroNum = parseFloat(diametro);
        
        if (diametroNum < 2.5) {
        return 'Brinzal';
        } else if (diametroNum >= 2.5 && diametroNum < 10) {
        return 'Latizal';
        } else if (diametroNum >= 10 && diametroNum < 30) {
        return 'Fustal';
        } else if (diametroNum >= 30) {
        return 'Fustal Grande';
        }
        
        return 'Por determinar';
    };

    // Función para calcular la altura total
    const calcularAlturaTotal = (distanciaHorizontal, anguloVistoBajo, anguloVistoAlto) => {
        if (
        !distanciaHorizontal || 
        !anguloVistoBajo || 
        !anguloVistoAlto ||
        isNaN(parseFloat(distanciaHorizontal)) ||
        isNaN(parseFloat(anguloVistoBajo)) ||
        isNaN(parseFloat(anguloVistoAlto))
        ) {
        return '0.0';
        }
        
        const distancia = parseFloat(distanciaHorizontal);
        // Convertir ángulos de grados a radianes
        const anguloBajo = parseFloat(anguloVistoBajo) * Math.PI / 180;
        const anguloAlto = parseFloat(anguloVistoAlto) * Math.PI / 180;
        
        // Aplicar la fórmula: Altura = distancia horizontal * (tan(angulo visto hacia abajo) + tan(angulo visto hacia arriba))
        const altura = distancia * (Math.tan(anguloBajo) + Math.tan(anguloAlto));
        
        // Redondear a un decimal
        return altura.toFixed(1);
    };

    // Efecto para actualizar los valores calculados cuando cambian los valores relevantes
    useEffect(() => {
        // Calcular tamaño del individuo
        const nuevoTamano = calcularTamanoIndividuo(values.diametro);
        setTamanoIndividuo(nuevoTamano);
        
        // Calcular altura total
        const nuevaAltura = calcularAlturaTotal(
        values.distanciaHorizontal,
        values.anguloVistoBajo,
        values.anguloVistoAlto
        );
        setAlturaTotal(nuevaAltura);
    }, [
        values.diametro,
        values.distanciaHorizontal,
        values.anguloVistoBajo,
        values.anguloVistoAlto
    ]);

    return {
        tamanoIndividuo,
        alturaTotal,
        calcularTamanoIndividuo,
        calcularAlturaTotal
    };
};