import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  const isFormValid = (errorMedicion ?? "").trim() !== "";

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
            <Text style={styles.modalTitle}>
              Características de la subparcela
            </Text>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.idContainer}>
              <Text style={styles.idLabel}>ID: {puntoId}</Text>
            </View>
            
            <View style={styles.nameContainer}>
              <Text style={styles.nameLabel}>Nombre: {nombreSubparcela}</Text>
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
              <Text style={styles.errorLabel}>Error en la medición (m)</Text>
              <TextInput
                style={styles.errorInput}
                value={errorMedicion}
                onChangeText={setErrorMedicion}
                keyboardType="numeric"
                placeholder="Ingrese error"
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
    right: 15,
    top: 15,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666",
  },
  modalHeader: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalBody: {
    marginTop: 10,
  },
  idContainer: {
    marginBottom: 15,
  },
  idLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  nameContainer: {
    marginBottom: 15,
  },
  nameLabel: {
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
  },
  errorLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 8,
  },
  continueButton: {
    backgroundColor: "#1287A6",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 5,
  },
});

export default CaracteristicasModal;