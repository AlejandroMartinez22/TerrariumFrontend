/*PARTE DEL INICIO DE SESIÓN, */
/*CORRECTO, REVISADO EL 22/04 16:04 PM*/
/*DOCUMENTADO*/

import axios from "axios"; // Importamos la librería Axios para hacer peticiones HTTP al backend
import { getAuth } from "firebase/auth"; // Importamos la función getAuth de Firebase para manejar la autenticación del usuario

// Configuramos la URL base del backend
const API_URL =
  "http://192.168.1.7:5000/api"; /* Esta IP debe ser la dirección local de la computadora donde se está ejecutando el servidor Express (backend)*/

// Creamos una instancia de Axios preconfigurada con la URL base del backend
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para registrar todas las peticiones que se hagan desde esta instancia
api.interceptors.request.use((request) => {
  console.log("Enviando petición a:", request.url);
  return request;
});

// Interceptor para registrar todas las respuestas (o errores) que se reciban desde el backend
api.interceptors.response.use(
  (response) => {
    console.log(
      "Respuesta recibida de:",
      response.config.url,
      "Status:",
      response.status
    );
    return response;
  },
  (error) => {
    console.error(
      "Error en petición a:",
      error.config?.url,
      "Error:",
      error.message
    );
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
  throw new Error("Usuario no autenticado");
};

// Maneja errores de forma centralizada. Extrae el mensaje de error o muestra uno genérico.
const handleError = (error) => {
  const errorMessage = error.response?.data?.message || "Error de conexión";
  console.error("API Error:", errorMessage);
  throw new Error(errorMessage);
};

/* Envía el token al backend para que sea verificado, y obtiene los datos del usuario desde la base de datos (Supabase).*/
export const verifyTokenAndGetUser = async (idToken) => {
  console.log("Enviando token para verificación...");
  try {
    const response = await api.post("/auth/verify-token", { idToken });
    return response.data;
  } catch (error) {
    console.error("Error al verificar token:", error);
    handleError(error);
  }
};

/*Consulta al backend para obtener el nombre de usuario asociado a un UID.*/
export const getUserNameFromBackend = async (uid) => {
  console.log(`Solicitando nombre para UID: ${uid}`);
  try {
    const response = await api.get(`/auth/username/${uid}`);
    return response.data.nombre;
  } catch (error) {
    console.error(`Error al obtener nombre para ${uid}:`, error);
    handleError(error);
  }
};

/*Consulta al backend para obtener la info del brigadista pasando por una verificacion de sesion.*/
export const getInfoBrigadistaFromBackend = async () => {
  try {
    const token = await getCurrentToken();
    const response = await api.get("/brigadista/info", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener información del brigadista:", error);
    handleError(error);
  }
};

// Actualizar el estado del tutorial en el backend
export const updateTutorialCompletadoInBackend = async (completado) => {
  try {
    const token = await getCurrentToken();
    const response = await api.post(
      "/brigadista/tutorial",
      { completado },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado del tutorial:", error);
    handleError(error);
  }
};

/*Consulta al backend para obtener la lista de coordenadas de las subparcelas.*/
export const fetchCoordenadas = async () => {
  try {
    const token = await getCurrentToken();
    const response = await api.get("/coordenadas/subparcelas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Error al obtener coordenadas");
    }
  } catch (error) {
    console.error("Error al obtener coordenadas:", error);
    handleError(error);
  }
};

/*Consulta al backend para obtener las coordenadas del centro poblado.*/
export const fetchCoordenadasCentroPoblado = async () => {
  try {
    const token = await getCurrentToken();
    const response = await api.get("/coordenadas/centro-poblado", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message ||
          "Error al obtener coordenadas del centro poblado"
      );
    }
  } catch (error) {
    console.error("Error al obtener coordenadas del centro poblado:", error);
    handleError(error);
  }
};

/*Funcion para obtener el siguiente id consultando en backend para asignarlo a un nuevo punto de referencia */
export const fetchSiguienteIdReferencia = async () => {
  try {
    const token = await getCurrentToken();
    const response = await api.get("/referencias/siguiente-id", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.siguienteId) {
      return response.data.siguienteId;
    } else {
      throw new Error(
        response.data.message || "Error al obtener ID de referencia"
      );
    }
  } catch (error) {
    console.error("Error al obtener siguiente ID de referencia:", error);
    handleError(error);
  }
};

//NUEVA FUNCION 
export const verificarCampamentoExistente = async () => {
  try {
    console.log("📤 Iniciando verificación de campamento...");
    const token = await getCurrentToken();
    
    if (!token) {
      console.error("❌ No se pudo obtener el token de autenticación");
      return { 
        success: false,
        message: "No se pudo obtener el token de autenticación",
        existeCampamento: false
      };
    }
    
    console.log("🔑 Token obtenido, realizando petición a /referencias/verificar-campamento");
    const response = await api.get("/referencias/verificar-campamento", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // Aumentamos el timeout para operaciones complejas
      timeout: 10000
    });
    
    console.log("✅ Respuesta recibida:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error en petición a: /referencias/verificar-campamento", error);
    
    // Información de diagnóstico ampliada
    let errorDetails = {
      message: error.message || "Error desconocido",
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    };
    
    console.error("📋 Detalles del error:", JSON.stringify(errorDetails, null, 2));
    
    // Manejo mejorado del error
    return { 
      success: false,
      message: `Error ${error.response?.status || ''}: ${error.message}`,
      existeCampamento: false,
      errorDetails: errorDetails
    };
  }
};

/*Funcion para guardar un nuevo punto de referencia en el backend.*/
export const guardarReferenciaEnBackend = async (
  puntoReferencia,
  cedulaBrigadista
) => {
  try {
    const token = await getCurrentToken();

    //guardamos las variables en un objeto para enviarlas al backend
    const puntoData = {
      id: puntoReferencia.id,
      latitud: puntoReferencia.latitude,
      longitud: puntoReferencia.longitude,
      descripcion: puntoReferencia.description,
      error: puntoReferencia.errorMedicion,
      tipo: puntoReferencia.tipo || "Referencia",
      cedula_brigadista: cedulaBrigadista,
    };

    //Llamamos al endpoint del backend para guardar el punto de referencia
    const response = await api.post("/referencias", puntoData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      return response.data.id;
    } else {
      throw new Error(response.data.message || "Error al guardar referencia");
    }
  } catch (error) {
    console.error("Error al guardar referencia:", error);
    handleError(error);
  }
};

/*Funcion para actualizar un punto de referencia en el backend.*/
export const actualizarReferenciaEnBackend = async (
  puntoReferencia,
  cedulaBrigadista
) => {
  try {
    // Obtenemos el token de autenticación del usuario actual
    const token = await getCurrentToken();

    //guardamos las variables en un objeto para enviarlas al backend
    const puntoData = {
      id: puntoReferencia.id,
      latitud: puntoReferencia.latitude,
      longitud: puntoReferencia.longitude,
      tipo: puntoReferencia.tipo,
      descripcion: puntoReferencia.description,
      error: puntoReferencia.errorMedicion,
      cedula_brigadista: cedulaBrigadista,
    };

    //Llamamos al endpoint del backend para actualizar el punto de referencia
    const response = await api.put(
      `/referencias/${puntoReferencia.id}`,
      puntoData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      return { success: true };
    } else {
      throw new Error(
        response.data.message || "Error al actualizar referencia"
      );
    }
  } catch (error) {
    console.error("Error al actualizar referencia:", error);
    return { success: false, error: error.message || error };
  }
};

/*Funcion para eliminar un punto de referencia en el backend.*/
export const eliminarReferenciaEnBackend = async (
  puntoId,
  cedulaBrigadista
) => {
  try {
    // Obtenemos el token de autenticación del usuario actual
    const token = await getCurrentToken();

    //Llamamos al endpoint del backend para eliminar el punto de referencia
    const response = await api.delete(`/referencias/${puntoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        cedula_brigadista: cedulaBrigadista,
      },
    });

    if (response.data.success) {
      // Si la respuesta es exitosa, retornamos el ID del punto eliminado
      return { success: true, data: response.data.data };
    } else {
      throw new Error(response.data.message || "Error al eliminar referencia");
    }
  } catch (error) {
    console.error("Error al eliminar referencia:", error);
    return { success: false, error: error.message || error };
  }
};

/*Funcion para obtener un punto de referencia por su ID desde el backend.*/
export const obtenerReferenciaPorIdDesdeBackend = async (id) => {
  try {
    if (!id) {
      throw new Error("Se requiere un ID de referencia válido");
    }

    // Verificamos que se haya pasado un ID válido
    const token = await getCurrentToken();

    // Realizamos la consulta al backend para obtener el punto de referencia
    const response = await api.get(`/referencias/punto/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      // Si la respuesta es exitosa, retornamos los datos del punto de referencia
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Error al obtener referencia");
    }
  } catch (error) {
    console.error("Error al obtener referencia por ID:", error);
    handleError(error);
    throw error;
  }
};

/*Funcion para obtener todos los puntos de referencia desde el backend.*/
export const getPuntosReferenciaByConglomerado = async (idConglomerado) => {
  try {
    // Verificamos que se haya pasado un ID de conglomerado válido
    if (!idConglomerado) {
      throw new Error("Se requiere el ID del conglomerado");
    }

    // Obtenemos el token de autenticación del usuario actual
    const token = await getCurrentToken();

    // Realizamos la consulta al backend para obtener los puntos de referencia, mediante el endpoint correspondiente
    const response = await api.get(
      `/referencias/conglomerado/${idConglomerado}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      // Si la respuesta es exitosa, retornamos los datos de los puntos de referencia
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || "Error al obtener puntos de referencia"
      );
    }
  } catch (error) {
    console.error("Error en API getPuntosReferenciaByConglomerado:", error);
    handleError(error);
  }
};

/*Funcion para guardar el trayecto en la base de datos */
export const guardarTrayectoEnBackend = async (
  datosTrayecto,
  puntoId,
  cedulaBrigadista
) => {
  try {
    // Obtenemos el token de autenticación del usuario actual
    const token = await getCurrentToken();

    // almacenamos las variables en un objeto para enviarlas al backend
    const payload = {
      datosTrayecto: {
        ...datosTrayecto,
        cedula_brigadista: cedulaBrigadista,
      },
      puntoId,
    };

    // Llamamos al endpoint del backend para guardar el trayecto
    const response = await api.post("/trayectos", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      // Si la respuesta es exitosa, retornamos los datos del trayecto guardado
      return response.data;
    } else {
      throw new Error(response.data.message || "Error al guardar trayecto");
    }
  } catch (error) {
    console.error("Error al guardar trayecto:", error);
    return {
      success: false,
      error: error.message || "Error al guardar trayecto",
    };
  }
};

// Función para actualizar un trayecto en el backend
export const actualizarTrayectoEnBackend = async (datosTrayecto, puntoId) => {
  try {
    // Obtenemos el token de autenticación del usuario actual
    const auth = getAuth();
    // Verificamos que el usuario esté autenticado
    const user = auth.currentUser;
    // Si el usuario no está autenticado, lanzamos un error
    const token = user ? await user.getIdToken() : null;

    if (!token) {
      throw new Error("Usuario no autenticado");
    }

    // Llamamos al endpoint del backend para actualizar el trayecto
    const response = await api.put(
      `/trayectos/${puntoId}`,
      {
        datosTrayecto,
        puntoId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Verificamos si la respuesta es exitosa
    return response.data;
  } catch (error) {
    console.error("Error al actualizar trayecto en el backend:", error);
    throw error;
  }
};

// Funcion para obtener el siguiente ID de trayecto desde el backend
export const getUltimoIdTrayectoDeBack = async () => {
  try {
    // Obtenemos el token de autenticación del usuario actual
    const auth = getAuth();
    // Verificamos que el usuario esté autenticado
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;

    if (!token) {
      throw new Error("Usuario no autenticado");
    }

    // Llamamos al endpoint del backend para obtener el siguiente ID de trayecto
    const response = await api.get(`/trayectos/siguienteId`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.success && response.data.data) {
      return response.data.data.siguienteId;
    } else {
      throw new Error("No se pudo obtener el siguiente ID");
    }
  } catch (error) {
    console.error("Error al obtener el siguiente ID:", error);
    throw error;
  }
};

// Funcion para obtener la cantidad de puntos de referencia relacionados a un brigadista
export const VerificarPuntosEnBackEnd = async (cedulaBrigadista) => {
  try {
    // Obtenemos el token de autenticación del usuario actual
    const auth = getAuth();
    // Verificamos que el usuario esté autenticado
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;

    if (!token) {
      throw new Error("Usuario no autenticado");
    }

    // Llamamos al endpoint del backend para verificar la cantidad de los puntos de referencia
    const response = await api.get(
      `/referencias/verificar/${cedulaBrigadista}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Verificamos si la respuesta es exitosa
    return response.data.cantidad;
  } catch (error) {
    console.error(
      "Error al obtener los puntos de referencia relacionados al brigadista:",
      error
    );
    throw error;
  }
};

/*Funcion para sincronizar las caracteristicas de las subparcelas con el backend,
  se espera que el backend reciba un array de objetos con las caracteristicas de las subparcelas.*/
export const sincronizarSubparcelas = async (subparcelasCaracteristicas) => {
  try {
    // Obtenemos el token de autenticación del usuario actual
    const auth = getAuth();
    // Verificamos que el usuario esté autenticado
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;

    if (!token) {
      throw new Error("Usuario no autenticado");
    }

    // Llamamos al endpoint del backend para sincronizar las subparcelas
    const response = await api.post(
      "/subparcelas/sincronizar",
      subparcelasCaracteristicas,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Verificamos si la respuesta es exitosa
    return response.data.data;
  } catch (error) {
    console.error("Error al sincronizar subparcelas con el backend:", error);
    throw error;
  }
};

export const getArbolesBySubparcela = async (
  nombreSubparcela,
  conglomeradoId
) => {
  try {
    const token = await getCurrentToken();
    const response = await api.get(
      `/subparcelas/${conglomeradoId}/${nombreSubparcela}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Mostrar respuesta completa para debug
    console.log("Respuesta completa del backend:", JSON.stringify(response.data, null, 2));

    // Comprobamos si la respuesta tiene la estructura esperada
    if (response.data && response.data.success) {
      // Normalizamos la estructura de los datos para trabajar con ellos
      return response.data;
    } else {
      console.error("Formato de respuesta inesperado:", response.data);
      throw new Error("El formato de la respuesta no es el esperado");
    }
  } catch (error) {
    console.error("Error al obtener árboles por subparcela:", error);
    handleError(error);
    throw error; // Propagamos el error para manejarlo en el componente
  }
};

// Exportamos la instancia de axios configurada para usar en otros archivos si es necesario
export default api;
