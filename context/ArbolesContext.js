    import React, { createContext, useState, useContext } from 'react';

    // Crear el contexto
    const ArbolesContext = createContext();

    // Proveedor del contexto
    export const ArbolesProvider = ({ children }) => {
    // Estado para los árboles filtrados a mostrar en el mapa
    const [arbolesFiltrados, setArbolesFiltrados] = useState([]);
    
    // Estado para controlar si el mapa debe actualizar los árboles
    const [actualizarArboles, setActualizarArboles] = useState(false);
    
    // Estado para los tipos de árboles seleccionados
    const [tiposSeleccionados, setTiposSeleccionados] = useState({
        latizales: false,
        brinzales: false,
        fustales: false,
        fustalesGrandes: false,
    });

    // Función para actualizar los árboles filtrados
    const actualizarArbolesFiltrados = (arboles) => {
        setArbolesFiltrados(arboles);
        setActualizarArboles(true);
    };

    // Función para confirmar que los árboles ya fueron mostrados en el mapa
    const confirmarActualizacion = () => {
        setActualizarArboles(false);
    };

    // Función para actualizar los tipos seleccionados
    const actualizarTiposSeleccionados = (nuevosTipos) => {
        setTiposSeleccionados(nuevosTipos);
    };

    // Valores a proporcionar en el contexto
    const value = {
        arbolesFiltrados,
        actualizarArbolesFiltrados,
        actualizarArboles,
        confirmarActualizacion,
        tiposSeleccionados,
        actualizarTiposSeleccionados
    };

    return (
        <ArbolesContext.Provider value={value}>
        {children}
        </ArbolesContext.Provider>
    );
    };

    // Hook personalizado para usar el contexto
    export const useArboles = () => {
    const context = useContext(ArbolesContext);
    if (!context) {
        throw new Error('useArboles debe ser usado dentro de un ArbolesProvider');
    }
    return context;
    };