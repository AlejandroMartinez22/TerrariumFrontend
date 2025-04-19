/*Este hook se usa para validar que el usuario en los campos de "Error en la medición" unicamente pueda ingresar números del 0 al 9.9, 
ya que valores más altos no tendrían mucho sentido en este contexto*/

    import { useState, useEffect } from 'react';

    /**
     * @param {string} initialValue - El valor inicial
     * @param {number} max - El valor máximo permitido (por defecto 9.9)
     * @param {number} maxDecimals - Número máximo de decimales permitidos (por defecto 1)
     * @returns {[string, function, string, boolean]} - [valor, función para actualizar valor, mensaje de error, es válido]
     */
    
    const useDecimalValidation = (initialValue = '', max = 9.9, maxDecimals = 1) => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState('');
    const [isValid, setIsValid] = useState(false);

    // Función para validar el formato y rango del valor
    useEffect(() => {
        if (value === '') {
        setError('');
        setIsValid(false);
        return;
        }

        // Verificar que sea un número válido
        if (!/^\d*\.?\d*$/.test(value)) {
        setError('Ingrese solo números');
        setIsValid(false);
        return;
        }

        const numValue = parseFloat(value);
        
        // Verificar que no sea NaN
        if (isNaN(numValue)) {
        setError('Valor no válido');
        setIsValid(false);
        return;
        }

        // Verificar el rango
        if (numValue < 0 || numValue > max) {
        setError(`El valor debe estar entre 0 y ${max}`);
        setIsValid(false);
        return;
        }

        // Verificar decimales
        const decimalPart = value.includes('.') ? value.split('.')[1] : '';
        if (decimalPart.length > maxDecimals) {
        setError(`Máximo ${maxDecimals} decimal${maxDecimals > 1 ? 'es' : ''}`);
        setIsValid(false);
        return;
        }

        // Todo está bien
        setError('');
        setIsValid(true);
    }, [value, max, maxDecimals]);

    // Función para actualizar el valor con formato correcto
    const handleChange = (newValue) => {
        // Permitir cadena vacía
        if (newValue === '') {
        setValue('');
        return;
        }

        // Verificar que solo contenga números y un punto decimal
        if (!/^\d*\.?\d*$/.test(newValue)) {
        return;
        }

        // Prevenir múltiples puntos decimales
        if (newValue.split('.').length > 2) {
        return;
        }

        // Limitar la cantidad de decimales
        if (newValue.includes('.')) {
        const [wholePart, decimalPart] = newValue.split('.');
        if (decimalPart.length > maxDecimals) {
            return;
        }
        }

        setValue(newValue);
    };

    return [value, handleChange, error, isValid];
    };

    export default useDecimalValidation;