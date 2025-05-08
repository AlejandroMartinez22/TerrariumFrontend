import { useState, useEffect } from 'react';
import { verificarCampamentoExistente } from '../api';

export function useCampamentoVerification() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [existeCampamento, setExisteCampamento] = useState(false);
  const [idCampamento, setIdCampamento] = useState(null);
  const [error, setError] = useState(null);

  const verificarCampamento = async () => {
    setIsVerifying(true);
    setError(null);
    
    try {
      const resultado = await verificarCampamentoExistente();
      
      if (resultado && resultado.success) {
        setExisteCampamento(resultado.existeCampamento);
        setIdCampamento(resultado.idCampamento);
      } else {
        setError('No se pudo verificar el campamento');
      }
    } catch (err) {
      setError(err.message || 'Error al verificar campamento');
      console.error('Error en verificarCampamento hook:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  // Método para actualizar el estado después de crear o eliminar un campamento
  const actualizarEstadoCampamento = (existe, id = null) => {
    setExisteCampamento(existe);
    setIdCampamento(id);
  };

  return {
    isVerifying,
    existeCampamento,
    idCampamento,
    error,
    verificarCampamento,
    actualizarEstadoCampamento
  };
}