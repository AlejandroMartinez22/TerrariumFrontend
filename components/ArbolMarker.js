import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

const ArbolMarker = ({ arbol, shouldShow = true }) => {
  // Determinar qué icono usar según el tipo de árbol
  const getIconSource = (tipoArbol) => {
    switch (tipoArbol) {
      case 'Latizal':
        return require('../assets/IconoLatizal.png'); // Ícono para Latizal
      case 'Brinzal':
        return require('../assets/IconoBrinzal.png'); // Ícono para Brinzal
      case 'Fustal':
        return require('../assets/IconoFustal.png'); // Ícono para Fustal
      case 'Fustal Grande':
        return require('../assets/IconoFustalGrande.png'); // Ícono para Fustal Grande
      default:
        return require('../assets/IconoArbol.png'); // Ícono genérico en caso de tipo desconocido
    }
  };

  // Si no se debe mostrar el marcador, retornar null
  if (!shouldShow) return null;

  // Verificar que las coordenadas sean válidas
  if (!arbol.latitud || !arbol.longitud) return null;

  // Convertir coordenadas a número en caso de que sean cadenas de texto
  const lat = typeof arbol.latitud === 'string' ? parseFloat(arbol.latitud) : arbol.latitud;
  const lng = typeof arbol.longitud === 'string' ? parseFloat(arbol.longitud) : arbol.longitud;

  // Omitir el marcador si las coordenadas son inválidas
  if (isNaN(lat) || isNaN(lng)) return null;

  return (
    <Marker
      coordinate={{
        latitude: lat,
        longitude: lng,
      }}
    >
      <View style={styles.markerContainer}>
        {/* Mostrar el ícono correspondiente al tipo de árbol */}
        <Image
          source={getIconSource(arbol.tamaño_individuo)}
          style={styles.markerIcon}
          resizeMode="contain"
        />
      </View>
    </Marker>
  );
};

// Definir estilos para el contenedor e ícono del marcador
const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center', // Centrar el contenido dentro del marcador
  },
  markerIcon: {
    width: 45, // Ancho del ícono del marcador
    height: 45, // Alto del ícono del marcador
  },
});

export default ArbolMarker;