import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

const CaracteristicasModal = ({
  visible,
  onClose,
  onGuardar,
  puntoId,
  selectedPunto,
  errorMedicion,
  setErrorMedicion,
  selectedOption,
  setSelectedOption,
  selectedNumber,
  setSelectedNumber,
}) => {
  const isFormValid =
    selectedOption !== "" &&
    selectedNumber.trim() !== "" &&
    errorMedicion.trim() !== "";

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

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Punto de Referencia</Text>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.idContainer}>
              <Text style={styles.idLabel}>ID: {puntoId}</Text>
            </View>

            <View style={styles.coordsContainer}>
              <View style={styles.coordColumn}>
                <Text style={styles.coordLabel}>Latitud</Text>
                <TextInput
                  style={styles.coordInput}
                  value={selectedPunto?.latitude.toFixed(5).toString() || ""}
                  editable={false}
                />
              </View>
              <View style={styles.coordColumn}>
                <Text style={styles.coordLabel}>Longitud</Text>
                <TextInput
                  style={styles.coordInput}
                  value={selectedPunto?.longitude.toFixed(5).toString() || ""}
                  editable={false}
                />
              </View>
            </View>

            <View style={styles.errorContainer}>
              <Text style={styles.errorLabel}>Error en la medición (m)</Text>
              <TextInput
                style={styles.errorInput}
                value={errorMedicion}
                onChangeText={setErrorMedicion}
                keyboardType="numeric"
                placeholder="Ingrese error"
              />
            </View>

            {/* Selector + input numérico */}
            <View style={styles.comboContainer}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedOption}
                  onValueChange={(itemValue) => setSelectedOption(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccione una opción" value="" />
                  <Picker.Item label="Opción A" value="opcionA" />
                  <Picker.Item label="Opción B" value="opcionB" />
                  <Picker.Item label="Opción C" value="opcionC" />
                </Picker>
              </View>

              <TextInput
                style={styles.numberInput}
                value={selectedNumber}
                onChangeText={(text) => {
                  const numeric = text.replace(/[^0-9]/g, "");
                  if (parseInt(numeric) <= 99 || numeric === "") {
                    setSelectedNumber(numeric);
                  }
                }}
                keyboardType="numeric"
                placeholder="0–99"
                maxLength={2}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                !isFormValid && { backgroundColor: "#ccc" },
              ]}
              onPress={onGuardar}
              disabled={!isFormValid}
            >
              <Text style={styles.continueButtonText}>Continuar</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  comboContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pickerContainer: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
    overflow: "hidden",
  },
  picker: {
    height: 40,
    width: "100%",
  },
  numberInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    textAlign: "center",
  },
  continueButton: {
    backgroundColor: "#4169e1",
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    width: "60%",
    alignSelf: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 5,
    fontSize: 15,
  },
});

export default ReferenciaModal;
