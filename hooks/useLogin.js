import { useState } from "react";
import { Alert, Platform } from "react-native";
import { login } from "./auth";
import { getUserNameByUID } from "../supabase/getName";

export const useLogin = (navigation) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [userName, setUserName] = useState("");

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

  const handleLogin = async () => {
    if (!email || !password) {
      showMessage("Advertencia", "Por favor ingresa email y contraseña", "error");
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      if (user) {
        let uid = null;

        if (typeof user === "string") {
          uid = user;
        } else if (user.uid) {
          uid = user.uid;
        } else if (user.user?.uid) {
          uid = user.user.uid;
        }

        if (uid) {
          const nombre = await getUserNameByUID(uid);
          if (nombre) {
            setUserName(nombre);
            navigation.replace("Map");
            navigation.navigate("Profile");
          } else {
            showMessage("Advertencia", "No se encontró el nombre del usuario", "error");
          }
        } else {
          showMessage("Error", "No se pudo identificar al usuario", "error");
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