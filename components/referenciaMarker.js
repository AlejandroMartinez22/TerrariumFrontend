    // referenciaMarker.js - Versión corregida

    import React from "react";
    import { Marker, Callout } from "react-native-maps";
    import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

    const ReferenciaMarker = ({ punto, index, onPress }) => {
    if (!punto?.latitude || !punto?.longitude) return null;

    return (
        <Marker 
        coordinate={{ latitude: punto.latitude, longitude: punto.longitude }} 
        pinColor="red"
        onPress={() => {}}  // Evento vacío para asegurar que el marker responde a toques
        >
        <Callout tooltip={false}>
            <View style={styles.callout}>
            <Text style={styles.title}>
                {punto.title || `Punto de referencia ${index + 1}`}
            </Text>
            <Text style={styles.description}>
                {punto.description || "Sin descripción"}
            </Text>
            
            <TouchableOpacity 
                style={styles.editButton}
                onPress={() => {
                onPress(punto, index);
                }}
            >
                <Text style={styles.editLink}>Editar</Text>
            </TouchableOpacity>
            </View>
        </Callout>
        </Marker>
    );
    };

    const styles = StyleSheet.create({
    callout: {
        width: 160,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    title: {
        fontWeight: "bold",
        fontSize: 14,
    },
    description: {
        fontSize: 12,
        color: "#444",
        marginTop: 4,
    },
    editButton: {
        marginTop: 10,
        padding: 5,
    },
    editLink: {
        color: "blue",
        textDecorationLine: "underline",
        fontSize: 14,
    },
    });

    export default ReferenciaMarker;