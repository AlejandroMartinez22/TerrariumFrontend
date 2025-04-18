import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { obtenerSiguienteIdTrayecto } from "../supabase/getUltimoIdTrayecto"; // Importa la función

export default function TrayectoModal({
  visible,
  onClose,
  onConfirmar,
  trayectos = [],
  selectedPunto,
  trayectoEditado = null,
}) {
  const [medioTransporte, setMedioTransporte] = useState("Terrestre");
  const [duracion, setDuracion] = useState("");
  const [distancia, setDistancia] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [idTrayecto, setIdTrayecto] = useState("");
  const [errors, setErrors] = useState({
    duracion: false,
    distancia: false,
  });

  const transportOptions = ["Terrestre", "Marítimo", "Aéreo"];

  // Determinar si el formulario está completo para habilitar/deshabilitar el botón
  const isFormValid = duracion.trim() !== "" && distancia.trim() !== "";

  useEffect(() => {
    if (!visible) return;

    const inicializarDatos = async () => {
      if (trayectoEditado) {
        // Si estamos editando, usamos los valores del trayecto editado
        setMedioTransporte(trayectoEditado.medioTransporte || "Terrestre");
        setDuracion(trayectoEditado.duracion);
        setDistancia(trayectoEditado.distancia);
        setIdTrayecto(trayectoEditado.idTrayecto || trayectoEditado.id);
      } else {
        // Si estamos creando uno nuevo, generamos un nuevo ID desde la base de datos
        try {
          const nuevoId = await obtenerSiguienteIdTrayecto();
          console.log("Nuevo ID generado desde Supabase:", nuevoId);
          
          if (nuevoId) {
            setIdTrayecto(nuevoId);
          } else {
            // Si hay un error, usar un ID predeterminado
            setIdTrayecto("TR001");
            console.warn("No se pudo obtener un ID de la base de datos, usando ID predeterminado");
          }
        } catch (error) {
          console.error("Error al obtener el siguiente ID:", error);
          setIdTrayecto("TR001"); // ID por defecto en caso de error
        }
        
        setMedioTransporte("Terrestre");
        setDuracion("");
        setDistancia("");
      }

      // Reset errors when modal opens
      setErrors({
        duracion: false,
        distancia: false,
      });
      
      setShowDropdown(false);
    };

    inicializarDatos();
  }, [visible, trayectoEditado]);

  const validateFields = () => {
    let isValid = true;
    const newErrors = {
      duracion: false,
      distancia: false,
    };

    // Validate duration
    if (!duracion.trim()) {
      newErrors.duracion = true;
      isValid = false;
    }

    // Validate distance
    if (!distancia.trim()) {
      newErrors.distancia = true;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleGuardar = () => {
    if (!validateFields()) {
      Alert.alert(
        "Campos incompletos",
        "Por favor completa todos los campos antes de guardar.",
        [{ text: "Entendido", style: "default" }]
      );
      return;
    }

    const datosTrayecto = {
      idTrayecto,
      medioTransporte,
      duracion,
      distancia,
      puntoReferencia: {
        id: selectedPunto?.id,
        coordinate: selectedPunto?.coordinate,
      },
    };

    const esEdicion = !!trayectoEditado;
    onConfirmar(datosTrayecto, esEdicion);
  };

  const selectTransportOption = (option) => {
    setMedioTransporte(option);
    setShowDropdown(false);
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Trayecto Realizado</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.idText}>ID: {idTrayecto}</Text>

          <View style={styles.formContainer}>
            <View style={styles.formRow}>
              <Text style={styles.label}>Medio de transporte</Text>
              <TouchableOpacity
                style={styles.customSelect}
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <Text>{medioTransporte}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
              {showDropdown && (
                <View style={styles.dropdownMenu}>
                  {transportOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.dropdownItem}
                      onPress={() => selectTransportOption(option)}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          medioTransporte === option && styles.selectedOption,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formRow}>
              <Text style={styles.label}>Duración (Horas y Minutos)</Text>
              <TextInput
                style={[styles.input, errors.duracion && styles.inputError]}
                value={duracion}
                onChangeText={(text) => {
                  setDuracion(text);
                  if (text.trim()) {
                    setErrors(prev => ({...prev, duracion: false}));
                  }
                }}
                placeholder="00:00"
                keyboardType="numeric"
              />
              {errors.duracion && (
                <Text style={styles.errorText}>Este campo es obligatorio</Text>
              )}
            </View>

            <View style={styles.formRow}>
              <Text style={styles.label}>Distancia del Trayecto (km)</Text>
              <TextInput
                style={[styles.input, errors.distancia && styles.inputError]}
                value={distancia}
                onChangeText={(text) => {
                  setDistancia(text);
                  if (text.trim()) {
                    setErrors(prev => ({...prev, distancia: false}));
                  }
                }}
                placeholder="0.0"
                keyboardType="numeric"
              />
              {errors.distancia && (
                <Text style={styles.errorText}>Este campo es obligatorio</Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[
                  styles.guardarButton, 
                  !isFormValid && styles.guardarButtonDisabled
                ]}
                onPress={handleGuardar}
                disabled={!isFormValid}
              >
                <Text 
                  style={[
                    styles.guardarButtonText,
                    !isFormValid && styles.guardarButtonTextDisabled
                  ]}
                >
                  {trayectoEditado ? "✎ Actualizar" : "✓ Guardar"}
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 10,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center", 
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#999",
  },
  idText: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
    marginBottom: 10,
  },
  formContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  formRow: {
    width: "100%",
    marginBottom: 15,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    width: "100%",
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#FF6B6B",
    backgroundColor: "#FFEEEE",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 3,
    alignSelf: "flex-start",
  },
  customSelect: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#666",
  },
  dropdownMenu: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    fontSize: 14,
  },
  selectedOption: {
    fontWeight: "bold",
    color: "#4285F4",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  guardarButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  guardarButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  guardarButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  guardarButtonTextDisabled: {
    color: "#888888",
  },
});