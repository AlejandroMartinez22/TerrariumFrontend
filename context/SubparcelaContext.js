// importar React y el hook createContext para crear un contexto
import React, { createContext, useContext } from 'react';
// importar el hook useBrigadista para obtener la información del brigadista
import { useBrigadista } from './BrigadistaContext';
// importar el hook useCoordenadas para obtener las coordenadas de las subparcelas
import { useCoordenadas } from '../hooks/useCoordenadas';

// importar el hook useContext para acceder al contexto
const SubparcelaContext = createContext();

// Proveedor del contexto para envolver la aplicación
export const SubparcelaProvider = ({ children }) => {
  // Obtener la información del brigadista desde el contexto
  const { brigadista } = useBrigadista();
  // capturamos el retorno del hook useCoordenadas
  const {
    coordenadas: subparcelas,
    isLoading: loading,
    error,
    fetchCoordenadas,
  } = useCoordenadas(brigadista);


  return (
    <SubparcelaContext.Provider value={{ subparcelas, loading, error, fetchCoordenadas }}>
      {children}
    </SubparcelaContext.Provider>
  );
};

// Hook para acceder al contexto de subparcelas
export const useSubparcelas = () => useContext(SubparcelaContext);