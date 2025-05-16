import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

const ArbolMarker = ({ arbol }) => {
  // Determinar qué icono usar según el tipo de árbol
  const getIconSource = (tipoArbol) => {
    switch (tipoArbol) {
      case 'Latizal':
        return require('../assets/IconoLatizal.png');
      case 'Brinzal':
        return require('../assets/IconoBrinzal.png');
      case 'Fustal':
        return require('../assets/IconoFustal.png');
      case 'Fustal Grande':
        return require('../assets/IconoFustalGrande.png');
      default:
        return require('../assets/IconoArbol.png'); // Icono genérico
    }
  };

  // Verificar que las coordenadas sean válidas
  if (!arbol.latitud || !arbol.longitud) return null;

  // Asegurar que las coordenadas sean números
  const lat = typeof arbol.latitud === 'string' ? parseFloat(arbol.latitud) : arbol.latitud;
  const lng = typeof arbol.longitud === 'string' ? parseFloat(arbol.longitud) : arbol.longitud;

  // Omitir si son números inválidos
  if (isNaN(lat) || isNaN(lng)) return null;

  return (
    <Marker
      coordinate={{
        latitude: lat,
        longitude: lng,
      }}
    >
      <View style={styles.markerContainer}>
        <Image
          source={getIconSource(arbol.tamaño_individuo)}
          style={styles.markerIcon}
          resizeMode="contain"
        />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  markerIcon: {
    width: 45,
    height: 45,
  },
});

export default ArbolMarker;
