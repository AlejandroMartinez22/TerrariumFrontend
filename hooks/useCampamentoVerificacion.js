import { useState, useEffect } from 'react';
import { verificarCampamentoExistente } from '../api';

export function useCampamentoVerificacion() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [existeCampamento, setExisteCampamento] = useState(false);
  const [idCampamento, setIdCampamento] = useState(null);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);

  const verificarCampamento = async () => {
    console.log("🔍 Hook: Iniciando verificación de campamento");
    setIsVerifying(true);
    setError(null);
    setErrorDetails(null);
    
    try {
      const resultado = await verificarCampamentoExistente();
      console.log("🔍 Hook: Resultado recibido", resultado);
      
      // Mejoramos la validación para manejar respuestas inesperadas
      if (resultado && typeof resultado === 'object') {
        setExisteCampamento(resultado.existeCampamento || false);
        setIdCampamento(resultado.idCampamento || null);
        
        // Si hay un mensaje de error en la respuesta
        if (!resultado.success && resultado.message) {
          setError(resultado.message);
          setErrorDetails(resultado.errorDetails || null);
        }
      } else {
        // Si la respuesta no tiene la estructura esperada
        console.warn('⚠️ Respuesta inesperada de verificarCampamentoExistente:', resultado);
        setExisteCampamento(false);
        setError('Respuesta inesperada al verificar el campamento');
      }
    } catch (err) {
      console.error('❌ Error en verificarCampamento hook:', err);
      setExisteCampamento(false);
      setError(err.message || 'Error al verificar campamento');
    } finally {
      setIsVerifying(false);
      console.log("🔍 Hook: Verificación finalizada. Existe campamento:", existeCampamento);
    }
  };

  // El resto del código permanece igual
  const actualizarEstadoCampamento = (existe, id = null) => {
    setExisteCampamento(existe);
    setIdCampamento(id);
  };

  return {
    isVerifying,
    existeCampamento,
    idCampamento,
    error,
    errorDetails,
    verificarCampamento,
    actualizarEstadoCampamento
  };
}
