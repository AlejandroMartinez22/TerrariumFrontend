import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { getCoordenadas } from "../supabase/getCoordenadas";
import { useBrigadista } from "../context/BrigadistaContext";
import { useReferenciaHandler } from "../hooks/useReferenciaHandler";

export default function MapScreen() {
  const { brigadista } = useBrigadista();
  const [coordenadas, setCoordenadas] = useState([]);
  const mapRef = useRef(null);
  const { puntosReferencia, handleAgregarReferencia, setPuntosReferencia } =
    useReferenciaHandler();

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
  const [errorMedicion, setErrorMedicion] = useState("");
  const [puntoId, setPuntoId] = useState("PR001");

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
      punto.description || ""
    );
    setPuntoId(`PR00${index + 1}`);
    setModalVisible(true);
  };

  const guardarCambios = () => {
    const nuevosPuntos = [...puntosReferencia];
    nuevosPuntos[selectedPunto.index] = {
      ...selectedPunto,
      title: editedTitle,
      description: editedDescription,
      errorMedicion: errorMedicion,
      id: puntoId
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
                `Lat: ${punto.latitude.toFixed(
                  5
                )}, Lng: ${punto.longitude.toFixed(5)}`
              }
              onPress={() => openModal(punto, index)}
            />
          ))}
        </MapView>
      </View>

      {/* MODAL DE EDICIÓN - REDISEÑADO */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Botón de cerrar en la esquina */}
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            {/* Encabezado */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Punto de Referencia</Text>
            </View>

            {/* Contenido del modal */}
            <View style={styles.modalBody}>
              {/* ID */}
              <View style={styles.idContainer}>
                <Text style={styles.idLabel}>ID: {puntoId}</Text>
              </View>

              {/* Coordenadas */}
              <View style={styles.coordsContainer}>
                <View style={styles.coordColumn}>
                  <Text style={styles.coordLabel}>Latitud</Text>
                  <TextInput
                    style={styles.coordInput}
                    value={selectedPunto ? selectedPunto.latitude.toFixed(5).toString() : ""}
                    editable={false}
                  />
                </View>
                <View style={styles.coordColumn}>
                  <Text style={styles.coordLabel}>Longitud</Text>
                  <TextInput
                    style={styles.coordInput}
                    value={selectedPunto ? selectedPunto.longitude.toFixed(5).toString() : ""}
                    editable={false}
                  />
                </View>
              </View>

              {/* Error de medición */}
              <View style={styles.errorContainer}>
                <Text style={styles.errorLabel}>Error en la medición (m)</Text>
                <TextInput
                  style={styles.errorInput}
                  value={errorMedicion}
                  onChangeText={setErrorMedicion}
                  keyboardType="numeric"
                  placeholder="+"
                />
              </View>

              {/* Descripción */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionLabel}>Descripción</Text>
                <TextInput
                  style={styles.descriptionInput}
                  value={editedDescription}
                  onChangeText={setEditedDescription}
                  multiline
                  numberOfLines={4}
                  placeholder="Descripción del punto de referencia..."
                />
              </View>

              {/* Botón de continuar */}
              <TouchableOpacity 
                style={styles.continueButton} 
                onPress={guardarCambios}
              >
                <Text style={styles.continueButtonText}>Continuar</Text>
                <Text style={styles.arrowIcon}>→</Text>
              </TouchableOpacity>
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
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
  },
  modalHeader: {
    padding: 15,
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  modalBody: {
    padding: 15,
  },
  idContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  idLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  coordsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  coordColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  coordLabel: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
    color: selectedColor => selectedColor === "Latitud" ? "#000" : "#ff6f00", // Latitud en negro, Longitud en naranja
  },
  coordInput: {
    backgroundColor: "#d3d3d3",
    padding: 8,
    borderRadius: 5,
    textAlign: "center",
  },
  errorContainer: {
    marginBottom: 15,
  },
  errorLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    height: 100,
    textAlignVertical: "top",
  },
  continueButton: {
    backgroundColor: "#4169e1", // Color azul para el botón
    padding: 12,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 5,
  },
  arrowIcon: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  }
});