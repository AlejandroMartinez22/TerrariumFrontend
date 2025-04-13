import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { getCoordenadas } from "../supabase/getCoordenadas";
import { useBrigadista } from "../context/BrigadistaContext";
import { useReferenciaHandler } from "../hooks/useReferenciaHandler";

export default function MapScreen() {
  const { brigadista } = useBrigadista();
  const [coordenadas, setCoordenadas] = useState([]);
  const mapRef = useRef(null);

  const { puntosReferencia, handleAgregarReferencia } = useReferenciaHandler();

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
          onLongPress={handleAgregarReferencia}
        >
          {/* ✅ Círculo grande que encierra todos los círculos pequeños */}
          {coordenadas.length > 0 && (
            <Circle
              center={{
                latitude: coordenadas[0].latitud,
                longitude: coordenadas[0].longitud,
              }}
              radius={100} // Ajusta el tamaño según distribución
              strokeColor="rgba(0, 122, 255, 0.8)" // Azul
              fillColor="rgba(0, 122, 255, 0.2)"
              zIndex={1}
            />
          )}

          {/* ✅ Círculos pequeños de subparcelas */}
          {coordenadas.map((coordenada, index) => (
            <React.Fragment key={index}>
              {/* Círculo blanco central */}
              <Circle
                center={{
                  latitude: coordenada.latitud,
                  longitude: coordenada.longitud,
                }}
                radius={1}
                strokeColor="rgba(255, 255, 255, 0.9)"
                fillColor="rgba(255, 255, 255, 0.5)"
              />
              {/* Círculo azul secundario */}
              <Circle
                center={{
                  latitude: coordenada.latitud,
                  longitude: coordenada.longitud,
                }}
                radius={15}
                strokeColor="rgba(255, 10, 10, 0.8)"
                fillColor="rgba(255, 20, 20, 0.5)"
              />
            </React.Fragment>
          ))}

          {/* ✅ Puntos de referencia agregados manualmente */}
          {puntosReferencia.map((punto, index) => (
            <Marker
              key={`ref-${index}`}
              coordinate={punto}
              pinColor="green"
              title={`Punto de referencia ${index + 1}`}
              description={`Lat: ${punto.latitude.toFixed(5)}, Lng: ${punto.longitude.toFixed(5)}`}
            />
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
