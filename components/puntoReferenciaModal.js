import React, { useState, useEffect, useCallback } from "react";
// importar los componentes de React Native
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
// importar el hook useDecimalValidation para validar el error de medición
import useDecimalValidation from "../hooks/useDecimalValidation";
// importar la función obtenerReferenciaPorIdDesdeBackend para obtener la referencia por ID
import { obtenerReferenciaPorIdDesdeBackend } from "../api";
// importar el hook para verificación de campamento
import { useCampamentoVerificacion } from "../hooks/useCampamentoVerificacion";

// importar el componente ReferenciaModal
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
  cedulaUsuarioActual, 
  isNewPoint = false,
  tipoPunto = "Referencia", // Valor predeterminado "Referencia"
  setTipoPunto, // Función para actualizar el tipo de punto
}) => {
  // Hook de verificación de campamento
  const { 
    isVerifying: verificandoCampamento, 
    existeCampamento, 
    verificarCampamento,
    error: errorCampamento 
  } = useCampamentoVerificacion();
  
  // Si no se proporciona setTipoPunto desde el padre, creamos un estado interno
  const [tipoPuntoInterno, setTipoPuntoInterno] = useState(tipoPunto);
  
  // Función que maneja el cambio de tipo de punto, usando la función del padre si existe
  const handleTipoPuntoChange = (tipo) => {
    // No permitir cambiar a Campamento si ya existe uno y este punto no es el campamento existente
    if (tipo === "Campamento" && isCampamentoDisabled()) {
      return;
    }
    
    if (setTipoPunto) {
      setTipoPunto(tipo);
    } else {
      setTipoPuntoInterno(tipo);
    }
  };
  
  // Valor actual del tipo de punto (usando el interno si no hay externo)
  const currentTipoPunto = setTipoPunto ? tipoPunto : tipoPuntoInterno;
  
  // Estado para manejar la descripción del punto
  const [descriptionError, setDescriptionError] = useState("");
  // Estado para verificar si el usuario es el propietario del punto
  const [isUserOwner, setIsUserOwner] = useState(false);
  // Estado para verificar si se está comprobando la propiedad del punto
  const [isCheckingOwner, setIsCheckingOwner] = useState(true);
  
  // Usamos nuestro hook personalizado con el valor inicial
  const [errorMedicion, setErrorMedicion, errorMedicionError, isErrorMedicionValid] = 
    useDecimalValidation(initialErrorMedicion, 9.9, 1);
  
  // Verificar si existe un campamento cuando se abra el modal
  useEffect(() => {
    if (visible) {
      verificarCampamento();
    }
  }, [visible]);

  useEffect(() => {
    // Agregamos una verificación inmediata solo cuando se abre el modal
    if (visible) {
      // Añadimos un pequeño retraso para evitar problemas de estado
      const timer = setTimeout(verificarCampamento, 100);
      return () => clearTimeout(timer);
    }
  }, [visible]);
  
  // Método para determinar si el radiobutton de Campamento debe estar deshabilitado
  const isCampamentoDisabled = () => {
    // Si estamos editando un punto que ya es campamento, permitimos mantenerlo
    if (!isNewPoint && selectedPunto?.tipo === "Campamento") {
      return false;
    }
    
    // Si estamos verificando, no deshabilitamos para evitar cambios de UI bruscos
    if (verificandoCampamento) {
      return false;
    }
    
    // Solo deshabilitamos si tenemos confirmación de que existe un campamento
    return existeCampamento;
  };
  
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
  
  // para establecer correctamente el tipoPunto al editar un punto existente
  useEffect(() => {
    if (visible && selectedPunto && !isNewPoint) {
      // Si estamos editando un punto existente, cargar su tipo
      if (setTipoPunto) {
        setTipoPunto(selectedPunto.tipo || "Referencia");
      } else {
        setTipoPuntoInterno(selectedPunto.tipo || "Referencia");
      }
    } else if (visible && isNewPoint) {
      // Si es un punto nuevo, reiniciar al valor predeterminado
      if (setTipoPunto) {
        setTipoPunto("Referencia");
      } else {
        setTipoPuntoInterno("Referencia");
      }
    }
  }, [visible, selectedPunto, isNewPoint]);

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
    (currentTipoPunto === "Referencia" || currentTipoPunto === "Campamento") &&
    (isNewPoint || isUserOwner); // Permitir si es nuevo punto O si el usuario es propietario

  // Determinar si mostrar el mensaje sobre la existencia de un campamento
  // Ahora solo lo mostramos si el usuario puede editar el punto (es propietario o es un punto nuevo)
  // Y no mostramos el mensaje si estamos editando un punto que originalmente era un campamento
  const isEditingExistingCampamento = !isNewPoint && selectedPunto?.tipo === "Campamento";
  const shouldShowCampamentoMessage = (isNewPoint || isUserOwner) && existeCampamento && currentTipoPunto !== "Campamento" && !verificandoCampamento && !isEditingExistingCampamento;

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

            {/* Agregar radio buttons para seleccionar el tipo de punto */}
            <View style={styles.typeContainer}>
              <Text style={styles.typeLabel}>Tipo de punto</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity 
                  style={styles.radioOption}
                  onPress={() => handleTipoPuntoChange("Referencia")}
                  disabled={!isNewPoint && !isUserOwner}
                  activeOpacity={0.6}
                >
                  <View style={[
                    styles.radioButton,
                    currentTipoPunto === "Referencia" && styles.radioButtonActive
                  ]}>
                    {currentTipoPunto === "Referencia" && <View style={styles.radioButtonSelected} />}
                  </View>
                  <Text style={[
                    styles.radioText,
                    currentTipoPunto === "Referencia" && styles.radioTextSelected
                  ]}>Referencia</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.radioOption,
                    isCampamentoDisabled() && styles.radioOptionDisabled
                  ]}
                  onPress={() => handleTipoPuntoChange("Campamento")}
                  disabled={(!isNewPoint && !isUserOwner) || isCampamentoDisabled()}
                  activeOpacity={0.6}
                >
                  <View style={[
                    styles.radioButton,
                    currentTipoPunto === "Campamento" && styles.radioButtonActive,
                    isCampamentoDisabled() && styles.radioButtonDisabled
                  ]}>
                    {currentTipoPunto === "Campamento" && <View style={styles.radioButtonSelected} />}
                  </View>
                  <Text style={[
                    styles.radioText,
                    currentTipoPunto === "Campamento" && styles.radioTextSelected,
                    isCampamentoDisabled() && styles.radioTextDisabled
                  ]}>Campamento</Text>
                </TouchableOpacity>
              </View>
            </View>

            {verificandoCampamento ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#4169e1" />
                <Text style={styles.loadingText}>Verificando puntos existentes...</Text>
              </View>
            ) : errorCampamento ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  No se pudo verificar si existe un campamento. Por precaución, 
                  se ha deshabilitado la opción de crear un campamento nuevo.
                </Text>
              </View>
            ) : shouldShowCampamentoMessage ? (
              <Text style={styles.infoText}>
                Ya existe un punto de campamento para este conglomerado.
              </Text>
            ) : null}

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
                  (!isFormValid || isCheckingOwner || verificandoCampamento) && { backgroundColor: "#ccc" }
                ]}
                onPress={onContinuar}
                disabled={!isFormValid || isCheckingOwner || verificandoCampamento}
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
};

// Definimos los estilos para el componente ReferenciaModal
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
    marginTop: 8,
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

  // Estilos para los radio buttons
  typeContainer: {
    marginBottom: 15,
  },

  typeLabel: {
    fontSize: 14,
    marginBottom: 22,
    color: "#555",
    textAlign: "center", 
  },

  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioOptionDisabled: {
    opacity: 0.5,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4169e1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioButtonActive: {
    borderColor: "#4169e1",
  },
  radioButtonDisabled: {
    borderColor: "#ccc",
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#4169e1",
  },
  radioText: {
    fontSize: 14,
    color: "#333",
  },
  radioTextSelected: {
    color: "#4169e1",
    fontWeight: "500",
  },
  radioTextDisabled: {
    color: "#999",
  },
  infoText: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 11,
    color: "#ff6347",
    fontStyle: "italic",
    textAlign: "center", 
  }
});

export default ReferenciaModal;