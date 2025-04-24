
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import useDecimalValidation from "../hooks/useDecimalValidation"; // Importamos el hook personalizado
import { obtenerReferenciaPorIdDesdeBackend } from "../api";

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
  cedulaUsuarioActual, // Añadimos la cédula del usuario actual como prop
  isNewPoint = false, // Nueva prop para indicar si estamos creando un nuevo punto
}) => {
  const [descriptionError, setDescriptionError] = useState("");
  const [isUserOwner, setIsUserOwner] = useState(false); // Estado para verificar si el usuario es el creador
  const [isCheckingOwner, setIsCheckingOwner] = useState(true); // Estado para mostrar indicador de carga
  
  // Usamos nuestro hook personalizado con el valor inicial
  const [errorMedicion, setErrorMedicion, errorMedicionError, isErrorMedicionValid] = 
    useDecimalValidation(initialErrorMedicion, 9.9, 1);
  
  // Verificar si el usuario es el propietario del punto cuando se abre el modal
  useEffect(() => {
    const checkOwnership = async () => {
      if (visible) {
        setIsCheckingOwner(true);
        
        // Si es un punto nuevo, automáticamente el usuario es propietario
        if (isNewPoint) {
          setIsUserOwner(true);
          setIsCheckingOwner(false);
          return;
        }
        
        // Solo verificamos propiedad si es un punto existente
        if (puntoId) {
          try {
            const referencia = await obtenerReferenciaPorIdDesdeBackend(puntoId);
            setIsUserOwner(referencia && referencia.cedula_brigadista === cedulaUsuarioActual);
          } catch (error) {
            console.error("Error al verificar propietario:", error);
            setIsUserOwner(false);
          }
        } else {
          // Si no hay puntoId pero no es nuevo punto (caso raro), por seguridad no es propietario
          setIsUserOwner(false);
        }
        
        setIsCheckingOwner(false);
      }
    };
    
    checkOwnership();
  }, [visible, puntoId, cedulaUsuarioActual, isNewPoint]);
  


  
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
  // Si es un punto nuevo o si el usuario es propietario del punto existente, se permite la edición
  const isFormValid =
    editedDescription.trim() !== "" && 
    countWords(editedDescription) >= 5 &&
    errorMedicion.trim() !== "" && 
    isErrorMedicionValid &&
    (isNewPoint || isUserOwner); // Permitir si es nuevo punto O si el usuario es propietario

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
              {isNewPoint ? "Nuevo Punto de Referencia" : "Punto de Referencia"}
            </Text>
          </View>

          <View style={styles.modalBody}>
            {!isNewPoint && (
              <View style={styles.idContainer}>
                <Text style={styles.idLabel}>ID: {puntoId}</Text>
              </View>
            )}

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
                editable={isNewPoint || isUserOwner} // Editable si es nuevo punto o es propietario
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
                editable={isNewPoint || isUserOwner} // Editable si es nuevo punto o es propietario
              />
              {descriptionError ? (
                <Text style={styles.errorText}>{descriptionError}</Text>
              ) : null}
            </View>

            {isCheckingOwner ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#4169e1" />
                <Text style={styles.loadingText}>Verificando permisos...</Text>
              </View>
            ) : !isUserOwner && !isNewPoint ? (
              <View style={styles.notOwnerContainer}>
                <Text style={styles.notOwnerText}>
                  No tienes permisos para editar este punto de referencia.
                </Text>
              </View>
            ) : null}

            {/* Modificación aquí: Usamos diferentes estilos según haya uno o dos botones */}
            <View style={isNewPoint ? styles.singleButtonContainer : styles.buttonRow}>
              {!isNewPoint && (
                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    (!isUserOwner || isCheckingOwner) && { backgroundColor: "#ccc" }
                  ]}
                  onPress={onEliminar}
                  disabled={!isUserOwner || isCheckingOwner}
                >
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[
                  isNewPoint ? styles.centeredButton : styles.saveButton,
                  (!isFormValid || isCheckingOwner) && { backgroundColor: "#ccc" }
                ]}
                onPress={onContinuar}
                disabled={!isFormValid || isCheckingOwner}
              >
                <Text style={styles.buttonText}>
                  {isNewPoint ? "Crear" : "Continuar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

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
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 15,
  },
  loadingText: {
    marginLeft: 10,
    color: "#666",
  },
  notOwnerContainer: {
    backgroundColor: "#fff8dc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ffd700",
  },
  notOwnerText: {
    color: "#8b4513",
    textAlign: "center",
  },
  singleButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  centeredButton: {
    backgroundColor: "#4169e1",
    borderRadius: 5,
    padding: 12,
    width: "50%", // Ancho del 50% para que se vea centrado y proporcionado
    alignItems: "center",
  },

});

export default ReferenciaModal;