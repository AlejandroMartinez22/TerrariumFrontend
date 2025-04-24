// AddScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AddScreen = () => {
return (
    <View style={styles.container}>
    <Text style={styles.text}>En construcción</Text>
    </View>
);
};

export default AddScreen;

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
