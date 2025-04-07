import React from "react";
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from '@expo/vector-icons'; //Importamos Iconos de Expo.

export default function MapScreen() {
  // Coordenadas del epicentro
  const epicenterLocation = {
    latitude: 7.12539, // Latitud del epicentro
    longitude: -73.1198, // Longitud del epicentro
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text
          style={ styles.header }
        >
          Conglomerado
        </Text>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE} // Usa Google Maps como proveedor
          style={styles.map}
          mapType="satellite" // Vista satelital
          initialRegion={{
            ...epicenterLocation,
            latitudeDelta: 0.0020,
            longitudeDelta: 0.0020,
          }}
        >
          {/* Marcador en el epicentro */}
          <Marker
            coordinate={epicenterLocation}
            title="Epicentro"
            description="Este es el centro"
          />

          {/* Círculo alrededor del epicentro */}
          <Circle
            center={epicenterLocation} // Centro del círculo
            radius={100} // Radio en metros (en este caso, 1 km)
            strokeColor="rgba(255, 0, 0, 0.8)" // Color del borde (rojo con opacidad)
            fillColor="rgba(255, 0, 0, 0.2)" // Color de relleno (rojo semitransparente)
          />
        </MapView>
      </View>

      <TouchableOpacity style={styles.button}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.buttonText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={20} color="white" style={styles.iconoFlecha} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    marginTop: 60,
    marginBottom: 0,
    backgroundColor: "green",
    borderRadius: 10,
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#E9E9E9",
  },
  mapContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  button: {
    position: 'absolute',
    bottom: 40,               // margen más pequeño desde abajo
    alignSelf: 'center',     // centra horizontalmente
    backgroundColor: '#186A3B',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',      //  Alínea hijos en fila
    alignItems: 'center',      //  Centra verticalmente
    gap: 8,      
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  iconoFlecha: {
    marginLeft: 8
  }
});
