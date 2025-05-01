import { useState, useEffect } from 'react';

/**
 * Hook para validar números enteros con límites opcionales.
 */
const useValidacionEntero = (initialValue = '', maxValue = null, minValue = null) => {
    const safeInitialValue = initialValue !== null && initialValue !== undefined 
        ? String(initialValue) 
        : '';

    const [value, setValue] = useState(safeInitialValue);
    const [error, setError] = useState('');
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        validate(value);
    }, [value]);

    // Función para validar el número ingresado
    const validate = (inputValue) => {
        // Asegura que el valor sea un string válido
        if (!inputValue) {
            setError('');
            setIsValid(false);
            return;
        }

        // Verifica que el formato sea válido: solo números enteros
        if (!/^\d+$/.test(inputValue)) {
            setError('Ingrese solo números enteros');
            setIsValid(false);
            return;
        }

        // Convierte el valor a número entero
        const numValue = parseInt(inputValue, 10);

        // Verifica si es un número válido
        if (isNaN(numValue)) {
            setError('Valor no válido');
            setIsValid(false);
            return;
        }

        // Valida el rango mínimo y máximo permitido
        if (minValue !== null && numValue < minValue) {
            setError(`El valor mínimo es ${minValue}`);
            setIsValid(false);
            return;
        }

        // Verifica el valor máximo permitido
        if (maxValue !== null && numValue > maxValue) {
            setError(`El valor máximo es ${maxValue}`);
            setIsValid(false);
            return;
        }

        setError('');
        setIsValid(true);
    };

    // Maneja el cambio de valor y restringe la entrada a solo números
    const handleValueChange = (newValue) => {
        const stringValue = String(newValue);
        if (stringValue === '' || /^\d+$/.test(stringValue)) {
            setValue(stringValue);
        }
    };

    return [value, handleValueChange, error, isValid];
};

export default useValidacionEntero;