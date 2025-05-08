// Importaciones necesarias para React Native
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";

// Componente que representa la pantalla de registro
const VentanaRegistrar = ({ navigation }) => {
  // Función para manejar la navegación cuando se presiona un botón
  const handleButtonPress = (option) => {
    if (option === "tree") {
      navigation.navigate("registrarArbol"); // Navegar al componente
    } else if (option === "sample") {
      // Navegar directamente al componente registrarMuestra
      navigation.navigate("registrarMuestra");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/FondoProfile.png")}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.6 }}
    >
      <View style={styles.container}>
        <Text style={styles.titulo}>Registrar</Text>

        {/* Contenedor para los botones centrados */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleButtonPress("tree")}
          >
            <Image
              source={require("../assets/IconoArbol.png")} // Asegúrate de que la ruta sea correcta
              style={{ width: 150, height: 150, marginBottom: 20 }}
            />
            <Text style={styles.buttonText}>Nuevo árbol</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleButtonPress("sample")}
          >
            <Image
              source={require("../assets/IconoMuestra.png")} // Asegúrate de que la ruta sea correcta
              style={{ width: 150, height: 150, marginBottom: 20 }}
            />
            <Text style={styles.buttonText}>Nueva muestra</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default VentanaRegistrar;

// Estilos para la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  titulo: {
    fontSize: 36,
    marginTop: 30,
    marginBottom: 40,
    color: "#000",
    textAlign: "center",
  },
  buttonsContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "70%",
    padding: 15,
    marginVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: "#ccc",
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
  },
});
