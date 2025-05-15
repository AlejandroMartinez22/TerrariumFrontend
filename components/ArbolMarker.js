import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { Marker } from 'react-native-maps';

const ArbolMarker = ({ arbol, shouldShowLabels }) => {
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

  // Determinar el tamaño del icono basado en el tipo de árbol
  const getIconSize = (tipoArbol) => {
    switch (tipoArbol) {
      case 'Latizal':
        return 20;
      case 'Brinzal':
        return 18;
      case 'Fustal':
        return 24;
      case 'Fustal Grande':
        return 28;
      default:
        return 22;
    }
  };

  const iconSize = getIconSize(arbol.tamaño_individuo);

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
          style={[styles.markerIcon, { width: iconSize, height: iconSize }]}
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
    // width y height se definen dinámicamente
  },
  labelContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    marginTop: 2,
    maxWidth: 120,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ArbolMarker;