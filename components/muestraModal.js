import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Alert
} from "react-native";

// Función para obtener el ID
import { siguienteIdMuestra, guardarMuestra } from "../hooks/useMuestra";
import { useBrigadista } from "../context/BrigadistaContext";

// Modificamos MuestraModal para que sea una pantalla completa en lugar de modal
export default function MuestraModal({ route, navigation }) {
  // Extraemos los parámetros de la ruta
  const { subparcela, arbol, tamanoIndividuo } = route.params || {};
  const brigadista = useBrigadista();

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
    numeroColeccion: false,
    observaciones: false,
  });

  // Función para validar que las observaciones tengan al menos 4 palabras
  const validarObservaciones = (texto) => {
    if (!texto || texto.trim() === "") return false; // Si está vacío, no es válido 
    const palabras = texto.trim().split(/\s+/);
    return palabras.length >= 4;
  };

  // Calcular si el formulario es válido (determinacionCampo es ahora opcional)
  const isFormValid =
    nombreComun &&
    nombreComun.trim() !== "" &&
    numeroColeccion &&
    numeroColeccion.trim() !== "" &&
    validarObservaciones(observaciones);

  useEffect(() => {
    const inicializarDatos = async () => {
      // Reiniciamos los errores cuando se abre el componente
      setErrors({
        nombreComun: false,
        numeroColeccion: false,
        observaciones: false,
      });

      setNombreComun("");
      setDeterminacionCampo("");
      setNumeroColeccion("");
      setObservaciones("");

      // Generamos un nuevo ID desde la base de datos para la muestra
      try {
        const nuevoId = await siguienteIdMuestra();

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

  // Cerrar la pantalla y volver a la pantalla anterior
  const handleClose = () => {
    navigation.goBack();
  };

  // Validar campos antes de guardar
  const validateFields = () => {
    let isValid = true;
    const newErrors = {
      nombreComun: !nombreComun || nombreComun.trim() === "",
      numeroColeccion: !numeroColeccion || numeroColeccion.trim() === "",
      observaciones: !validarObservaciones(observaciones),
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

    try {
      const id = await guardarMuestra(muestraData);
      
      if (id) {
        Alert.alert(
          "Éxito",
          "La muestra se ha guardado correctamente",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert(
          "Error",
          "No se pudo guardar la muestra. Inténtalo de nuevo.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error al guardar muestra:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al guardar la muestra: " + error.message,
        [{ text: "OK" }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Cambia el color de la barra de estado y el estilo del texto */}
      <StatusBar backgroundColor="#1E5A26" barStyle="light-content" />

      {/* Ajusta la vista para evitar que el teclado tape los inputs */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.fullScreen}
      >
        {/* Scroll para contenido que sobrepasa la pantalla */}
        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
          <View style={styles.modalView}>
            {/* Encabezado del formulario con título */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registro de la Muestra</Text>
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
                  <Text style={styles.label}>Subparcela</Text>
                  <View style={styles.valueBox}>
                    <Text style={styles.valueText}>{subparcela}</Text>
                  </View>
                </View>
                <View style={styles.formColumn}>
                  <Text style={styles.label}>Id del árbol</Text>
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
                <Text style={styles.label}>* Nombre Común</Text>
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
                />
                {errors.nombreComun && (
                  <Text style={styles.errorText}>Este campo es obligatorio</Text>
                )}
              </View>

              {/* Determinación en campo (ahora opcional) */}
              <View style={styles.formRowFull}>
                <Text style={styles.label}>Determinación en campo</Text>
                <TextInput
                  style={styles.input}
                  value={determinacionCampo}
                  onChangeText={setDeterminacionCampo}
                  placeholder="Ej: Quercus"
                />
              </View>

              {/* No. de colección */}
              <View style={styles.formRowFull}>
                <Text style={styles.label}>* No. de colección</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.numeroColeccion && styles.inputError,
                  ]}
                  value={numeroColeccion}
                  onChangeText={(text) => {
                    const filteredText = text.replace(/[^a-zA-Z0-9]/g, "");
                    setNumeroColeccion(filteredText);
                    if (filteredText.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        numeroColeccion: false,
                      }));
                    }
                  }}  
                  placeholder="Ej: GD001"
                />
                {errors.numeroColeccion && (
                  <Text style={styles.errorText}>Este campo es obligatorio</Text>
                )}
              </View>

              {/* Observaciones (obligatorio con mínimo 4 palabras) */}
              <View style={styles.formRowFull}>
                <Text style={styles.label}>* Observaciones</Text>
                <TextInput
                  style={[
                    styles.textArea,
                    errors.observaciones && styles.inputError,
                  ]}
                  value={observaciones}
                  onChangeText={(text) => {
                    setObservaciones(text);
                    if (validarObservaciones(text)) {
                      setErrors((prev) => ({ ...prev, observaciones: false }));
                    }
                  }}
                  placeholder="Mínimo 4 palabras"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                {errors.observaciones && (
                  <Text style={styles.errorText}>Este campo es obligatorio y debe tener al menos 4 palabras</Text>
                )}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  fullScreen: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10, 
    padding: 20,
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
    fontSize: 25,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
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
    fontSize: 17,
    fontWeight: "500",
    marginRight: 5,
    marginTop: 6,
    marginBottom: 20,
  },
  infoValue: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 17,
    fontWeight: "500",
  },
  formContainer: {
    width: "100%",
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  formRowFull: {
    marginBottom: 20,
  },
  formColumn: {
    width: "48%",
  },
  label: {
    fontSize: 14.5,
    marginBottom: 5,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
  },
  valueBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  valueText: {
    fontSize: 14,
  },
  inputError: {
    borderColor: "red",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    height: 100,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  hechoButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 10,
    paddingHorizontal: "25%",
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#1E5A26"
  }
});