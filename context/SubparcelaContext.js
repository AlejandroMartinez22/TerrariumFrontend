// context/SubparcelaContext.js
import React, { createContext, useContext } from 'react';
import { useBrigadista } from './BrigadistaContext';
import { useCoordenadas } from '../hooks/useCoordenadas';

const SubparcelaContext = createContext();

export const SubparcelaProvider = ({ children }) => {
  const { brigadista } = useBrigadista();
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

export const useSubparcelas = () => useContext(SubparcelaContext);
