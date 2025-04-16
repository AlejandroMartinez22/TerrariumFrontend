import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

// Opciones para los pickers
const COBERTURAS = [
  "Seleccionar cobertura...",
  "Bosque",
  "Matorral",
  "Pastizal",
  "Cultivo",
  "Suelo desnudo",
  "Cuerpo de agua"
];

const AFECTACIONES = [
  "Seleccionar afectación...",
  "Incendio",
  "Tala",
  "Plagas",
  "Erosión",
  "Contaminación",
  "Sequía"
];

const CaracteristicasModal = ({
  visible,
  onClose,
  onGuardar,
  puntoId,
  nombreSubparcela,
  selectedPunto,
  errorMedicion,
  setErrorMedicion,
}) => {
  // Estados para coberturas y afectaciones
  const [selectedCobertura, setSelectedCobertura] = useState("Seleccionar cobertura...");
  const [coberturas, setCoberturas] = useState([]);
  const [selectedAfectacion, setSelectedAfectacion] = useState("Seleccionar afectación...");
  const [afectaciones, setAfectaciones] = useState([]);

  // Función para agregar una cobertura
  const agregarCobertura = () => {
    if (selectedCobertura !== "Seleccionar cobertura..." && 
        !coberturas.includes(selectedCobertura)) {
      setCoberturas([...coberturas, selectedCobertura]);
      setSelectedCobertura("Seleccionar cobertura...");
    }
  };

  // Función para eliminar una cobertura
  const eliminarCobertura = (cobertura) => {
    setCoberturas(coberturas.filter(item => item !== cobertura));
  };

  // Función para agregar una afectación
  const agregarAfectacion = () => {
    if (selectedAfectacion !== "Seleccionar afectación..." && 
        !afectaciones.includes(selectedAfectacion)) {
      setAfectaciones([...afectaciones, selectedAfectacion]);
      setSelectedAfectacion("Seleccionar afectación...");
    }
  };

  // Función para eliminar una afectación
  const eliminarAfectacion = (afectacion) => {
    setAfectaciones(afectaciones.filter(item => item !== afectacion));
  };

  // Validación del formulario
  const isFormValid = (errorMedicion ?? "").trim() !== "";

  // Función para manejar el guardado de datos
  const handleGuardar = () => {
    // Crear objeto con todos los datos
    const datosSubparcela = {
      id: puntoId,
      errorMedicion,
      coberturas,
      afectaciones
    };
    
    // Llamar a la función de guardado pasada como prop
    onGuardar(datosSubparcela);
    
    // Limpiar estados
    setCoberturas([]);
    setAfectaciones([]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <ScrollView>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Características de la subparcela {nombreSubparcela}
              </Text>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>ID: {puntoId}</Text>
              </View>

              <View style={styles.coordsContainer}>
                <View style={styles.coordColumn}>
                  <Text style={styles.coordLabel}>Latitud</Text>
                  <TextInput
                    style={styles.coordInput}
                    value={
                      selectedPunto?.latitude.toFixed(5).toString() || ""
                    }
                    editable={false}
                  />
                </View>
                <View style={styles.coordColumn}>
                  <Text style={styles.coordLabel}>Longitud</Text>
                  <TextInput
                    style={styles.coordInput}
                    value={
                      selectedPunto?.longitude.toFixed(5).toString() || ""
                    }
                    editable={false}
                  />
                </View>
              </View>

              <View style={styles.errorContainer}>
                <Text style={styles.sectionLabel}>Error en la medición (m)</Text>
                <TextInput
                  style={styles.errorInput}
                  value={errorMedicion}
                  onChangeText={setErrorMedicion}
                  keyboardType="numeric"
                  placeholder="Ingrese error"
                />
              </View>

              {/* Sección de Coberturas */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Coberturas</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedCobertura}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedCobertura(itemValue)}
                  >
                    {COBERTURAS.map((item, index) => (
                      <Picker.Item key={index} label={item} value={item} />
                    ))}
                  </Picker>
                  <TouchableOpacity 
                    style={[
                      styles.addButton,
                      selectedCobertura === "Seleccionar cobertura..." && { opacity: 0.5 }
                    ]}
                    onPress={agregarCobertura}
                    disabled={selectedCobertura === "Seleccionar cobertura..."}
                  >
                    <Text style={styles.addButtonText}>Agregar</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Lista de coberturas agregadas */}
                {coberturas.length > 0 ? (
                  <View style={styles.listContainer}>
                    {coberturas.map((item, index) => (
                      <View key={index} style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item}</Text>
                        <TouchableOpacity 
                          style={styles.removeButton}
                          onPress={() => eliminarCobertura(item)}
                        >
                          <Text style={styles.removeButtonText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.emptyText}>No hay coberturas agregadas</Text>
                )}
              </View>

              {/* Sección de Afectaciones */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Afectaciones</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedAfectacion}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedAfectacion(itemValue)}
                  >
                    {AFECTACIONES.map((item, index) => (
                      <Picker.Item key={index} label={item} value={item} />
                    ))}
                  </Picker>
                  <TouchableOpacity 
                    style={[
                      styles.addButton,
                      selectedAfectacion === "Seleccionar afectación..." && { opacity: 0.5 }
                    ]}
                    onPress={agregarAfectacion}
                    disabled={selectedAfectacion === "Seleccionar afectación..."}
                  >
                    <Text style={styles.addButtonText}>Agregar</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Lista de afectaciones agregadas */}
                {afectaciones.length > 0 ? (
                  <View style={styles.listContainer}>
                    {afectaciones.map((item, index) => (
                      <View key={index} style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item}</Text>
                        <TouchableOpacity 
                          style={styles.removeButton}
                          onPress={() => eliminarAfectacion(item)}
                        >
                          <Text style={styles.removeButtonText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.emptyText}>No hay afectaciones agregadas</Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  !isFormValid && { backgroundColor: "#ccc" },
                ]}
                onPress={handleGuardar}
                disabled={!isFormValid}
              >
                <Text style={styles.continueButtonText}>Continuar</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  closeButton: {
    position: "absolute",
    right: 12,
    top: 6,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#666",
  },

  modalHeader: {
    marginBottom: 5,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalBody: {
    marginTop: 10,
  },
  infoContainer: {
    marginBottom: 15,
  },
  infoLabel: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
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
  },
  coordInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 8,
    backgroundColor: "#f5f5f5",
  },
  errorContainer: {
    marginBottom: 20,
    marginHorizontal: 8,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 8,
  },
  section: {
    marginBottom: 20,
    marginHorizontal: 8,
  },
  sectionLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  picker: {
    flex: 3,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  addButton: {
    flex: 1,
    backgroundColor: "#28a745",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    padding: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  listContainer: {
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  itemText: {
    flex: 1,
  },
  removeButton: {
    width: 24,
    height: 24,
    backgroundColor: "#dc3545",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyText: {
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  continueButton: {
    backgroundColor: "#1287A6",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  continueButtonText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 5,
  },
});

export default CaracteristicasModal;