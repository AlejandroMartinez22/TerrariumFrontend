import React, { useState, useEffect, useRef } from "react";
import { View, SafeAreaView, StyleSheet, Text } from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { useBrigadista } from "../context/BrigadistaContext";
import { getCoordenadas } from "../supabase/getCoordenadas";
import { useReferencia } from "../context/ReferenciaContext";

import ReferenciaModal from "./puntoReferenciaModal";
import ReferenciaMarker from "./referenciaMarker";
import TrayectoModal from "./trayectoModal";

export default function MapScreen() {
  const { brigadista } = useBrigadista();
  const [coordenadas, setCoordenadas] = useState([]);
  const mapRef = useRef(null);

  const { puntosReferencia, generarReferenciaInicial, setPuntosReferencia } =
    useReferencia();

  const [modalVisible, setModalVisible] = useState(false);
  const [trayectoModalVisible, setTrayectoModalVisible] = useState(false);
  const [selectedPunto, setSelectedPunto] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [errorMedicion, setErrorMedicion] = useState("");
  const [puntoId, setPuntoId] = useState("");
  const [tempPuntoData, setTempPuntoData] = useState(null);
  const [nombrePositions, setNombrePositions] = useState([]);

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

  const handleCloseModal = () => {
    setTempPuntoData(null);
    setModalVisible(false);
  };

  const handleCloseTrayectoModal = () => {
    setTempPuntoData(null);
    setTrayectoModalVisible(false);
  };

  const continuar = () => {
    if (!selectedPunto) return;

    const puntoActualizado = {
      ...selectedPunto,
      title:
        selectedPunto.title || `Punto de referencia ${selectedPunto.index + 1}`,
      description: editedDescription,
      errorMedicion: errorMedicion,
      latitude: selectedPunto.latitude,
      longitude: selectedPunto.longitude,
    };

    setTempPuntoData(puntoActualizado);
    setModalVisible(false);
    setTrayectoModalVisible(true);
  };

  const confirmarTrayecto = (datosTrayecto) => {
    if (!tempPuntoData) return;

    const puntoConTrayecto = {
      ...tempPuntoData,
      trayecto: datosTrayecto,
    };

    // Corregido para que no cambie el ID del punto al agregarlo
    let nuevosPuntos;
    if (puntoConTrayecto.index < puntosReferencia.length) {
      nuevosPuntos = puntosReferencia.map((punto, i) =>
        i === puntoConTrayecto.index ? puntoConTrayecto : punto
      );
    } else {
      nuevosPuntos = [...puntosReferencia, puntoConTrayecto];
    }

    setPuntosReferencia(nuevosPuntos);
    setTrayectoModalVisible(false);
  };

  const eliminarPunto = () => {
    const nuevosPuntos = puntosReferencia.filter(
      (_, i) => i !== selectedPunto.index
    );
    setPuntosReferencia(nuevosPuntos);
    setModalVisible(false);
    setTempPuntoData(null);
  };

  const handleLongPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    const nuevoPunto = {
      ...generarReferenciaInicial(coordinate),
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    };

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

              {/* Texto con el nombre encima del círculo */}
              <Marker
                key={`label-${index}`}
                coordinate={{
                  latitude: coordenada.latitud,
                  longitude: coordenada.longitud,
                }}
                anchor={{ x: 0.5, y: 1.5 }}
              >
                <View
                  style={{
                    backgroundColor: "transparent",
                    padding: 4,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "bold", color: "white"}}>
                    {coordenada.nombre_subparcela}
                  </Text>
                </View>
              </Marker>
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
        onClose={handleCloseModal}
        onContinuar={continuar}
        onEliminar={eliminarPunto}
        puntoId={puntoId}
        selectedPunto={selectedPunto}
        editedDescription={editedDescription}
        setEditedDescription={setEditedDescription}
        errorMedicion={errorMedicion}
        setErrorMedicion={setErrorMedicion}
      />

      <TrayectoModal
        visible={trayectoModalVisible}
        onClose={handleCloseTrayectoModal}
        onConfirmar={confirmarTrayecto}
        trayectos={puntosReferencia
          .map((punto) => punto.trayecto)
          .filter(Boolean)}
        selectedPunto={tempPuntoData || selectedPunto}
        trayectoEditado={(tempPuntoData || selectedPunto)?.trayecto}
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
