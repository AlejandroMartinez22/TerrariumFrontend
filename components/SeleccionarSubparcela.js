import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

const SeleccionarSubparcela = ({ navigation, route }) => {
  // Extraer el tipo de la ruta (arbol o muestra)
  const { tipo } = route.params;
  
  // Determinar el título según el tipo
  const titulo = tipo === "arbol" 
    ? "Registrar nuevo\nindividuo árboreo" 
    : "Registrar nueva\nmuestra botánica";
  
  const handleOptionSelect = (option) => {
    if (tipo === "arbol") {
      navigation.navigate("registrarIndividuoBotanico", { nombreSubparcela: option });
      console.log("Navegando a la ventana de registro del individuo:", option);
    } else {
      navigation.navigate("SeleccionarArbolMuestra", { subparcelaType: option });
    }
  };
  
  const renderButton = (text) => {
    return (
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleOptionSelect(text)}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/FondoProfile.png")}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.4 }}
    >
      <View style={styles.container}>
        <Text style={styles.titulo}>{titulo}</Text>

        {/* Contenedor centrado solo para los botones */}
        <View style={styles.buttonsContainer}>
          {renderButton("SPF-1")}
          {renderButton("SPF-2")}
          {renderButton("SPF-3")}
          {renderButton("SPF-4")}
          {renderButton("SPF-5")}
        </View>
      </View>
    </ImageBackground>
  );
};

export default SeleccionarSubparcela;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 35,
    top: 35,
    color: "#000",
    textAlign: "center",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    marginTop: 0,
  },
  optionButton: {
    width: "100%",
    padding: 18,
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: "#ccc",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "500",
    color: "#194D20",
  },
});