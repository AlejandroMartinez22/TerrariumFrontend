import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TrayectoModal({
  visible,
  onClose,
  onConfirmar,
  puntoId,
  selectedPunto,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            Información de Trayecto para {puntoId}
          </Text>
          
          {/* Aquí puedes añadir los campos específicos para información de trayecto */}
          <Text style={styles.infoText}>
            Coordenadas: {selectedPunto?.coordinate?.latitude.toFixed(6)}, {selectedPunto?.coordinate?.longitude.toFixed(6)}
          </Text>
          
          {/* Añade campos específicos para información de trayecto */}
          <View style={styles.additionalFieldsContainer}>
            <Text style={styles.sectionTitle}>Detalles del Trayecto</Text>
            <Text style={styles.infoText}>
              En esta sección puedes registrar información como:
            </Text>
            <Text style={styles.infoText}>• Distancia recorrida</Text>
            <Text style={styles.infoText}>• Dificultad del terreno</Text>
            <Text style={styles.infoText}>• Tiempo estimado entre puntos</Text>
            <Text style={styles.infoText}>• Observaciones del trayecto</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={onClose}
            >
              <Text style={styles.textStyle}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonConfirm]}
              onPress={onConfirmar}
            >
              <Text style={styles.textStyle}>Confirmar</Text>
            </TouchableOpacity>
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
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
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
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },
  infoText: {
    marginBottom: 5,
  },
  additionalFieldsContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,  
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 80,
  },
  buttonClose: {
    backgroundColor: "#ccc",
  },
  buttonConfirm: {
    backgroundColor: "#4CAF50",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});