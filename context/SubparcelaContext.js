// context/SubparcelaContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCoordenadas } from '../supabase/getCoordenadas';
import { useBrigadista } from './BrigadistaContext';

const SubparcelaContext = createContext();

export const SubparcelaProvider = ({ children }) => {
  const { brigadista } = useBrigadista();
  const [subparcelas, setSubparcelas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarSubparcelas = async () => {
      if (brigadista) {
        setLoading(true);
        const data = await getCoordenadas(brigadista);
        setSubparcelas(data);
        setLoading(false);
      }
    };

    cargarSubparcelas();
  }, [brigadista]);

  return (
    <SubparcelaContext.Provider value={{ subparcelas, loading }}>
      {children}
    </SubparcelaContext.Provider>
  );
};

export const useSubparcelas = () => useContext(SubparcelaContext);
