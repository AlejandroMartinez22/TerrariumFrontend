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
// Asumimos que utilizas React Navigation para la navegación entre pantallas
// Si usas otra biblioteca de navegación, deberás ajustar el código

// Componente que representa la pantalla de registro de árboles
const RegistrarMuestraArborea = ({ navigation }) => {
  // Función para navegar a otro componente con el tipo de subparcela seleccionado
  const handleOptionSelect = (option) => {
    // Aquí navegamos a la pantalla de detalles de subparcela y pasamos la opción seleccionada

    navigation.navigate("viewScreen", { subparcelaType: option });

    // Si no estás usando React Navigation o quieres implementar otra lógica,
    // puedes usar un callback o un estado global (Redux, Context API) para manejar esto
  };

  // Renderizado de los botones de opciones
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
        <Text style={styles.titulo}>Registrar nueva</Text>
        <Text style={styles.titulo}>muestra árborea</Text>

        {/* Contenedor flexbox para la imagen y botones lado a lado */}
        <View style={styles.contentContainer}>
          {/* Espacio para la imagen del árbol que se añadirá después */}
          <View style={styles.imagePlaceholder}>
            <View style={styles.imageWrapper}>
              <Image
                source={require("../assets/ImagenRegistroMuestra.png")}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Contenedor para los botones de opciones */}
          <View style={styles.optionsContainer}>
            {renderButton("SPF-1")}
            {renderButton("SPF-2")}
            {renderButton("SPF-3")}
            {renderButton("SPF-4")}
            {renderButton("SPF-5")}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default RegistrarMuestraArborea;

// Estilos para la pantalla
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
    fontSize: 36,
    top: 20,
    color: "#000",
    textAlign: "center",
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 100,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    // Puedes añadir un borde o un color de fondo para visualizar el espacio
    // borderWidth: 1,
    // borderColor: '#ccc',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
    flexShrink: 1,
  },
  optionButton: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "white",
    borderColor: "#ccc",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  imageWrapper: {
    width: 150,
    height: 260,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
