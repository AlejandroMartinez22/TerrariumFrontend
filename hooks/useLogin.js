  /*PARTE DEL INICIO DE SESIÓN, */
  /*CORRECTO, REVISADO EL 22/04 16:36 PM*/
  /*DOCUMENTADO*/
  /*ESTE ARCHIVO SI DEBE MANTENERSE EN EL FRONTEND*/

import { useState } from "react"; // Importamos useState para manejar el estado local
import { Alert, Platform } from "react-native";  /* Importamos Alert y Platform de React Native. De momento la aplicación está pensada para funcionar unicamente en dispositivos moviles android, que
son los que idealmente se usarían en el IFN. Sin embargo, en algunas partes se hacen validaciones con platform para en un futuro quizá poder asegurar su funcionamiento en otras plataformas.*/
import { login } from "./auth"; // Importamos la función login para autenticar al usuario

/* Este hook gestiona la autenticación del usuario en el frontend y la interacción con la UI para mostrar mensajes de error, carga y éxito durante el login.*/

export const useLogin = (navigation) => {
   // Estado para email, password, loading, mensajes de error/success y el nombre del usuario
   const [email, setEmail] = useState(""); // Email del usuario
   const [password, setPassword] = useState(""); // Contraseña del usuario
   const [loading, setLoading] = useState(false); // Estado de carga para mostrar animación o mensaje mientras se procesa el login
   const [message, setMessage] = useState(null); // Mensaje de error o éxito
   const [messageType, setMessageType] = useState(""); // Tipo de mensaje (error o success)
   const [userName, setUserName] = useState(""); // Nombre del usuario obtenido del backend

  /* Muestra un mensaje dependiendo del tipo y sistema operativo. Si estamos en una plataforma web, muestra un mensaje temporal, si es en dispositivos móviles, muestra una alerta.*/
  const showMessage = (title, msg, type) => {
    if (Platform.OS === "web") {
      setMessage(`${title}: ${msg}`);
      setMessageType(type);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } else {
      Alert.alert(title, msg);
    }
  };

/* Función que maneja el login del usuario.*/

  const handleLogin = async () => {
    if (!email || !password) {
      showMessage("Advertencia", "Por favor ingresa email y contraseña", "error");   // Si los campos están vacíos, mostramos un mensaje de advertencia
      return;
    }

    setLoading(true);  // Activamos el estado de carga
    try {
      const userData = await login(email, password);  // Intentamos el login
      
      if (userData) {
        // Si obtenemos datos del usuario, verificamos si tiene nombre
        if (userData.nombre) {
          setUserName(userData.nombre);  // Establecemos el nombre del usuario
          navigation.replace("Main"); // Navegamos a la pantalla principal
          navigation.navigate("Profile"); // La ventana del perfil del usuario se abre encima de la pantalla principal.
        } else {
          showMessage("Advertencia", "No se encontró el nombre del usuario", "error");
        }
      } else {
        showMessage("Error", "Error, usuario o contraseña incorrectos", "error");
      }
    } catch (error) {
      showMessage("Error", error.message || "Error desconocido", "error");
    } finally {
      setLoading(false);
    }
  };

   // Retornamos todos los estados y la función handleLogin para que se pueda usar en otros componentes
  return {
    email,
    password,
    loading,
    message,
    messageType,
    userName,
    setEmail,
    setPassword,
    handleLogin,
  };
};