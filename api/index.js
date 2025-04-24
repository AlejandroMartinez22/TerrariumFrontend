/*PARTE DEL INICIO DE SESIÓN, */
/*CORRECTO, REVISADO EL 22/04 16:04 PM*/
/*DOCUMENTADO*/

import axios from "axios"; // Importamos la librería Axios para hacer peticiones HTTP al backend
import { getAuth } from "firebase/auth"; // Importamos la función getAuth de Firebase para manejar la autenticación del usuario

// Configuramos la URL base del backend
const API_URL =
  "http://192.168.86.230:5000/api"; /* Esta IP debe ser la dirección local de la computadora donde se está ejecutando el servidor Express (backend)*/

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
    console.log("Datos de usuario recibidos del backend:", response.data);
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

export const fetchCoordenadas = async () => {
  try {
    const token = await getCurrentToken();
    const response = await api.get("/coordenadas/subparcelas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(
      "Coordenadas recibidas del backend:",
      response.data.data.length
    );

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

export const fetchCoordenadasCentroPoblado = async () => {
  try {
    const token = await getCurrentToken();
    const response = await api.get("/coordenadas/centro-poblado", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(
      "Coordenadas del centro poblado recibidas del backend:",
      response.data.data.length
    );
    if (response.data.success) {
      console.log("Coordenadas del centro poblado:", response.data.data);
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

/*Funcion para obtener el siguiente id para asignarlo a un punto de referencia */

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

export const guardarReferenciaEnBackend = async (
  puntoReferencia,
  cedulaBrigadista
) => {
  try {
    const token = await getCurrentToken();

    // Incluimos la cédula en los datos enviados
    const puntoData = {
      id: puntoReferencia.id,
      latitud: puntoReferencia.latitude,
      longitud: puntoReferencia.longitude,
      descripcion: puntoReferencia.description,
      error: puntoReferencia.errorMedicion,
      tipo: puntoReferencia.tipo || "Referencia",
      cedula_brigadista: cedulaBrigadista, // Incluimos la cédula explícitamente
    };

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

export const actualizarReferenciaEnBackend = async (
  puntoReferencia,
  cedulaBrigadista
) => {
  try {
    const token = await getCurrentToken();

    // Preparamos los datos para enviar al backend
    const puntoData = {
      id: puntoReferencia.id,
      latitud: puntoReferencia.latitude,
      longitud: puntoReferencia.longitude,
      descripcion: puntoReferencia.description,
      error: puntoReferencia.errorMedicion,
      cedula_brigadista: cedulaBrigadista,
    };

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

export const eliminarReferenciaEnBackend = async (
  puntoId,
  cedulaBrigadista
) => {
  try {
    const token = await getCurrentToken();

    const response = await api.delete(`/referencias/${puntoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        cedula_brigadista: cedulaBrigadista,
      },
    });

    if (response.data.success) {
      return { success: true, data: response.data.data };
    } else {
      throw new Error(response.data.message || "Error al eliminar referencia");
    }
  } catch (error) {
    console.error("Error al eliminar referencia:", error);
    return { success: false, error: error.message || error };
  }
};

export const obtenerReferenciaPorIdDesdeBackend = async (id) => {
  try {
    const token = await getCurrentToken();

    const response = await api.get(`/referencias/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
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

export const getPuntosReferenciaByConglomerado = async (idConglomerado) => {
  try {
    if (!idConglomerado) {
      throw new Error("Se requiere el ID del conglomerado");
    }

    const token = await getCurrentToken();

    const response = await api.get(
      `/referencias/conglomerado/${idConglomerado}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
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
    const token = await getCurrentToken();

    const payload = {
      datosTrayecto: {
        ...datosTrayecto,
        cedula_brigadista: cedulaBrigadista,
      },
      puntoId,
    };

    const response = await api.post("/trayectos", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
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
    // Obtener el token de autenticación del usuario actual
    const auth = getAuth();
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;

    if (!token) {
      throw new Error("Usuario no autenticado");
    }

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

    return response.data;
  } catch (error) {
    console.error("Error al actualizar trayecto en el backend:", error);
    throw error;
  }
};

export const getUltimoIdTrayectoDeBack = async () => {
  try {
    // Obtener el token de autenticación del usuario actual
    const auth = getAuth();
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;

    if (!token) {
      throw new Error("Usuario no autenticado");
    }

    const response = await api.get(`/trayectos/siguienteId`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Extraer solo el ID del objeto de respuesta
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

// Exportamos la instancia de axios configurada para usar en otros archivos si es necesario
export default api;
