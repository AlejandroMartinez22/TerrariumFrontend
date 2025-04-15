import React, { useState, useEffect, useRef } from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import MapView, { Circle, PROVIDER_GOOGLE } from "react-native-maps";

import { useBrigadista } from "../context/BrigadistaContext";
import { getCoordenadas } from "../supabase/getCoordenadas";
import { useReferenciaHandler } from "../hooks/useReferenciaHandler";

import ReferenciaModal from "./puntoReferenciaModal";
import ReferenciaMarker from "./referenciaMarker";

export default function MapScreen() {
  const { brigadista } = useBrigadista();
  const [coordenadas, setCoordenadas] = useState([]);
  const mapRef = useRef(null);

  const {
    puntosReferencia,
    generarReferenciaInicial,
    setPuntosReferencia,
  } = useReferenciaHandler();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPunto, setSelectedPunto] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [errorMedicion, setErrorMedicion] = useState("");
  const [puntoId, setPuntoId] = useState("");

  const defaultCenter = {
    latitude: 7.12539,
    longitude: -73.1198,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  useEffect(() => {
    const fetchCoordenadas = async () => {
      if (brigadista?.idConglomerado) {
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

  const openModal = (punto, index) => {


    setSelectedPunto({ ...punto, index });
    setEditedDescription(punto.description || "");
    setErrorMedicion(punto.errorMedicion || "");
    setPuntoId(`PR00${index + 1}`);
    setModalVisible(true);
  };
  
  
  const guardarCambios = () => {

    const nuevoPunto = {
      ...selectedPunto,
      title: selectedPunto.title || `Punto de referencia ${selectedPunto.index + 1}`,
      description: editedDescription,
      errorMedicion: errorMedicion,
    };

    let nuevosPuntos;

    if (selectedPunto.index < puntosReferencia.length) {
      // Editando un punto existente
      nuevosPuntos = [...puntosReferencia];
      nuevosPuntos[selectedPunto.index] = nuevoPunto;
    } else {
      // Agregando nuevo punto
      nuevosPuntos = [...puntosReferencia, nuevoPunto];
    }

    setPuntosReferencia(nuevosPuntos);
    setModalVisible(false);

  };

  const eliminarPunto = () => {
    const nuevosPuntos = puntosReferencia.filter((_, i) => i !== selectedPunto.index);
    setPuntosReferencia(nuevosPuntos);
    setModalVisible(false);
  };

  const handleLongPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    const nuevoPunto = generarReferenciaInicial(coordinate);

    // Preparamos el nuevo punto pero NO lo agregamos aún
    setSelectedPunto({ ...nuevoPunto, index: puntosReferencia.length });
    setEditedDescription("");
    setErrorMedicion("");
    setPuntoId(nuevoPunto.id);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          mapType="satellite"
          initialRegion={defaultCenter}
          onLongPress={handleLongPress}
        >
          {coordenadas.length > 0 && (
            <Circle
              center={{
                latitude: coordenadas[0].latitud,
                longitude: coordenadas[0].longitud,
              }}
              radius={100}
              strokeColor="rgba(0, 122, 255, 0.8)"
              fillColor="rgba(0, 122, 255, 0.2)"
              zIndex={1}
            />
          )}

          {coordenadas.map((coordenada, index) => (
            <React.Fragment key={index}>
              <Circle
                center={{
                  latitude: coordenada.latitud,
                  longitude: coordenada.longitud,
                }}
                radius={1}
                strokeColor="rgba(255, 255, 255, 0.9)"
                fillColor="rgba(255, 255, 255, 0.5)"
              />
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

          {puntosReferencia.map((punto, index) => (
            <ReferenciaMarker
              key={`ref-${index}`}
              punto={punto}
              index={index}
              onPress={openModal}
            />
          ))}
        </MapView>
      </View>

      <ReferenciaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onGuardar={guardarCambios}
        puntoId={puntoId}
        selectedPunto={selectedPunto}
        editedDescription={editedDescription}
        setEditedDescription={setEditedDescription}
        errorMedicion={errorMedicion}
        setErrorMedicion={setErrorMedicion}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
