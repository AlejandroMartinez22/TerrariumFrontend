import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

const CaracteristicasModal = ({
  visible,
  onClose,
  onGuardar,
  puntoId,
  selectedPunto,
  errorMedicion,
  setErrorMedicion,
  selectedOption,
  setSelectedOption,
  selectedNumber,
  setSelectedNumber,
  pickerAlteracion,
  setPickerAlteracion,
  pickerSeveridad,
  setPickerSeveridad,
}) => {
  const isFormValid =
    selectedOption !== "" &&
    (selectedNumber ?? "").trim() !== "" &&
    (errorMedicion ?? "").trim() !== "";

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
              Características de la subparcela
            </Text>
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
                  value={selectedPunto?.latitude.toFixed(5).toString() || ""}
                  editable={false}
                />
              </View>
              <View style={styles.coordColumn}>
                <Text style={styles.coordLabel}>Longitud</Text>
                <TextInput
                  style={styles.coordInput}
                  value={selectedPunto?.longitude.toFixed(5).toString() || ""}
                  editable={false}
                />
              </View>
            </View>

            <View style={styles.errorContainer}>
              <Text style={styles.errorLabel}>Error en la medición (m)</Text>
              <TextInput
                style={styles.errorInput}
                value={errorMedicion}
                onChangeText={setErrorMedicion}
                keyboardType="numeric"
                placeholder="Ingrese error"
              />
            </View>

            {/* Picker cobertura + porcentaje */}

            <Text>Hola</Text>
            <View style={styles.comboContainer}>
              <View style={styles.pickercobertura}>
                <Picker
                  selectedValue={selectedOption}
                  onValueChange={(itemValue) => setSelectedOption(itemValue)}
                  style={[styles.picker]}
                >
                  <Picker.Item label="Afloramiento rocoso" value="Afloramiento rocoso" style={styles.pickercoberturatext}/>
                  <Picker.Item label="Arbustal" value="Arbustal" style={styles.pickercoberturatext}/>
                  <Picker.Item label="Bosque tierra firme" value="Bosque tierra firme" style={styles.pickercoberturatext}/>
                  <Picker.Item label="Bosque inundable" value="Bosque inundable" style={styles.pickercoberturatext}/>
                  <Picker.Item label="Cultivos" value="Cultivos" style={styles.pickercoberturatext}/>
                  <Picker.Item label="Herbazal" value="Herbazal" style={styles.pickercoberturatext}/>
                  <Picker.Item label="Matorral" value="Matorral" style={styles.pickercoberturatext}/>
                  <Picker.Item label="Pastizal" value="Pastizal" style={styles.pickercoberturatext}/>
                  <Picker.Item label="Pantano" value="Pantano" style={styles.pickercoberturatext}/>
                  <Picker.Item label="Rastrojo" value="Rastrojo" style={styles.pickercoberturatext}/>
                  <Picker.Item label="Suelo desnudo" value="Suelo desnudo" style={styles.pickercoberturatext}/>
                  <Picker.Item label="Zona urbana" value="Zona urbana" style={styles.pickercoberturatext}/>
                </Picker>
              </View>
              <View style={styles.porcentajeInputContainer}>
                <TextInput
                  style={styles.porcentajeInput}
                  value={selectedNumber}
                  onChangeText={(text) => {
                    const numeric = text.replace(/[^0-9]/g, "");
                    if (parseInt(numeric) <= 99 || numeric === "") {
                      setSelectedNumber(numeric);
                    }
                  }}
                  keyboardType="numeric"
                  placeholder="1–99"
                  maxLength={2}
                />
              </View>
            </View>

            {/* Nuevo picker de alteración + severidad */}
            <View style={styles.comboContainer}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={pickerAlteracion}
                  onValueChange={setPickerAlteracion}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccione una alteración" value="" style={styles.pickertext} />
                  <Picker.Item label="CL" value="CL" style={styles.pickertext} />
                  <Picker.Item label="CN" value="CN" style={styles.pickertext} />
                  <Picker.Item label="EA" value="EA" style={styles.pickertext} />
                  <Picker.Item label="DS" value="DS" style={styles.pickertext} />
                  <Picker.Item label="FU" value="FU" style={styles.pickertext} />
                  <Picker.Item label="HV" value="HV" style={styles.pickertext} />
                  <Picker.Item label="IN" value="IN" style={styles.pickertext} />
                  <Picker.Item label="PA" value="PA" style={styles.pickertext} />
                  <Picker.Item label="PE" value="PE" style={styles.pickertext} />
                  <Picker.Item label="SA" value="SA" style={styles.pickertext} />
                  <Picker.Item label="VI" value="VI" style={styles.pickertext} />
                </Picker>
              </View>

              <View style={styles.pickerSeveridad}>
                <Picker
                  selectedValue={pickerSeveridad}
                  onValueChange={setPickerSeveridad}
                  style={styles.picker}
                >
                  <Picker.Item label="FA" value="FA" style={styles.pickertext} />
                  <Picker.Item label="MA" value="MA" style={styles.pickertext} />
                  <Picker.Item label="NP" value="NP" style={styles.pickertext} />
                </Picker>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                !isFormValid && { backgroundColor: "#ccc" },
              ]}
              onPress={onGuardar}
              disabled={!isFormValid}
            >
              <Text style={styles.continueButtonText}>Continuar</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
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
  comboContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  pickercobertura: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
    height: 50,
    justifyContent: "center",
    overflow: "hidden",
  },
  porcentajeInputContainer: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
  },
  porcentajeInput: {
    height: "100%",
    textAlign: "center",
    paddingVertical: 0,
    fontSize: 16,
  },
  pickerContainer: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
    height: 50,
    justifyContent: "center",
    overflow: "hidden",
  },
  pickerSeveridad: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    height: 50,
    justifyContent: "center",
  },
  picker: {
    width: "100%",
    height: "100%",
  },

  pickertext: {
    fontSize: 14,
  },

  pickercoberturatext: {
    fontSize: 13,
  },

  continueButton: {
    backgroundColor: "#4169e1",
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 20,
    width: "60%",
    alignSelf: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 5,
    fontSize: 15,
  },
});

export default CaracteristicasModal;
