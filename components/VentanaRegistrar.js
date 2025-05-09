import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
} from "react-native";

const VentanaRegistrar = ({ navigation }) => {
  const handleButtonPress = (option) => {
    if (option === "tree") {
      navigation.navigate("SeleccionarSubparcelaArbol");
    } else if (option === "sample") {
      navigation.navigate("SeleccionarSubparcelaMuestra");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/FondoProfile.png")}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.6 }} // Adjust the opacity of the background image
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.titulo}>Registrar</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleButtonPress("tree")}
          >
            <Image
              source={require("../assets/IconoArbol.png")}
              style={{ width: 150, height: 150, marginBottom: 20 }}
            />
            <Text style={styles.buttonText}>Nuevo árbol</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleButtonPress("sample")}
          >
            <Image
              source={require("../assets/IconoMuestra.png")}
              style={{ width: 150, height: 150, marginBottom: 20 }}
            />
            <Text style={styles.buttonText}>Nueva muestra</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default VentanaRegistrar;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent", // <- importante
    alignItems: "center",
    padding: 20,
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
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: "#ccc",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
  },
});
