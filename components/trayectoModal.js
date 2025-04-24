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
import { getUltimoIdTrayectoDeBack } from "../api";

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
  const isFormValid = duracion && duracion.trim() !== "" && distancia && distancia.trim() !== "";

  useEffect(() => {
    // Verificamos si el modal está visible
    if (!visible) return;

    const inicializarDatos = async () => {
      // Reiniciamos los errores cuando se abre el modal
      setErrors({
        duracion: false,
        distancia: false,
      });
      
      // Ocultamos el dropdown
      setShowDropdown(false);
      
      if (trayectoEditado) {
        console.log("Cargando datos del trayecto existente:", trayectoEditado);
        
        // Si estamos editando, usamos los valores del trayecto editado
        // Asegúrate de que todas las propiedades existan o proporciona valores predeterminados
        setMedioTransporte(trayectoEditado.medioTransporte || "Terrestre");
        
        // Convertimos a string los valores en caso de que sean números
        const duracionStr = trayectoEditado.duracion != null ? String(trayectoEditado.duracion) : "";
        const distanciaStr = trayectoEditado.distancia != null ? String(trayectoEditado.distancia) : "";
        
        setDuracion(duracionStr);
        setDistancia(distanciaStr);
        setIdTrayecto(trayectoEditado.idTrayecto || trayectoEditado.id || "");
      } else {
        // Si estamos creando uno nuevo, generamos un nuevo ID desde la base de datos
        try {
          // Utilizamos la función importada para obtener el ID del backend
          const nuevoId = await getUltimoIdTrayectoDeBack();
          console.log("Nuevo ID generado desde el backend:", nuevoId);
          
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
        
        // Reiniciar valores para un nuevo trayecto
        setMedioTransporte("Terrestre");
        setDuracion("");
        setDistancia("");
      }
    };

    inicializarDatos();
  }, [visible, trayectoEditado]);

  // Para debugging - registrar los cambios en las variables principales
  useEffect(() => {
    console.log("Estado actual:", {
      medioTransporte,
      duracion,
      distancia,
      idTrayecto,
      trayectoEditadoPresente: !!trayectoEditado
    });
  }, [medioTransporte, duracion, distancia, idTrayecto, trayectoEditado]);

  const validateFields = () => {
    let isValid = true;
    const newErrors = {
      duracion: false,
      distancia: false,
    };

    // Validate duration - Protección contra valores undefined
    if (!duracion || !duracion.trim()) {
      newErrors.duracion = true;
      isValid = false;
    }

    // Validate distance - Protección contra valores undefined
    if (!distancia || !distancia.trim()) {
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
    console.log("Guardando trayecto:", datosTrayecto, "Es edición:", esEdicion);
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
            <Text style={styles.modalTitle}>
              {trayectoEditado ? "Editar Trayecto" : "Nuevo Trayecto"}
            </Text>
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
              <Text style={styles.label}>Duración (Minutos)</Text>
              <TextInput
                style={[styles.input, errors.duracion && styles.inputError]}
                value={duracion}
                onChangeText={(text) => {
                  setDuracion(text);
                  if (text && text.trim()) {
                    setErrors(prev => ({...prev, duracion: false}));
                  }
                }}
                placeholder="00"
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
                  if (text && text.trim()) {
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
    position: "relative",
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
    padding: 8,
  },
  closeButton: {
    position: "absolute",
    right: 5,
    top: 0,
    padding: 5,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#999",
  },
  idText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
    marginBottom: 16,
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
    fontSize: 13,
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