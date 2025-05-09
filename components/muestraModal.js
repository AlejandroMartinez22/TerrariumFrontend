import React, { useState, useEffect, use } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// Función para obtener el ID
import { siguienteIdMuestra, guardarMuestra } from "../hooks/useMuestra";
import { useBrigadista } from "../context/BrigadistaContext";

// Modificamos MuestraModal para recibir parámetros de la ruta
export default function MuestraModal({ route, navigation }) {
  // Extraemos los parámetros de la ruta
  const { subparcela, arbol, tamanoIndividuo } = route.params || {};
  const brigadista = useBrigadista();

  // Estados para controlar la visibilidad del modal
  const [visible, setVisible] = useState(true);

  // Estados para almacenar los valores del formulario
  const [idMuestra, setIdMuestra] = useState("");
  const [idAsignado, setIdAsignado] = useState("");
  const [nombreComun, setNombreComun] = useState("");
  const [determinacionCampo, setDeterminacionCampo] = useState("");
  const [numeroColeccion, setNumeroColeccion] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [cedula_brigadista, setCedulaBrigadista] = useState("");

  // Estado para manejar errores de validación
  const [errors, setErrors] = useState({
    nombreComun: false,
    determinacionCampo: false,
    numeroColeccion: false,
  });

  // Calcular si el formulario es válido
  const isFormValid =
    nombreComun &&
    nombreComun.trim() !== "" &&
    determinacionCampo &&
    determinacionCampo.trim() !== "" &&
    numeroColeccion &&
    numeroColeccion.trim() !== "";

  useEffect(() => {
    console.log("Parámetros recibidos en MuestraModal:", {
      subparcela,
      arbol,
      tamanoIndividuo,
    });

    const inicializarDatos = async () => {
      // Reiniciamos los errores cuando se abre el componente
      setErrors({
        nombreComun: false,
        determinacionCampo: false,
        numeroColeccion: false,
      });

      setNombreComun("");
      setDeterminacionCampo("");
      setNumeroColeccion("");
      setObservaciones("");

      // Generamos un nuevo ID desde la base de datos para la muestra
      try {
        const nuevoId = await siguienteIdMuestra();
        console.log("Nuevo ID generado desde el backend:", nuevoId);

        if (nuevoId) {
          setIdMuestra(nuevoId);
          // El ID asignado viene directamente del backend
          setIdAsignado(nuevoId.replace("MUESTRA", "M"));
        } else {
          setIdMuestra("MUESTRA001");
          setIdAsignado("M001");
          console.warn(
            "No se pudo obtener un ID de la base de datos, usando ID predeterminado"
          );
        }
      } catch (error) {
        console.error("Error al obtener el siguiente ID:", error);
        setIdMuestra("MUESTRA001");
        setIdAsignado("M001");
      }
    };

    inicializarDatos();
  }, []);

  // Para debugging - registrar los cambios en las variables principales
  useEffect(() => {
    console.log("Estado actual:", {
      idAsignado,
      subparcela,
      arbol,
      tamanoIndividuo,
      nombreComun,
      determinacionCampo,
      numeroColeccion,
      observaciones,
      idMuestra,
    });
  }, [nombreComun, determinacionCampo, numeroColeccion, observaciones]);

  // Cerrar el modal y volver a la pantalla anterior
  const handleClose = () => {
    navigation.goBack();
  };

  // Validar campos antes de guardar
  const validateFields = () => {
    let isValid = true;
    const newErrors = {
      nombreComun: !nombreComun || nombreComun.trim() === "",
      determinacionCampo:
        !determinacionCampo || determinacionCampo.trim() === "",
      numeroColeccion: !numeroColeccion || numeroColeccion.trim() === "",
    };

    // Comprobar si hay algún error
    for (const key in newErrors) {
      if (newErrors[key]) {
        isValid = false;
        break;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Manejar el evento de guardar
  const handleGuardar = async () => {
    if (!validateFields()) {
      return;
    }

    setCedulaBrigadista(brigadista.cedula_brigadista);

    console.log("brigadista actual:", brigadista);
    // Si el formulario es válido, guardamos los datos
    const muestraData = {
      idMuestra,
      tamanoIndividuo,
      nombreComun,
      determinacionCampo,
      observaciones,
      numeroColeccion,
      arbol,
      cedula_brigadista: brigadista.brigadista.cedula,
    };

    console.log("Guardando muestra:", muestraData);
    const id = await guardarMuestra(muestraData);
    console.log("ID de muestra guardada:", id);
    
    navigation.goBack();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {}}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Registro de la Muestra</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.topInfoContainer}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>ID ASIGNADO:</Text>
                  <Text style={styles.infoValue}>{idAsignado}</Text>
                </View>
              </View>

              <View style={styles.formContainer}>
                {/* Fila para Subparcela y Árbol */}
                <View style={styles.formRow}>
                  <View style={styles.formColumn}>
                    <Text style={styles.label}>SUBPARCELA</Text>
                    <View style={styles.valueBox}>
                      <Text style={styles.valueText}>{subparcela}</Text>
                    </View>
                  </View>
                  <View style={styles.formColumn}>
                    <Text style={styles.label}>ÁRBOL</Text>
                    <View style={styles.valueBox}>
                      <Text style={styles.valueText}>{arbol}</Text>
                    </View>
                  </View>
                </View>

                {/* Tamaño del individuo */}
                <View style={styles.formRowFull}>
                  <Text style={styles.label}>Tamaño del individuo</Text>
                  <View style={styles.valueBox}>
                    <Text style={styles.valueText}>{tamanoIndividuo}</Text>
                  </View>
                </View>

                {/* Nombre Común */}
                <View style={styles.formRowFull}>
                  <Text style={styles.label}>Nombre Común</Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.nombreComun && styles.inputError,
                    ]}
                    value={nombreComun}
                    onChangeText={(text) => {
                      setNombreComun(text);
                      if (text && text.trim()) {
                        setErrors((prev) => ({ ...prev, nombreComun: false }));
                      }
                    }}
                    placeholder="Ingrese el nombre común"
                  />
                </View>

                {/* Determinación en campo */}
                <View style={styles.formRowFull}>
                  <Text style={styles.label}>Determinación en campo</Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.determinacionCampo && styles.inputError,
                    ]}
                    value={determinacionCampo}
                    onChangeText={(text) => {
                      setDeterminacionCampo(text);
                      if (text && text.trim()) {
                        setErrors((prev) => ({
                          ...prev,
                          determinacionCampo: false,
                        }));
                      }
                    }}
                    placeholder="Ingrese la determinación en campo"
                  />
                </View>

                {/* No. de colección */}
                <View style={styles.formRowFull}>
                  <Text style={styles.label}>No. de colección</Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.numeroColeccion && styles.inputError,
                    ]}
                    value={numeroColeccion}
                    onChangeText={(text) => {
                      setNumeroColeccion(text);
                      if (text && text.trim()) {
                        setErrors((prev) => ({
                          ...prev,
                          numeroColeccion: false,
                        }));
                      }
                    }}
                    placeholder="Ingrese el número de colección"
                    keyboardType="numeric"
                  />
                </View>

                {/* Observaciones */}
                <View style={styles.formRowFull}>
                  <Text style={styles.label}>Observaciones</Text>
                  <TextInput
                    style={[styles.textArea]}
                    value={observaciones}
                    onChangeText={setObservaciones}
                    placeholder="Ingrese las observaciones"
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.hechoButton,
                      !isFormValid && styles.hechoButtonDisabled,
                    ]}
                    onPress={handleGuardar}
                    disabled={!isFormValid}
                  >
                    <Text
                      style={[
                        styles.hechoButtonText,
                        !isFormValid && styles.hechoButtonTextDisabled,
                      ]}
                    >
                      Hecho
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    padding: 5,
    position: "absolute",
    right: 0,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
  },
  topInfoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontWeight: "bold",
    marginRight: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  formContainer: {
    width: "100%",
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  formRowFull: {
    marginBottom: 15,
  },
  formColumn: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  valueBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  valueText: {
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    height: 100,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  hechoButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: "center",
  },
  hechoButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  hechoButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  hechoButtonTextDisabled: {
    color: "#888888",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
});
