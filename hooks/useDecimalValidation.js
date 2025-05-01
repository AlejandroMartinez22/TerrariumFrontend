import { useState, useEffect } from 'react';

/**
 * Hook personalizado para validar números decimales.
 * 
 * @param {string} initialValue - Valor inicial del campo.
 * @param {number} maxValue - Valor máximo permitido (opcional).
 * @param {number} minValue - Valor mínimo permitido (opcional).
 * @returns {[string, function, string, boolean]} - [valor, setValor, mensajeError, esValido].
 */
const useDecimalValidation = (initialValue = '', maxValue = null, minValue = null) => {
    // Garantiza que el valor inicial sea un string válido
    const safeInitialValue = initialValue !== null && initialValue !== undefined 
        ? String(initialValue) 
        : '';

    const [value, setValue] = useState(safeInitialValue);
    const [error, setError] = useState('');
    const [isValid, setIsValid] = useState(false);

    // Valida el valor cada vez que cambia
    useEffect(() => {
        validate(value);
    }, [value]);

    /**
     * Función para validar el número ingresado.
     */
    const validate = (inputValue) => {
        if (inputValue === null || inputValue === undefined) {
            inputValue = '';
        }

        // Si el campo está vacío, no genera error pero tampoco es válido
        if (!inputValue || inputValue === '') {
            setError('');
            setIsValid(false);
            return;
        }

        // Verifica que el formato sea válido: números enteros o decimales
        if (!/^(\d*\.?\d+|\d+\.?\d*)$/.test(inputValue)) {
            setError('Formato no válido');
            setIsValid(false);
            return;
        }

        const numValue = parseFloat(inputValue);

        // Verifica si es un número válido
        if (isNaN(numValue)) {
            setError('Valor no válido');
            setIsValid(false);
            return;
        }

        // Valida el rango mínimo permitido
        if (minValue !== null && numValue < minValue) {
            setError(`El valor mínimo es ${minValue}`);
            setIsValid(false);
            return;
        }

        // Valida el rango máximo permitido
        if (maxValue !== null && numValue > maxValue) {
            setError(`El valor máximo es ${maxValue}`);
            setIsValid(false);
            return;
        }

        // Si todo es correcto, marca el valor como válido
        setError('');
        setIsValid(true);
    };

    /**
     * Maneja el cambio del valor ingresado, asegurando un formato numérico válido.
     */
    const handleValueChange = (newValue) => {
        if (newValue === null || newValue === undefined) {
            setValue('');
            return;
        }

        const stringValue = String(newValue);
        
        // Permite solo números y un punto decimal
        if (stringValue === '' || /^(\d*\.?\d*|\.\d*)$/.test(stringValue)) {
            setValue(stringValue);
        }
    };

    return [value, handleValueChange, error, isValid];
};

export default useDecimalValidation;