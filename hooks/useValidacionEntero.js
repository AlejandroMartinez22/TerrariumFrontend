import { useState, useEffect } from 'react';

/**
 * Hook personalizado para validar números enteros
 * @param {string} initialValue - Valor inicial del campo
 * @param {number} maxValue - Valor máximo permitido (opcional)
 * @param {number} minValue - Valor mínimo permitido (opcional)
 * @returns {[string, function, string, boolean]} - [valor, setValor, mensajeError, esValido]
 */
const useValidacionEntero = (initialValue = '', maxValue = null, minValue = null) => {
  // Aseguramos que initialValue sea un string
    const safeInitialValue = initialValue !== null && initialValue !== undefined 
        ? String(initialValue) 
        : '';

    const [value, setValue] = useState(safeInitialValue);
    const [error, setError] = useState('');
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        validate(value);
    }, [value]);

    const validate = (inputValue) => {
        // Protección contra valores undefined o null
        if (inputValue === null || inputValue === undefined) {
        inputValue = '';
        }

        // Si está vacío, no mostramos error pero tampoco es válido
        if (!inputValue || inputValue === '') {
        setError('');
        setIsValid(false);
        return;
        }

        // Verificar si contiene caracteres que no sean dígitos
        if (!/^\d+$/.test(inputValue)) {
        setError('Ingrese solo números enteros');
        setIsValid(false);
        return;
        }

        const numValue = parseInt(inputValue, 10);

        // Verificar si es un número válido
        if (isNaN(numValue)) {
        setError('Valor no válido');
        setIsValid(false);
        return;
        }

        // Verificar valor mínimo si está definido
        if (minValue !== null && numValue < minValue) {
        setError(`El valor mínimo es ${minValue}`);
        setIsValid(false);
        return;
        }

        // Verificar valor máximo si está definido
        if (maxValue !== null && numValue > maxValue) {
        setError(`El valor máximo es ${maxValue}`);
        setIsValid(false);
        return;
        }

        // Todo correcto
        setError('');
        setIsValid(true);
    };

    // Esta función maneja el cambio del valor y restringe la entrada a solo dígitos
    const handleValueChange = (newValue) => {
        // Protección contra valores null o undefined
        if (newValue === null || newValue === undefined) {
        setValue('');
        return;
        }

        // Convertimos a string si es necesario
        const stringValue = String(newValue);
        
        // Solo permitimos dígitos o campo vacío
        if (stringValue === '' || /^\d+$/.test(stringValue)) {
        setValue(stringValue);
        }
    };

    return [value, handleValueChange, error, isValid];
};

export default useValidacionEntero;