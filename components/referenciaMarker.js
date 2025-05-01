// import React para la interfaz de usuario
import React from "react";
// importar el componente Marker y Callout de react-native-maps
import { Marker, Callout } from "react-native-maps";
// importar el componente View, Text y StyleSheet de react-native
import { View, Text, StyleSheet } from "react-native";

// metodo para crear un marcador de referencia
const ReferenciaMarker = ({ punto, index, onPress, onDragEnd }) => {
  // Omitir renderizado si las coordenadas son inválidas
  if (!punto?.latitude || !punto?.longitude || isNaN(punto.latitude) || isNaN(punto.longitude)) {
    console.warn(`Coordenadas inválidas para el punto ${punto?.id}`);
    return null;
  }

  // Asegurar que las coordenadas sean números
  const latitude = typeof punto.latitude === 'string' ? parseFloat(punto.latitude) : punto.latitude;
  const longitude = typeof punto.longitude === 'string' ? parseFloat(punto.longitude) : punto.longitude;

  return (
    <Marker
      coordinate={{
        latitude,
        longitude,
      }}
      pinColor="red"
      draggable
      onPress={() => onPress(punto, index)}
      onDragEnd={(e) => onDragEnd && onDragEnd(index, e.nativeEvent.coordinate)}
    >
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

// Estilos para el marcador y el callout
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