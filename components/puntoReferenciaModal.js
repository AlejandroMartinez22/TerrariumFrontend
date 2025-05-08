// Modificar el archivo puntoreferenciamodal.js

import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import useDecimalValidation from "../hooks/useDecimalValidation";
import { obtenerReferenciaPorIdDesdeBackend } from "../api";
import { useCampamentoVerification } from "../hooks/useCampamentoVerification"; // Importar el nuevo hook

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
  tipoPunto = "Referencia",
  setTipoPunto,
}) => {
  // Hook de verificación de campamento
  const { 
    isVerifying: verificandoCampamento, 
    existeCampamento, 
    verificarCampamento 
  } = useCampamentoVerification();
  
  const [tipoPuntoInterno, setTipoPuntoInterno] = useState(tipoPunto);
  const [descriptionError, setDescriptionError] = useState("");
  const [isUserOwner, setIsUserOwner] = useState(false);
  const [isCheckingOwner, setIsCheckingOwner] = useState(true);
  
  const [errorMedicion, setErrorMedicion, errorMedicionError, isErrorMedicionValid] = 
    useDecimalValidation(initialErrorMedicion, 9.9, 1);
  
  // Verificar si existe un campamento cuando se abra el modal
  useEffect(() => {
    if (visible) {
      verificarCampamento();
    }
  }, [visible]);
  
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
  
  // Método para determinar si el radiobutton de Campamento debe estar deshabilitado
  const isCampamentoDisabled = () => {
    // Si es un punto existente que ya es de tipo Campamento, permitimos que se mantenga seleccionado
    if (!isNewPoint && selectedPunto?.tipo === "Campamento") {
      return false;
    }
    
    // Para puntos nuevos o puntos que no son de tipo Campamento, deshabilitamos si ya existe un campamento
    return existeCampamento;
  };

  // Función que maneja el cambio de tipo de punto, usando la función del padre si existe
  const handleTipoPuntoChange = (tipo) => {
    console.log("Cambiando tipo a:", tipo);
    
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
  
  // para establecer correctamente el tipoPunto al editar un punto existente
  useEffect(() => {
    if (modalVisible && selectedPunto && !isNewPoint) {
      // Si estamos editando un punto existente, cargar su tipo
      setTipoPunto(selectedPunto.tipo || "Referencia");
    } else if (modalVisible && isNewPoint) {
      // Si es un punto nuevo, reiniciar al valor predeterminado
      setTipoPunto("Referencia");
    }
  }, [modalVisible, selectedPunto, isNewPoint]);
  
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
              <Text style={styles.typeLabel}>Tipo de punto:</Text>
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
              
              {/* Mensaje de información cuando ya existe un campamento */}
              {existeCampamento && currentTipoPunto !== "Campamento" && (
                <Text style={styles.infoText}>
                  Ya existe un punto de campamento para este conglomerado.
                </Text>
              )}
            </View>

            {verificandoCampamento ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#4169e1" />
                <Text style={styles.loadingText}>Verificando puntos existentes...</Text>
              </View>
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

// Añadir estos nuevos estilos
const styles = StyleSheet.create({
  // ... estilos existentes
  
  // Estilos adicionales para el estado deshabilitado de los radio buttons
  radioOptionDisabled: {
    opacity: 0.5,
  },
  radioButtonDisabled: {
    borderColor: "#ccc",
  },
  radioTextDisabled: {
    color: "#999",
  },
  infoText: {
    marginTop: 8,
    fontSize: 12,
    color: "#ff6347",
    fontStyle: "italic",
  },
  // ... resto de estilos existentes
});

export default ReferenciaModal;