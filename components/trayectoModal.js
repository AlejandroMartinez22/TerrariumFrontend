import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { generarTrayectoId } from "../hooks/genIdTrayecto";

export default function TrayectoModal({
  visible,
  onClose,
  onConfirmar,
  trayectos = [],
}) {
  const [medioTransporte, setMedioTransporte] = useState("Terrestre");
  const [duracion, setDuracion] = useState("");
  const [distancia, setDistancia] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const transportOptions = ["Terrestre", "Marítimo", "Aéreo"];

  const handleGuardar = () => {
    const idTrayecto = generarTrayectoId(trayectos);
    onConfirmar({
      idTrayecto,
      medioTransporte,
      duracion,
      distancia,
    });
  };

  const selectTransportOption = (option) => {
    setMedioTransporte(option);
    setShowDropdown(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Trayecto Realizado</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            {/* Medio de transporte */}
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

            {/* Duración */}
            <View style={styles.formRow}>
              <Text style={styles.label}>Duración (Horas y Minutos)</Text>
              <TextInput
                style={styles.input}
                value={duracion}
                onChangeText={setDuracion}
                placeholder="00:00"
              />
            </View>

            {/* Distancia */}
            <View style={styles.formRow}>
              <Text style={styles.label}>Distancia del Trayecto (km)</Text>
              <TextInput
                style={styles.input}
                value={distancia}
                onChangeText={setDistancia}
                placeholder="0.0"
                keyboardType="numeric"
              />
            </View>

            {/* Botón guardar */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.guardarButton}
                onPress={handleGuardar}
              >
                <Text style={styles.guardarButtonText}>✓ Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Reutiliza los estilos del modal anterior...

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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
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
  guardarButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
