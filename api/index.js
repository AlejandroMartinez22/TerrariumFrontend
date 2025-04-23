    /*PARTE DEL INICIO DE SESIÓN, */
    /*CORRECTO, REVISADO EL 22/04 16:04 PM*/
    /*DOCUMENTADO*/
    

    import axios from 'axios';   // Importamos la librería Axios para hacer peticiones HTTP al backend
    import { getAuth } from 'firebase/auth';// Importamos la función getAuth de Firebase para manejar la autenticación del usuario

    // Configuramos la URL base del backend
    const API_URL = 'http://10.16.13.108:5000/api'; /* Esta IP debe ser la dirección local de la computadora donde se está ejecutando el servidor Express (backend)*/

    // Creamos una instancia de Axios preconfigurada con la URL base del backend
    const api = axios.create({
    baseURL: API_URL
    });

    // Interceptor para registrar todas las peticiones que se hagan desde esta instancia
    api.interceptors.request.use(request => {
    console.log('Enviando petición a:', request.url);
    return request;
    });

    // Interceptor para registrar todas las respuestas (o errores) que se reciban desde el backend
    api.interceptors.response.use(
    response => {
        console.log('Respuesta recibida de:', response.config.url, 'Status:', response.status);
        return response;
    },
    error => {
        console.error('Error en petición a:', error.config?.url, 'Error:', error.message);
        return Promise.reject(error);
    }
    );



    // Función para obtener el token actual del usuario autenticado en Firebase. Este token sirve para verificar la identidad del usuario con el backend.
    const getCurrentToken = async () => {
    const auth = getAuth(); // Obtener instancia de autenticación
    const user = auth.currentUser; // Obtener usuario actual
    if (user) { 
        return await user.getIdToken(); // Obtener token de sesión
    }
    throw new Error('Usuario no autenticado');
    };

    
    // Maneja errores de forma centralizada. Extrae el mensaje de error o muestra uno genérico.
    const handleError = (error) => {
    const errorMessage = error.response?.data?.message || 'Error de conexión';
    console.error('API Error:', errorMessage);
    throw new Error(errorMessage);
    };

    /* Envía el token al backend para que sea verificado, y obtiene los datos del usuario desde la base de datos (Supabase).*/
    export const verifyTokenAndGetUser = async (idToken) => {
    console.log('Enviando token para verificación...');
    try {
        const response = await api.post('/auth/verify-token', { idToken });
        console.log('Datos de usuario recibidos del backend:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al verificar token:', error);
        handleError(error);
    }
    };

    /*Consulta al backend para obtener el nombre de usuario asociado a un UID.*/
    export const getUserNameFromBackend = async (uid) => {
    console.log(`Solicitando nombre para UID: ${uid}`);
    try {
        const response = await api.get(`/auth/username/${uid}`);
        console.log(`Nombre recibido: ${response.data.nombre}`);
        return response.data.nombre;
    } catch (error) {
        console.error(`Error al obtener nombre para ${uid}:`, error);
        handleError(error);
    }
    };

    export const getInfoBrigadistaFromBackend = async () => {
        try {
          const token = await getCurrentToken();
          const response = await api.get('/brigadista/info', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          return response.data;
        } catch (error) {
          console.error('Error al obtener información del brigadista:', error);
          handleError(error);
        }
      };
      
      // Actualizar el estado del tutorial en el backend
      export const updateTutorialCompletadoInBackend = async (completado) => {
        try {
          const token = await getCurrentToken();
          const response = await api.post('/brigadista/tutorial', 
            { completado },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          return response.data;
        } catch (error) {
          console.error('Error al actualizar el estado del tutorial:', error);
          handleError(error);
        }
      };

      export const fetchCoordenadas = async () => {
        try {
          const token = await getCurrentToken();
          const response = await api.get('/coordenadas/subparcelas', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          console.log('Coordenadas recibidas del backend:', response.data.data.length);
          
          if (response.data.success) {
            return response.data.data;
          } else {
            throw new Error(response.data.message || 'Error al obtener coordenadas');
          }
        } catch (error) {
          console.error('Error al obtener coordenadas:', error);
          handleError(error);
        }
      };

      export const fetchCoordenadasCentroPoblado = async () => {
        try {
          const token = await getCurrentToken();
          const response = await api.get('/coordenadas/centro-poblado', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Coordenadas del centro poblado recibidas del backend:', response.data.data.length);
          if (response.data.success) {
            return response.data.data;
          } else {
            throw new Error(response.data.message || 'Error al obtener coordenadas del centro poblado');
          }
        } catch (error) {
          console.error('Error al obtener coordenadas del centro poblado:', error);
          handleError(error);
        }
      };

    // Exportamos la instancia de axios configurada para usar en otros archivos si es necesario
    export default api;