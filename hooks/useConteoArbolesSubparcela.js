import { useState, useEffect } from "react";
import { fetchIndividuosByConglomerado } from '../api'; // Ajusta la ruta según tu estructura

export const useConteoArbolesSubparcela = (idConglomerado, subparcelaId) => {
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
        
        // Filtrar solo los de la subparcela especificada por ID
        const individuosFiltrados = subparcelaId 
          ? todosIndividuos.filter(ind => ind.id_subparcela == subparcelaId)  // Usando == en lugar de === para manejar casos donde los tipos puedan ser diferentes (string vs number)
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
          if (individuo.tamaño_individuo in conteo) {
            conteo[individuo.tamaño_individuo]++;
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
  }, [idConglomerado, subparcelaId]);

  return { individuos, estadisticas, loading, error };
};