// React para la interfaz de usuario
import React from "react";
// elementos de React Native necesarios para la interfaz de usuario
import { View, Text, StyleSheet } from "react-native";

// Funcion para agregar pestañas, en este caso se usa para las secciones aun no implementadas
const AddScreen = () => {
return (
    <View style={styles.container}>
    <Text style={styles.text}>En construcción</Text>
    </View>
);
};

export default AddScreen;

// Estilos para esta pestaña
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
