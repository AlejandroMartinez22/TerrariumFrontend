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
        // Si está vacío, permitir (la validación posterior se encargará de marcarlo como error)
        if (value === '') return value;
        
        // Eliminar caracteres no numéricos excepto punto decimal
        let filteredValue = value.replace(/[^\d.]/g, '');
        
        // Asegurar que solo hay un punto decimal
        const parts = filteredValue.split('.');
        if (parts.length > 2) {
        filteredValue = parts[0] + '.' + parts.slice(1).join('');
        }
        
        // Limitar a un decimal si hay punto
        if (parts.length === 2 && parts[1].length > 1) {
        filteredValue = parts[0] + '.' + parts[1].substring(0, 1);
        }
        
        // Si no se permiten decimales, eliminar todo después del punto
        if (!allowDecimals && filteredValue.includes('.')) {
        filteredValue = filteredValue.split('.')[0];
        }
        
        // Evitar que exceda el valor máximo
        const numValue = parseFloat(filteredValue);
        if (!isNaN(numValue)) {
        if (numValue > max) {
            if (max < 10) {
            // Para valores pequeños, limitar directamente
            filteredValue = max.toString();
            } else {
            // Para valores grandes, limitar a la misma cantidad de dígitos que el máximo
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

        // Si está vacío, no mostrar error (se manejará deshabilitando el botón)
        if (!value || value.trim() === '') {
            newErrors[field] = false;
            newErrorMessages[field] = '';
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
            // Solo validar si hay un valor ingresado
            if (value && value.trim() !== '') {
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
        checkFormValidity();
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
        
        // Validar penetración (0.1-20) solo si condición es MP o TM
        if (values.condicion === 'MP' || values.condicion === 'TM' || values.condicion === 'TV') {
            if (values.penetracion && values.penetracion.trim() !== '') {
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
            } else {
                // No marcar error si está vacío
                newErrors.penetracion = false;
                newErrorMessages.penetracion = '';
            }
        } else {
            newErrors.penetracion = false;
            newErrorMessages.penetracion = '';
        }
        
        setErrors(newErrors);
        setErrorMessages(newErrorMessages);
        
        // Comprobar si el formulario es válido
        const formIsValid = !Object.values(newErrors).some(Boolean);
        setIsValid(formIsValid);
        
        return formIsValid;
    };

    // Verificar la validez del formulario cuando cambian los valores
    const checkFormValidity = () => {
        // Verificar todos los campos requeridos
        const requiredFields = [
        'azimut', 
        'distanciaCentro', 
        'diametro', 
        'distanciaHorizontal',
        'anguloVistoBajo', 
        'anguloVistoAlto'
        ];
        
        // Añadir penetración si la condición es MP o TM
        if (values.condicion === 'MP' || values.condicion === 'TM' || values.condicion === 'TV') {
        requiredFields.push('penetracion');
        }
        
        // Verificar si todos los campos requeridos tienen valor y no tienen errores
        const hasAllValues = requiredFields.every(field => 
        values[field] && values[field].trim() !== ''
        );
        
        const hasNoErrors = !Object.values(errors).some(Boolean);
        
        setIsValid(hasAllValues && hasNoErrors);
    };
    
    // Efecto para validar el formulario cuando cambia la condición
    useEffect(() => {
        validateForm();
    }, [values.condicion]);
    
    return {
        values,
        errors,
        errorMessages,
        isValid,
        handleChange,
        validateForm,
        validateField,
        setValues
    };
};