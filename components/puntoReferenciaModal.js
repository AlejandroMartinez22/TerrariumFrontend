import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const ReferenciaModal = ({
  visible,
  onClose,
  onContinuar,
  onEliminar,
  puntoId,
  selectedPunto,
  editedDescription,
  setEditedDescription,
  errorMedicion,
  setErrorMedicion,
}) => {
  const [descriptionError, setDescriptionError] = useState("");
  
  // Función para contar palabras en un texto
  const countWords = (text) => {
    if (!text || text.trim() === "") return 0;
    return text.trim().split(/\s+/).length;
  };
  
  // Validar la descripción cuando cambie
  useEffect(() => {
    const wordCount = countWords(editedDescription);
    if (editedDescription.trim() === "") {
      setDescriptionError("");
    } else if (wordCount < 5) {
      setDescriptionError("La descripción debe tener al menos 5 palabras");
    } else {
      setDescriptionError("");
    }
  }, [editedDescription]);
  
  // Actualizar validación del formulario incluyendo la condición de 5 palabras
  const isFormValid =
    editedDescription.trim() !== "" && 
    errorMedicion.trim() !== "" &&
    countWords(editedDescription) >= 5;

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
                  value={
                    selectedPunto?.latitude
                      ? selectedPunto.latitude.toFixed(5).toString()
                      : ""
                  }
                  editable={false}
                />
              </View>
              <View style={styles.coordColumn}>
                <Text style={styles.coordLabel}>Longitud</Text>
                <TextInput
                  style={styles.coordInput}
                  value={
                    selectedPunto?.longitude
                      ? selectedPunto.longitude.toFixed(5).toString()
                      : ""
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

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>Descripción</Text>
              <TextInput
                style={[
                  styles.descriptionInput,
                  descriptionError ? styles.inputError : null
                ]}
                value={editedDescription}
                onChangeText={setEditedDescription}
                multiline
                numberOfLines={4}
                placeholder="Descripción del punto de referencia..."
              />
              {descriptionError ? (
                <Text style={styles.errorText}>{descriptionError}</Text>
              ) : null}
              <Text style={styles.wordCount}>
                Palabras: {countWords(editedDescription)}/5
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  !isFormValid && { backgroundColor: "#ccc" },
                ]}
                onPress={onContinuar}
                disabled={!isFormValid}
              >
                <Text style={styles.buttonText}>Continuar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={onEliminar}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
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
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  wordCount: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    textAlign: "right",
  },
  buttonRow: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  saveButton: {
    backgroundColor: "#4169e1",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "80%",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ReferenciaModal;