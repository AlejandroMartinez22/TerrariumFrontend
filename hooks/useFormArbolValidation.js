import { useState, useEffect } from 'react';

/**
 * Hook personalizado mejorado para validar el formulario de registro de individuos
 * 
 * @param {Object} initialValues - Valores iniciales del formulario
 * @returns {Object} - Estado, errores, validaciones y métodos para manejar el formulario
 */

export const useFormArbolValidation = (initialValues = {}) => {
  // Estado para los valores del formulario
    const [values, setValues] = useState(initialValues);
        
    // Estado para los errores de validación
    const [errors, setErrors] = useState({});
        
    // Estado para los mensajes de error
    const [errorMessages, setErrorMessages] = useState({});
        
    // Estado para validez del formulario
    const [isValid, setIsValid] = useState(false);

    // Validar límites para entradas numéricas
    const restrictNumericInput = (field, value, min, max, allowDecimals = true) => {
        // Si está vacío, permitir
        if (value === '') return value;
            
        // Eliminar caracteres no numéricos excepto punto decimal
        let filteredValue = value.replace(/[^\d.]/g, '');
            
        // Manejar casos especiales primero
        // 1. Si es solo un punto, convertirlo a "0."
        if (filteredValue === '.') {
        filteredValue = '0.';
        }
            
        // 2. Si contiene un punto decimal
        if (filteredValue.includes('.')) {
        const parts = filteredValue.split('.');
                
        // Normalizar la parte entera (antes del punto)
        if (parts[0] === '' || parts[0] === '0' || /^0+$/.test(parts[0])) {
            // Si es vacío o solo ceros, convertir a un solo "0"
            parts[0] = '0';
        } else {
            // Si comienza con ceros pero tiene otros números, eliminar ceros iniciales
            parts[0] = parts[0].replace(/^0+/, '');
        }
                
        // Limitar a un decimal (parte después del punto)
        if (parts.length > 1 && parts[1].length > 1) {
            parts[1] = parts[1].substring(0, 1);
        }
                
        // Reconstruir el valor
        filteredValue = parts[0] + '.' + (parts.length > 1 ? parts[1] : '');
        } 
        // 3. Si no contiene punto decimal
        else {
        // Si es solo ceros, dejar solo uno
        if (/^0+$/.test(filteredValue)) {
            filteredValue = '0';
        } 
        // Si comienza con ceros seguidos de otros números, eliminar ceros iniciales
        else if (/^0+[1-9]/.test(filteredValue)) {
            filteredValue = filteredValue.replace(/^0+/, '');
        }
        }
            
        // Si no se permiten decimales, eliminar todo después del punto
        if (!allowDecimals && filteredValue.includes('.')) {
        filteredValue = filteredValue.split('.')[0];
        }
            
        // Si queda vacío después de toda la limpieza, establecer como "0"
        if (filteredValue === '') {
        filteredValue = '0';
        }
            
        // Evitar que exceda el valor máximo
        const numValue = parseFloat(filteredValue);
        if (!isNaN(numValue)) {
        if (numValue > max) {
            if (max < 10) {
            filteredValue = max.toString();
            } else {
            const maxStr = max.toString();
            if (filteredValue.length > maxStr.length) {
                filteredValue = filteredValue.substring(0, maxStr.length);
            }
            }
        }
        }
            
        return filteredValue;
    };
        
    // Método para manejar cambios en los valores con restricciones
    const handleChange = (field, rawValue) => {
        let value = rawValue;
            
        // Aplicar restricciones específicas según el campo
        switch (field) {
        case 'azimut':
            value = restrictNumericInput(field, rawValue, 0, 359);
            break;
        case 'distanciaCentro':
            value = restrictNumericInput(field, rawValue, 0, 15);
            break;
        case 'diametro':
            value = restrictNumericInput(field, rawValue, 2.5, 300);
            break;
        case 'distanciaHorizontal':
            value = restrictNumericInput(field, rawValue, 0, 40);
            break;
        case 'anguloVistoBajo':
        case 'anguloVistoAlto':
            value = restrictNumericInput(field, rawValue, 0, 45);
            break;
        case 'penetracion':
            value = restrictNumericInput(field, rawValue, 0.1, 20);
            break;
        default:
            break;
        }
            
        setValues(prev => ({
        ...prev,
        [field]: value
        }));
            
        // Validar el campo inmediatamente
        validateField(field, value);
    };
        
    // Validar un campo específico
    const validateField = (field, value) => {
        const newErrors = { ...errors };
        const newErrorMessages = { ...errorMessages };
            
        const validateNumericField = (value, min, max) => {
        // Si está vacío, marcar como error para validación real
        if (!value || value.trim() === '') {
            newErrors[field] = true;
            newErrorMessages[field] = ''; // No mostrar mensaje de error para campos vacíos
            return;
        }
            
        const num = parseFloat(value);
            
        if (num < min) {
            newErrors[field] = true;
            newErrorMessages[field] = `Debe ser mayor o igual a ${min}`;
            return;
        }
            
        if (num > max) {
            newErrors[field] = true;
            newErrorMessages[field] = `Debe ser menor o igual a ${max}`;
            return;
        }
            
        newErrors[field] = false;
        newErrorMessages[field] = '';
        };
            
        switch (field) {
        case 'azimut':
            validateNumericField(value, 0, 359);
            break;
                
        case 'distanciaCentro':
            validateNumericField(value, 0, 15);
            break;
                
        case 'diametro':
            validateNumericField(value, 2.5, 300);
            break;
                
        case 'distanciaHorizontal':
            validateNumericField(value, 0, 40);
            break;
                
        case 'anguloVistoBajo':
            validateNumericField(value, 0, 45);
            break;
                
        case 'anguloVistoAlto':
            validateNumericField(value, 0, 45);
            break;
                
        case 'penetracion':
            // Si el campo no es requerido basado en la condición, no validar
            if (values.condicion === 'MP' || values.condicion === 'TM' || values.condicion === 'TV') {
            validateNumericField(value, 0.1, 20);
            } else {
            newErrors[field] = false;
            newErrorMessages[field] = '';
            }
            break;
                
        default:
            break;
        }
            
        setErrors(newErrors);
        setErrorMessages(newErrorMessages);
            
        // Actualizar la validez general del formulario
        checkFormValidity(newErrors, { ...values, [field]: value });
    };
        
    // Validar el formulario completo
    const validateForm = () => {
        const newErrors = {};
        const newErrorMessages = {};
            
        // Validar azimut (0-359)
        if (!values.azimut || values.azimut.trim() === '') {
        newErrors.azimut = true;
        newErrorMessages.azimut = '';
        } else {
        const num = parseFloat(values.azimut);
        if (num < 0) {
            newErrors.azimut = true;
            newErrorMessages.azimut = 'Debe ser mayor o igual a 0';
        } else if (num > 359) {
            newErrors.azimut = true;
            newErrorMessages.azimut = 'Debe ser menor o igual a 359';
        } else {
            newErrors.azimut = false;
            newErrorMessages.azimut = '';
        }
        }
            
        // Validar distancia del centro (0-15)
        if (!values.distanciaCentro || values.distanciaCentro.trim() === '') {
        newErrors.distanciaCentro = true;
        newErrorMessages.distanciaCentro = '';
        } else {
        const num = parseFloat(values.distanciaCentro);
        if (num < 0) {
            newErrors.distanciaCentro = true;
            newErrorMessages.distanciaCentro = 'Debe ser mayor o igual a 0';
        } else if (num > 15) {
            newErrors.distanciaCentro = true;
            newErrorMessages.distanciaCentro = 'Debe ser menor o igual a 15';
        } else {
            newErrors.distanciaCentro = false;
            newErrorMessages.distanciaCentro = '';
        }
        }
            
        // Validar diámetro (2.5-300)
        if (!values.diametro || values.diametro.trim() === '') {
        newErrors.diametro = true;
        newErrorMessages.diametro = '';
        } else {
        const num = parseFloat(values.diametro);
        if (num < 2.5) {
            newErrors.diametro = true;
            newErrorMessages.diametro = 'Debe ser mayor o igual a 2.5';
        } else if (num > 300) {
            newErrors.diametro = true;
            newErrorMessages.diametro = 'Debe ser menor o igual a 300';
        } else {
            newErrors.diametro = false;
            newErrorMessages.diametro = '';
        }
        }
            
        // Validar distancia horizontal (0-40)
        if (!values.distanciaHorizontal || values.distanciaHorizontal.trim() === '') {
        newErrors.distanciaHorizontal = true;
        newErrorMessages.distanciaHorizontal = '';
        } else {
        const num = parseFloat(values.distanciaHorizontal);
        if (num < 0) {
            newErrors.distanciaHorizontal = true;
            newErrorMessages.distanciaHorizontal = 'Debe ser mayor o igual a 0';
        } else if (num > 40) {
            newErrors.distanciaHorizontal = true;
            newErrorMessages.distanciaHorizontal = 'Debe ser menor o igual a 40';
        } else {
            newErrors.distanciaHorizontal = false;
            newErrorMessages.distanciaHorizontal = '';
        }
        }
            
        // Validar ángulo visto hacia abajo (0-45)
        if (!values.anguloVistoBajo || values.anguloVistoBajo.trim() === '') {
        newErrors.anguloVistoBajo = true;
        newErrorMessages.anguloVistoBajo = '';
        } else {
        const num = parseFloat(values.anguloVistoBajo);
        if (num < 0) {
            newErrors.anguloVistoBajo = true;
            newErrorMessages.anguloVistoBajo = 'Debe ser mayor o igual a 0';
        } else if (num > 45) {
            newErrors.anguloVistoBajo = true;
            newErrorMessages.anguloVistoBajo = 'Debe ser menor o igual a 45';
        } else {
            newErrors.anguloVistoBajo = false;
            newErrorMessages.anguloVistoBajo = '';
        }
        }
            
        // Validar ángulo visto hacia arriba (0-45)
        if (!values.anguloVistoAlto || values.anguloVistoAlto.trim() === '') {
        newErrors.anguloVistoAlto = true;
        newErrorMessages.anguloVistoAlto = '';
        } else {
        const num = parseFloat(values.anguloVistoAlto);
        if (num < 0) {
            newErrors.anguloVistoAlto = true;
            newErrorMessages.anguloVistoAlto = 'Debe ser mayor o igual a 0';
        } else if (num > 45) {
            newErrors.anguloVistoAlto = true;
            newErrorMessages.anguloVistoAlto = 'Debe ser menor o igual a 45';
        } else {
            newErrors.anguloVistoAlto = false;
            newErrorMessages.anguloVistoAlto = '';
        }
        }
            
        // Validar penetración (0.1-20) solo si condición es MP, TM o TV
        if (values.condicion === 'MP' || values.condicion === 'TM' || values.condicion === 'TV') {
        if (!values.penetracion || values.penetracion.trim() === '') {
            newErrors.penetracion = true;
            newErrorMessages.penetracion = '';
        } else {
            const num = parseFloat(values.penetracion);
            if (num < 0.1) {
            newErrors.penetracion = true;
            newErrorMessages.penetracion = 'Debe ser mayor o igual a 0.1';
            } else if (num > 20) {
            newErrors.penetracion = true;
            newErrorMessages.penetracion = 'Debe ser menor o igual a 20';
            } else {
            newErrors.penetracion = false;
            newErrorMessages.penetracion = '';
            }
        }
        } else {
        newErrors.penetracion = false;
        newErrorMessages.penetracion = '';
        }
            
        setErrors(newErrors);
        setErrorMessages(newErrorMessages);
            
        // Actualizar la validez del formulario basado en los errores calculados
        checkFormValidity(newErrors, values);
            
        // Devolver si el formulario es válido para uso inmediato
        return !Object.values(newErrors).some(Boolean);
    };

    // Verificar la validez del formulario cuando cambian los valores
    const checkFormValidity = (currentErrors, currentValues) => {
        // Usar el objeto de errores que se pasa como parámetro o el estado actual
        const errorsToCheck = currentErrors || errors;
        const valuesToCheck = currentValues || values;
        
        // Verificar los campos numéricos requeridos
        const requiredNumericFields = [
        'azimut', 
        'distanciaCentro', 
        'diametro', 
        'distanciaHorizontal',
        'anguloVistoBajo', 
        'anguloVistoAlto'
        ];
            
        // Añadir penetración si la condición es MP, TM o TV
        if (valuesToCheck.condicion === 'MP' || valuesToCheck.condicion === 'TM' || valuesToCheck.condicion === 'TV') {
        requiredNumericFields.push('penetracion');
        }
            
        // Verificar si todos los campos requeridos tienen valores válidos
        const hasAllRequiredValues = requiredNumericFields.every(field => 
        valuesToCheck[field] && valuesToCheck[field].trim() !== ''
        );
            
        // Verificar que no haya errores en ningún campo
        const hasNoErrors = !Object.values(errorsToCheck).some(Boolean);
            
        // El formulario es válido si todos los campos requeridos tienen valores y no hay errores
        const formValid = hasAllRequiredValues && hasNoErrors;
        
        setIsValid(formValid);
        return formValid;
    };
        
    // Efecto para validar el formulario cuando cambia la condición
    useEffect(() => {
        // Limpiar penetración si la condición no es MP, TM o TV
        if (!['MP', 'TM', 'TV'].includes(values.condicion)) {
        setValues(prev => ({
            ...prev,
            penetracion: ""
        }));
        }
        
        // Validar todo el formulario cuando cambia la condición
        validateForm();
    }, [values.condicion]);
    
    // Efecto para validar el formulario completo cuando se inicializa o cambian los valores
    useEffect(() => {
        validateForm();
    }, []);

    return {
        values,
        errors,
        errorMessages,
        isValid,
        handleChange,
        validateForm,
        validateField,
        setValues,
        checkFormValidity
    };
};