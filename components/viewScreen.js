// react para la interfaz de usuario
import React from "react";
// importar el componente View y Text de react-native
import { View, Text, StyleSheet } from "react-native";

// metodo para crear la pantalla de vista
const ViewScreen = () => {

    return (
        <View style={styles.container}>
        <Text style={styles.titulo}>En construcción</Text>
        </View>
    );
};

// estilos para la pantalla de vista
const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
},
titulo: {
    fontSize: 30,
    color: "#333",
},
});

export default ViewScreen;