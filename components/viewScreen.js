import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { getIndividuosByConglomerado } from "../hooks/useView";
import { useBrigadista } from "../context/BrigadistaContext";

const VisualizarTab = ({}) => {
  // Acceso al objeto de navegación
  const navigation = useNavigation();

  // Estado para los checkboxes - ninguno seleccionado por defecto
  const [checkedItems, setCheckedItems] = useState({
    latizales: false,
    brinzales: false,
    fustales: false,
    fustalesGrandes: false,
  });

  // Estado para la subparcela seleccionada - ninguna seleccionada por defecto
  const [selectedSubparcela, setSelectedSubparcela] = useState(null);

  // Estado para mostrar u ocultar el modal
  const [modalVisible, setModalVisible] = useState(false);

  const { brigadista } = useBrigadista();
  const idConglomerado = brigadista?.idConglomerado; // Reemplaza con el ID real del conglomerado
  // Función para manejar cambios en los checkboxes
  const handleCheckboxChange = (key) => {
    setCheckedItems({
      ...checkedItems,
      [key]: !checkedItems[key],
    });
  };

  // Función para manejar el botón de confirmar
  const confirmar = async () => {
    // Filtra solo los checkbox marcados

    console.log("Presiono boton de confirmar  ", idConglomerado)
    const individuos = await getIndividuosByConglomerado(idConglomerado); // Reemplaza con el ID real del conglomerado
    console.log("Individuos obtenidos: ", individuos);

    /*
    const checkedItemsOnly = Object.keys(checkedItems).reduce((acc, key) => {
      if (checkedItems[key]) {
        acc[key] = true;
      }
      return acc;
    }, {});

    if (onConfirm && Object.keys(checkedItemsOnly).length > 0) {
      onConfirm({
        checkedItems: checkedItemsOnly,
      });
    }
      */
  };

  // Función actualizada para navegar a la vista de características
  const openSubparcelaView = (id) => {
    setSelectedSubparcela(id);
    
    navigation.navigate('CaracteristicasView', { 
      subparcelaId: id // Verificar que este valor esté definido
    });
  };

  // Renderiza un checkbox con su etiqueta
  const renderCheckbox = (key, label) => (
    <View style={styles.checkboxContainer}>
      <Checkbox
        status={checkedItems[key] ? "checked" : "unchecked"}
        onPress={() => handleCheckboxChange(key)}
        color="#4285F4"
      />
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  );

  // Renderiza un botón de subparcela (ahora todos blancos)
  const renderSubparcelaButton = (nombreSubparcela) => {
    return (
      <TouchableOpacity
        style={styles.subparcelaButton}
        onPress={() => openSubparcelaView(nombreSubparcela)}
      >
        <Text style={styles.subparcelaButtonText}>{nombreSubparcela}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Título principal */}
      <Text style={styles.title}>Visualizar</Text>

      {/* Sección de árboles en el mapa */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Árboles en el mapa</Text>
        <View style={styles.checkboxGrid}>
          <View style={styles.checkboxRow}>
            {renderCheckbox("latizales", "Latizales")}
            {renderCheckbox("brinzales", "Brinzales")}
          </View>
          <View style={styles.checkboxRow}>
            {renderCheckbox("fustales", "Fustales")}
            {renderCheckbox("fustalesGrandes", "Fustales Grandes")}
          </View>
        </View>
        
        {/* Botón Aplicar dentro de la sección de árboles en el mapa */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.aplicarButton} onPress={confirmar}>
            <Text style={styles.aplicarButtonText}>Aplicar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sección de información de subparcelas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de las subparcelas</Text>
        <View style={styles.subparcelaRows}>
          <View style={styles.subparcelaRow}>
            {renderSubparcelaButton("SPF-1")}
            {renderSubparcelaButton("SPF-2")}
            {renderSubparcelaButton("SPF-3")}
          </View>
          <View style={styles.subparcelaRow}>
            {renderSubparcelaButton("SPF-4")}
            {renderSubparcelaButton("SPF-5")}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 20,
    color: "#194D20"
  },
  section: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 25,
    marginTop: 5,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  checkboxGrid: {
    flexDirection: "column",
  },
  checkboxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 15, // Texto de checkboxes más grande
    fontWeight: "500",
  },
  subparcelaRows: {
    flexDirection: "column",
    gap: 14,
  },
  subparcelaRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  subparcelaButton: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 14,
    minWidth: 85,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  subparcelaButtonText: {
    fontWeight: "500",
    fontSize: 15,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  aplicarButton: {
    backgroundColor: "#4285F4",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    width: "60%", // Botón menos ancho (60% del ancho del contenedor)
    marginBottom: 10,
  },
  aplicarButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default VisualizarTab;