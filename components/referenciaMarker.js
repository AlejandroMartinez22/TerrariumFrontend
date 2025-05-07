// En ReferenciaMarker.js
import React from "react";
import { Marker, Callout } from "react-native-maps";
import { View, Text, StyleSheet, Image } from "react-native"; // Añadir Image aquí

const ReferenciaMarker = ({ punto, index, onPress, onDragEnd }) => {
  // Omitir renderizado si las coordenadas son inválidas
  if (!punto?.latitude || !punto?.longitude || isNaN(punto.latitude) || isNaN(punto.longitude)) {
    console.warn(`Coordenadas inválidas para el punto ${punto?.id}`);
    return null;
  }

  // Asegurar que las coordenadas sean números
  const latitude = typeof punto.latitude === 'string' ? parseFloat(punto.latitude) : punto.latitude;
  const longitude = typeof punto.longitude === 'string' ? parseFloat(punto.longitude) : punto.longitude;

  // Determinar qué icono mostrar según el tipo de punto
  const getMarkerIcon = () => {
    if (punto.tipo === "Campamento") {
      return (
        <Image 
          source={require("../assets/IconoCampamento.png")} 
          style={{ width: 28, height: 28 }}
          resizeMode="contain"
        />
      );
    }
    // No devolver nada para usar el icono predeterminado (rojo) para "Referencia"
    return null;
  };

  return (
    <Marker
      coordinate={{
        latitude,
        longitude,
      }}
      pinColor="red" // Este color se usará solo cuando no haya icono personalizado
      draggable
      onPress={() => onPress(punto, index)}
      onDragEnd={(e) => onDragEnd && onDragEnd(index, e.nativeEvent.coordinate)}
    >
      {/* Renderizar el icono personalizado si es necesario */}
      {getMarkerIcon()}
      
      <Callout>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>{punto.title}</Text>
          {punto.description ? (
            <Text style={styles.calloutText}>{punto.description}</Text>
          ) : null}
        </View>
      </Callout>
    </Marker>
  );
};

// Mantener los estilos como están
const styles = StyleSheet.create({
  callout: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  calloutText: {
    fontSize: 14,
  },
});

export default ReferenciaMarker;