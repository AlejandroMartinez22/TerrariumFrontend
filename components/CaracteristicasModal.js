//Es necesario eventualmente quitar el botón de cerrar, de momento se deja para probar pero ya después hay que quitarlo para evitar que el usuario se salga del flujo del tutorial.

import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import useCaracteristicasValidation from "../hooks/useCaracteristicasValidation"; // Importar el hook

// Opciones para los pickers
const COBERTURAS = [
  "Seleccionar",
  "Afloramiento rocoso",
  "Arbustal",
  "Bosque tierra firme",
  "Bosque inundable",
  "Cultivos",
  "Herbazal",
  "Matorral",
  "Pastizal",
  "Pantano",
  "Rastrojo",
  "Suelo desnudo",
  "Zona urbana"
];

const AFECTACIONES = [
  "Seleccionar",
  "Corte de Lianas",
  "Condición natural",
  "Evidencia aprovechamientos",
  "Deslizamientos",
  "Fuego",
  "Huracanes",
  "Inundaciones",
  "Pastoreo",
  "Plagas",
  "Vegetación invasora",
  "Sin Alteración"
];

// Opciones para severidad
const SEVERIDADES = [
  "Seleccionar",
  "FA",
  "MA",
  "NP",
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
  // Usar el hook de validación
  const {
    selectedCobertura,
    setSelectedCobertura,
    porcentajeCobertura,
    setPorcentajeCobertura,
    coberturas,
    setCoberturas,
    coberturasError,
    
    selectedAfectacion,
    setSelectedAfectacion,
    selectedSeveridad,
    setSelectedSeveridad,
    afectaciones,
    setAfectaciones,
    afectacionesError,
    
    agregarCobertura,
    eliminarCobertura,
    agregarAfectacion,
    eliminarAfectacion,
    limpiarEstados,
    calcularSumaPorcentajes,
    
    botonCoberturasHabilitado,
    botonAfectacionesHabilitado
  } = useCaracteristicasValidation();

  // Limpiar estados al cerrar
  useEffect(() => {
    if (!visible) {
      limpiarEstados();
    }
  }, [visible]);

  // Validación del formulario
  const isFormValid = 
    (errorMedicion ?? "").trim() !== "" && 
    coberturas.length > 0 && 
    afectaciones.length > 0;

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
    limpiarEstados();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Características de la subparcela {nombreSubparcela}
              </Text>
            </View>

            <View style={styles.modalBody}>
              {/* Sección de información principal */}
              <View style={styles.mainSection}>
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
              </View>

              {/* Separador */}
              <View style={styles.divider} />

              {/* Sección de Coberturas */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Coberturas</Text>
                
                <View style={styles.rowContainer}>
                  <View style={styles.columnLeft}>
                    <Text style={styles.labelSecundario}>Tipo de cobertura</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={selectedCobertura}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedCobertura(itemValue)}
                      >
                        {COBERTURAS.map((item, index) => (
                          <Picker.Item key={index} label={item} value={item} style={styles.pickerText}/>
                        ))}
                      </Picker>
                    </View>
                  </View>
                  
                  <View style={styles.columnRight}>
                    <Text style={styles.labelSecundario}>%</Text>
                    <TextInput
                      style={styles.porcentajeInput}
                      value={porcentajeCobertura}
                      onChangeText={setPorcentajeCobertura}
                      keyboardType="numeric"
                      placeholder="1-99"
                      maxLength={2}
                    />
                  </View>
                </View>
                
                {coberturasError ? (
                  <Text style={styles.errorText}>{coberturasError}</Text>
                ) : null}
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.addButton,
                      !botonCoberturasHabilitado && { opacity: 0.5 }
                    ]}
                    onPress={agregarCobertura}
                    disabled={!botonCoberturasHabilitado}
                  >
                    <Text style={styles.addButtonText}>Agregar</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Lista de coberturas agregadas */}
                {coberturas.length > 0 && (
                  <View style={styles.listContainer}>
                    {coberturas.map((item, index) => (
                      <View key={index} style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.tipo} - {item.porcentaje}%</Text>
                        <TouchableOpacity 
                          style={styles.removeButton}
                          onPress={() => eliminarCobertura(item)}
                        >
                          <Text style={styles.removeButtonText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={styles.counterText}>
                  {coberturas.length}/4 coberturas
                </Text>
              </View>

              {/* Separador */}
              <View style={styles.divider} />

              {/* Sección de Afectaciones */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Afectaciones</Text>
                
                <View style={styles.rowContainer}>
                  <View style={styles.columnLeft}>
                    <Text style={styles.labelSecundario}>Tipo de afectación</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={selectedAfectacion}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedAfectacion(itemValue)}
                      >
                        {AFECTACIONES.map((item, index) => (
                          <Picker.Item key={index} label={item} value={item} style={styles.pickerText}/>
                        ))}
                      </Picker>
                    </View>
                  </View>
                  
                  <View style={styles.columnRight}>
                    <Text style={styles.labelSecundario}>Severidad</Text>
                    <View style={styles.pickerContainerSeveridad}>
                      <Picker
                        selectedValue={selectedSeveridad}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedSeveridad(itemValue)}
                      >
                        {SEVERIDADES.map((item, index) => (
                          <Picker.Item key={index} label={item} value={item} style={styles.pickerSeveridadText}/>
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>
                
                {afectacionesError ? (
                  <Text style={styles.errorText}>{afectacionesError}</Text>
                ) : null}
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.addButton,
                      !botonAfectacionesHabilitado && { opacity: 0.5 }
                    ]}
                    onPress={agregarAfectacion}
                    disabled={!botonAfectacionesHabilitado}
                  >
                    <Text style={styles.addButtonText}>Agregar</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Lista de afectaciones agregadas */}
                {afectaciones.length > 0 && (
                  <View style={styles.listContainer}>
                    {afectaciones.map((item, index) => (
                      <View key={index} style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.tipo} - {item.severidad}</Text>
                        <TouchableOpacity 
                          style={styles.removeButton}
                          onPress={() => eliminarAfectacion(item)}
                        >
                          <Text style={styles.removeButtonText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={styles.counterText}>
                  {afectaciones.length}/4 afectaciones
                </Text>
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
  modalHeader: {
    marginBottom: 10,
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
  // Nueva sección para mejorar la organización
  mainSection: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  infoContainer: {
    marginBottom: 15,
  },
  infoLabel: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#4F4D4D"
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
    marginTop: 5,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 8,
    height: 40,
  },
  // Divider para separar secciones
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
    width: "100%",
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#4F4D4D",
    textAlign: "center",
  },
  sectionLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    marginTop: 0,
    alignItems: "flex-end",
  },
  columnLeft: {
    flex: 2,
    marginRight: 8,
  },
  columnRight: {
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: 'hidden',
    height: 48,
  },
  pickerContainerSeveridad: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: 'hidden',
    height: 48,
  },
  picker: {
    height: 48,
    width: '100%',
  },
  pickerText: {
    fontSize: 13,
  },
  pickerSeveridadText: {
    fontSize: 9.8,
  },
  labelSecundario: {
    fontSize: 13,
    marginBottom: 5,
  },
  porcentajeInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#28a745",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    width: 100,
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
    width: 20,
    height: 20,
    backgroundColor: "#dc3545",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 10,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5,
  },
  counterText: {
    fontSize: 12,
    color: "#555",
    fontStyle: "italic",
    textAlign: "right",
    marginTop: 5,
  },
  continueButton: {
    backgroundColor: "#1287A6",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: "40%", 
    alignSelf: "center",
  },
  continueButtonText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 5,
  },
});

export default CaracteristicasModal;