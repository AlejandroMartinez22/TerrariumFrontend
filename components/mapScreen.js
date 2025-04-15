import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Modal,
  Text,
  TextInput,
  Button,
} from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { getCoordenadas } from "../supabase/getCoordenadas";
import { useBrigadista } from "../context/BrigadistaContext";
import { useReferenciaHandler } from "../hooks/useReferenciaHandler";

export default function MapScreen() {
  const { brigadista } = useBrigadista();
  const [coordenadas, setCoordenadas] = useState([]);
  const mapRef = useRef(null);
  const {
    puntosReferencia,
    handleAgregarReferencia,
    setPuntosReferencia,
  } = useReferenciaHandler();

  const defaultCenter = {
    latitude: 7.12539,
    longitude: -73.1198,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPunto, setSelectedPunto] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

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

  const openModal = (punto, index) => {
    setSelectedPunto({ ...punto, index });
    setEditedTitle(punto.title || `Punto de referencia ${index + 1}`);
    setEditedDescription(
      punto.description ||
        `Lat: ${punto.latitude.toFixed(5)}, Lng: ${punto.longitude.toFixed(5)}`
    );
    setModalVisible(true);
  };

  const guardarCambios = () => {
    const nuevosPuntos = [...puntosReferencia];
    nuevosPuntos[selectedPunto.index] = {
      ...selectedPunto,
      title: editedTitle,
      description: editedDescription,
    };
    setPuntosReferencia(nuevosPuntos);
    setModalVisible(false);
  };

  const eliminarPunto = () => {
    const nuevosPuntos = puntosReferencia.filter(
      (_, i) => i !== selectedPunto.index
    );
    setPuntosReferencia(nuevosPuntos);
    setModalVisible(false);
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
          onLongPress={handleAgregarReferencia}
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
            <Marker
              key={`ref-${index}`}
              coordinate={punto}
              pinColor="green"
              title={punto.title || `Punto de referencia ${index + 1}`}
              description={
                punto.description ||
                `Lat: ${punto.latitude.toFixed(5)}, Lng: ${punto.longitude.toFixed(5)}`
              }
              onPress={() => openModal(punto, index)}
            />
          ))}
        </MapView>
      </View>

      {/* MODAL DE EDICIÓN */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Punto de Referencia</Text>
            <TextInput
              style={styles.input}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Título"
            />
            <TextInput
              style={styles.input}
              value={editedDescription}
              onChangeText={setEditedDescription}
              placeholder="Descripción"
              multiline
            />
            <View style={styles.buttonRow}>
              <Button title="Guardar" onPress={guardarCambios} />
              <Button title="Eliminar" onPress={eliminarPunto} color="red" />
              <Button
                title="Cancelar"
                onPress={() => setModalVisible(false)}
                color="gray"
              />
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});
