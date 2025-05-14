import { useState, useEffect } from "react";
import { fetchIndividuosByConglomerado } from '../api'; // Ajusta la ruta según tu estructura

export const useIndividuos = (idConglomerado, subparcela) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [individuos, setIndividuos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    porTipo: {
      Brinzal: 0,
      Latizal: 0,
      Fustal: 0,
      "Fustal Grande": 0
    }
  });

  useEffect(() => {
    const cargarIndividuos = async () => {
      try {
        setLoading(true);
        
        // Obtener todos los individuos del conglomerado
        const todosIndividuos = await fetchIndividuosByConglomerado(idConglomerado);
        
        // Filtrar solo los de la subparcela especificada
        const individuosFiltrados = subparcela 
          ? todosIndividuos.filter(ind => ind.subparcela === subparcela)
          : todosIndividuos;
        
        setIndividuos(individuosFiltrados);
        
        // Calcular estadísticas
        const conteo = {
          Brinzal: 0,
          Latizal: 0,
          Fustal: 0,
          "Fustal Grande": 0
        };
        
        individuosFiltrados.forEach(individuo => {
          if (individuo.tamano in conteo) {
            conteo[individuo.tamano]++;
          }
        });
        
        setEstadisticas({
          total: individuosFiltrados.length,
          porTipo: conteo
        });
        
      } catch (err) {
        console.error("Error al cargar individuos:", err);
        setError("Error al cargar los individuos: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (idConglomerado) {
      cargarIndividuos();
    }
  }, [idConglomerado, subparcela]);

  return { individuos, estadisticas, loading, error };
};