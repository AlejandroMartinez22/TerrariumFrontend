// Importaciones necesarias para React Native
import React from "react";
import { View, Text, StyleSheet } from "react-native"; 

// Componente que representa una pantalla de sección aún no implementada
const AddScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>En construcción</Text>
    </View>
  );
};

export default AddScreen;

// Estilos para la pantalla: diseño simple con un fondo blanco y texto centrado
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    color: "#000",
  },
});