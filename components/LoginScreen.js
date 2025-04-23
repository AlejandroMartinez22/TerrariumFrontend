/*RELACIONADO CON EL INICIO DE SESIÓN */

import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  ImageBackground,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import LogoTerrarium from "../assets/LogoTerrarium.png";
import { useLogin } from "../hooks/useLogin";
import { Ionicons } from '@expo/vector-icons';
import {useState} from "react";

export default function LoginScreen({ navigation }) {
  const {
    email,
    password,
    loading,
    message,
    messageType,
    userName,
    setEmail,
    setPassword,
    handleLogin,
  } = useLogin(navigation);

  const [secureText, setSecureText] = useState(true); //Para que el usuario pueda visualizar la contraseña.
  return (
    <ImageBackground
      source={require("../assets/FondoLogin.jpg")}
      resizeMode="cover"
      style={styles.image}
      imageStyle={{ opacity: 0.9 }}
    >
      <View style={styles.container}>
        <View style={styles.loginBox}>
          <View>
            <Text style={styles.welcomeText}>¡Bienvenido a Terrarium!</Text>

            {message && (
              <View style={styles.errorMessage}>
                <Text style={styles.messageText}>{message}</Text>
              </View>
            )}
          </View>

          <View style={styles.lineStyle} />

          <TextInput
            placeholder="Correo"
            style={styles.input}
            placeholderTextColor="gray"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Contraseña"
            secureTextEntry={secureText}
            style={styles.passwordInput}
            placeholderTextColor="gray"
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}> 
            <Ionicons Ionicons name={secureText ? "eye-off" : "eye"} size={22} color="gray" />
          </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />

          ) : (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.logoContainer}>
          <Image source={LogoTerrarium} style={styles.logo} />
          <Text style={styles.subtitulo}>Una herramienta del IDEAM</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  loginBox: {
    width: "88%",
    maxWidth: 400,
    backgroundColor: "#4F7029",
    padding: 20,
    paddingBottom: 45,
    borderRadius: 18,
    alignItems: "stretch",
  },

  loginButton: {
    alignItems: "center",
    backgroundColor: "#3E581F",
    padding: 10,
    marginTop: 30,
    borderRadius: 8, 
  },

  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    letterSpacing: 1.5
  },

  input: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    opacity: 1,
    fontSize: 14,
    color: 'black'
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 20,
    opacity: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  
  passwordInput: {
    padding:10,
    flex: 1,
    fontSize: 14,
    color: 'black',
  },
  
  eyeIcon: {
    padding: 8,
  },
  
  welcomeText: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },

  logoContainer: {
    position: "absolute",
    bottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
  },

  subtitulo:{
    marginTop: 0,
    color:'white',
    fontSize:10,
  },

  messageContainer: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },

  errorMessage: {
    backgroundColor: "rgba(255, 0, 0, 0.7)",
  },

  messageText: {
    color: "white",
    textAlign: "center",
  },

  lineStyle: {
    borderWidth: 0.5,
    borderColor: "white",
    margin: 5,
    marginTop: 20,
    marginBottom: 40,
  },
});