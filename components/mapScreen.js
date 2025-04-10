import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import { getCoordenadas } from "../supabase/getCoordenadas";
import { useBrigadista } from "../context/BrigadistaContext";

export default function MapScreen() {
  const { brigadista } = useBrigadista();
  const [coordenadas, setCoordenadas] = useState([]);
  const mapRef = useRef(null);

  const defaultCenter = {
    latitude: 7.12539,
    longitude: -73.1198,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  useEffect(() => {
    const fetchCoordenadas = async () => {
      if (brigadista && brigadista.idConglomerado) {
        const data = await getCoordenadas(brigadista);
        setCoordenadas(data);

        if (data.length > 0 && mapRef.current) {
          // Centrar el mapa para mostrar todas las coordenadas
          mapRef.current.fitToCoordinates(
            data.map((coord) => ({
              latitude: coord.latitud,
              longitude: coord.longitud,
            })),
            {
              edgePadding: { top: 50, bottom: 50, left: 50, right: 50 },
              animated: true,
            }
          );
        }
      }
    };

    fetchCoordenadas();
  }, [brigadista]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          mapType="satellite"
          initialRegion={defaultCenter}
        >
          {/* Marcadores y círculos para cada coordenada */}
          {coordenadas.map((coordenada, index) => (
            <React.Fragment key={index}>
              <Marker
                coordinate={{
                  latitude: coordenada.latitud,
                  longitude: coordenada.longitud,
                }}
                title={`Subparcela ${coordenada.id_subparcela}`}
                description={`Coordenada: (${coordenada.latitud}, ${coordenada.longitud})`}
              />
              <Circle
                center={{
                  latitude: coordenada.latitud,
                  longitude: coordenada.longitud,
                }}
                radius={15} // 🔵 15 metros de radio
                strokeColor="rgba(0, 122, 255, 0.8)"
                fillColor="rgba(0, 122, 255, 0.3)"
              />
            </React.Fragment>
          ))}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E9E9",
  },
  mapContainer: {
    flex: 1,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
