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
      navigation.navigate("SeleccionarSubparcela", {tipo: "arbol"});
    } else if (option === "sample") {
      navigation.navigate("SeleccionarSubparcela", {tipo: "muestra"});
    }
  };  

  return (
    <ImageBackground
      source={require("../assets/FondoProfile.png")}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.32 }} // Adjust the opacity of the background image
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
              style={{ width: 145, height: 145, marginBottom: 15 }}
            />
            <Text style={styles.buttonText}>Nuevo árbol</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleButtonPress("sample")}
          >
            <Image
              source={require("../assets/IconoMuestra.png")}
              style={{ width: 145, height: 145, marginBottom: 15 }}
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
    marginTop: 20,
    marginBottom: 20,
    color: "#194D20",
    textAlign: "center",
    fontWeight: 500
  },
  buttonsContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "75%",
    padding: 15,
    marginVertical: 15,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: "#ccc",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  },
  buttonText: {
    fontSize: 21,
    fontWeight: "500",
    color: "black",
    marginTop: 0,
  },
});
