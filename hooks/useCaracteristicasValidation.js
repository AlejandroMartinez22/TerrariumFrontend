    // hooks/useCaracteristicasValidation.js
    import { useState, useEffect } from 'react';

    /**
     * Hook personalizado para manejar validaciones de coberturas y afectaciones
     */

    const useCaracteristicasValidation = () => {
    // Estados para coberturas
    const [selectedCobertura, setSelectedCobertura] = useState("Seleccionar");
    const [porcentajeCobertura, setPorcentajeCobertura] = useState("");
    const [coberturas, setCoberturas] = useState([]);
    const [coberturasError, setCoberturasError] = useState("");

    // Estados para afectaciones
    const [selectedAfectacion, setSelectedAfectacion] = useState("Seleccionar");
    const [selectedSeveridad, setSelectedSeveridad] = useState("Seleccionar");
    const [afectaciones, setAfectaciones] = useState([]);
    const [afectacionesError, setAfectacionesError] = useState("");

    // Función para validar el porcentaje (1-99)
    const validarPorcentaje = (texto) => {
        const numero = parseInt(texto);
        if (isNaN(numero) || numero < 1 || numero > 99) {
        return false;
        }
        return true;
    };

    // Calcula la suma total de los porcentajes de cobertura
    const calcularSumaPorcentajes = () => {
        return coberturas.reduce((total, item) => total + parseInt(item.porcentaje), 0);
    };

    // Validar si se puede agregar una nueva cobertura
    const validarNuevaCobertura = (nuevoPorcentaje) => {
        const porcentajeNum = parseInt(nuevoPorcentaje);
        
        // Verificar máximo de 4 coberturas
        if (coberturas.length >= 4) {
        setCoberturasError("Máximo 4 coberturas permitidas");
        return false;
        }
        
        // Verificar que la suma no exceda 100%
        const sumaActual = calcularSumaPorcentajes();
        if (sumaActual + porcentajeNum > 100) {
        setCoberturasError(`La suma de porcentajes no puede superar 100% (actual: ${sumaActual}%)`);
        return false;
        }
        
        // Verificar si ya existe una cobertura con el mismo tipo
        if (coberturas.some(item => item.tipo === selectedCobertura)) {
        setCoberturasError("Esta cobertura ya ha sido agregada");
        return false;
        }
        
        setCoberturasError("");
        return true;
    };

    // Validar si se puede agregar una nueva afectación
    const validarNuevaAfectacion = () => {
        // Verificar máximo de 4 afectaciones
        if (afectaciones.length >= 4) {
        setAfectacionesError("Máximo 4 afectaciones permitidas");
        return false;
        }
        
        // Verificar si ya existe una afectación con el mismo tipo
        if (afectaciones.some(item => item.tipo === selectedAfectacion)) {
        setAfectacionesError("Esta afectación ya ha sido agregada");
        return false;
        }
        
        setAfectacionesError("");
        return true;
    };

    // Función para agregar una cobertura
    const agregarCobertura = () => {
        if (
        selectedCobertura !== "Seleccionar" && 
        porcentajeCobertura.trim() !== "" &&
        validarPorcentaje(porcentajeCobertura)
        ) {
        if (validarNuevaCobertura(porcentajeCobertura)) {
            const nuevaCobertura = {
            tipo: selectedCobertura,
            porcentaje: porcentajeCobertura
            };
            
            setCoberturas([...coberturas, nuevaCobertura]);
            setSelectedCobertura("Seleccionar");
            setPorcentajeCobertura("");
        }
        }
    };

    // Función para eliminar una cobertura
    const eliminarCobertura = (cobertura) => {
        setCoberturas(coberturas.filter(item => item.tipo !== cobertura.tipo));
        setCoberturasError("");
    };

    // Función para agregar una afectación
    const agregarAfectacion = () => {
        if (
        selectedAfectacion !== "Seleccionar" && 
        selectedSeveridad !== "Seleccionar"
        ) {
        if (validarNuevaAfectacion()) {
            const nuevaAfectacion = {
            tipo: selectedAfectacion,
            severidad: selectedSeveridad
            };
            
            setAfectaciones([...afectaciones, nuevaAfectacion]);
            setSelectedAfectacion("Seleccionar");
            setSelectedSeveridad("Seleccionar");
        }
        }
    };

    // Función para eliminar una afectación
    const eliminarAfectacion = (afectacion) => {
        setAfectaciones(afectaciones.filter(item => item.tipo !== afectacion.tipo));
        setAfectacionesError("");
    };

    // Calcular si el botón de agregar cobertura está habilitado
    const botonCoberturasHabilitado = 
        selectedCobertura !== "Seleccionar" && 
        porcentajeCobertura.trim() !== "" &&
        validarPorcentaje(porcentajeCobertura) &&
        !coberturas.some(item => item.tipo === selectedCobertura) &&
        coberturas.length < 4 &&
        (calcularSumaPorcentajes() + parseInt(porcentajeCobertura || 0) <= 100);
    
    // Calcular si el botón de agregar afectación está habilitado
    const botonAfectacionesHabilitado = 
        selectedAfectacion !== "Seleccionar" && 
        selectedSeveridad !== "Seleccionar" &&
        !afectaciones.some(item => item.tipo === selectedAfectacion) &&
        afectaciones.length < 4;

    // Limpiar estados
    const limpiarEstados = () => {
        setCoberturas([]);
        setAfectaciones([]);
        setSelectedCobertura("Seleccionar");
        setPorcentajeCobertura("");
        setSelectedAfectacion("Seleccionar");
        setSelectedSeveridad("Seleccionar");
        setCoberturasError("");
        setAfectacionesError("");
    };

    return {
        // Estados
        selectedCobertura,
        setSelectedCobertura,
        porcentajeCobertura,
        setPorcentajeCobertura,
        coberturas,
        setCoberturas,
        coberturasError,
        
        selectedAfectacion,
        setSelectedAfectacion,
        selectedSeveridad,
        setSelectedSeveridad,
        afectaciones,
        setAfectaciones,
        afectacionesError,
        
        // Funciones
        agregarCobertura,
        eliminarCobertura,
        agregarAfectacion,
        eliminarAfectacion,
        limpiarEstados,
        calcularSumaPorcentajes,
        
        // Estados de botones
        botonCoberturasHabilitado,
        botonAfectacionesHabilitado
    };
    };

    export default useCaracteristicasValidation;