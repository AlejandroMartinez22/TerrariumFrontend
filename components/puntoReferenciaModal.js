import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import useDecimalValidation from "../hooks/useDecimalValidation"; // Importamos el hook personalizado

const ReferenciaModal = ({
  visible,
  onClose,
  onContinuar,
  onEliminar,
  puntoId,
  selectedPunto,
  editedDescription,
  setEditedDescription,
  errorMedicion: initialErrorMedicion,
  setErrorMedicion: originalSetErrorMedicion,
}) => {
  const [descriptionError, setDescriptionError] = useState("");
  
  // Usamos nuestro hook personalizado con el valor inicial
  const [errorMedicion, setErrorMedicion, errorMedicionError, isErrorMedicionValid] = 
    useDecimalValidation(initialErrorMedicion, 9.9, 1);
  
  // Reiniciar los campos cuando el modal se abre (cuando visible cambia a true)
  useEffect(() => {
    if (visible) {
      // Aquí solo actualizamos el estado interno del hook
      setErrorMedicion(initialErrorMedicion);
    } else {
      // Cuando el modal se cierra, reiniciamos el valor en el componente padre
      if (errorMedicion !== '') {
        originalSetErrorMedicion('');
      }
    }
  }, [visible]);
  
  // Actualizar el estado externo cuando el valor cambie y sea válido
  useEffect(() => {
    originalSetErrorMedicion(errorMedicion);
  }, [errorMedicion]);
  
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
  
  // Actualizar validación del formulario incluyendo todas las condiciones
  const isFormValid =
    editedDescription.trim() !== "" && 
    countWords(editedDescription) >= 5 &&
    errorMedicion.trim() !== "" && 
    isErrorMedicionValid;

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
                style={[
                  styles.errorInput,
                  errorMedicionError ? styles.inputError : null
                ]}
                value={errorMedicion}
                onChangeText={setErrorMedicion}
                keyboardType="numeric"
                placeholder="Ingrese el error"
              />
              {errorMedicionError ? (
                <Text style={styles.errorText}>{errorMedicionError}</Text>
              ) : null}
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
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={onEliminar}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
              
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
  buttonRow: {
    flexDirection: "row",  // Cambiado de "column" a "row"
    justifyContent: "space-between", // Para separar los botones
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#4169e1",
    padding: 10,
    borderRadius: 5,
    width: "45%", // Reducido de 80% a 48%
    alignItems: "center",
    margin:10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    width: "45%", // Reducido de 80% a 48%
    alignItems: "center",
    margin: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ReferenciaModal;