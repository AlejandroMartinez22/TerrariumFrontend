import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ViewScreen = () => {

    return (
        <View style={styles.container}>
        <Text style={styles.titulo}>Visualizar</Text>
        </View>
    );
};

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