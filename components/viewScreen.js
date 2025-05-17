import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Linking } from "react-native";
import { Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useBrigadista } from "../context/BrigadistaContext";
import useIndividuoView from "../hooks/useIndividuosView";
import { useArboles } from "../context/ArbolesContext";

const VisualizarTab = () => {
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

  // Estado para manejar la carga local (del botón "Aplicar")
  const [isApplying, setIsApplying] = useState(false);
  
  // Estado para indicar si los datos se han cargado al menos una vez
  const [dataLoaded, setDataLoaded] = useState(false);

  // Acceso al contexto del brigadista
  const { brigadista } = useBrigadista();
  const idConglomerado = brigadista?.idConglomerado;

  // Acceso al contexto de árboles
  const { 
    actualizarArbolesFiltrados, 
    actualizarTiposSeleccionados,
    arbolesFiltrados
  } = useArboles();

  // Usar el hook useIndividuoView en el nivel superior del componente
  const { individuosAgrupados, loading, error } = useIndividuoView(idConglomerado);

  // Efecto para finalizar la animación de carga del botón
  useEffect(() => {
    if (isApplying && !loading) {
      setTimeout(() => {
        setIsApplying(false);
        setDataLoaded(true);
      }, 500); // Pequeño retraso para mostrar el spinner
    }
  }, [isApplying, loading]);

  // Función para manejar cambios en los checkboxes
  const handleCheckboxChange = (key) => {
    setCheckedItems({
      ...checkedItems,
      [key]: !checkedItems[key],
    });
  };

  // Función para manejar el botón de confirmar
  const confirmar = () => {
    setIsApplying(true);
    
    // Verificar que al menos un checkbox esté seleccionado
    const algunoSeleccionado = Object.values(checkedItems).some(value => value === true);
    
    if (!algunoSeleccionado) {
      alert("Por favor seleccione al menos un tipo de árbol");
      setIsApplying(false);
      return;
    }
    
    // Actualizar el contexto con los tipos seleccionados
    actualizarTiposSeleccionados(checkedItems);
    
    // Filtrar los árboles según los checkboxes seleccionados
    if (individuosAgrupados) {
      let arbolesFiltrados = [];
      
      if (checkedItems.latizales && individuosAgrupados.Latizal) {
        arbolesFiltrados = [...arbolesFiltrados, ...individuosAgrupados.Latizal];
      }
      if (checkedItems.brinzales && individuosAgrupados.Brinzal) {
        arbolesFiltrados = [...arbolesFiltrados, ...individuosAgrupados.Brinzal];
      }
      if (checkedItems.fustales && individuosAgrupados.Fustal) {
        arbolesFiltrados = [...arbolesFiltrados, ...individuosAgrupados.Fustal];
      }
      if (checkedItems.fustalesGrandes && individuosAgrupados["Fustal Grande"]) {
        arbolesFiltrados = [...arbolesFiltrados, ...individuosAgrupados["Fustal Grande"]];
      }

      // Actualizar el contexto con los árboles filtrados
      actualizarArbolesFiltrados(arbolesFiltrados);
      
      console.log(`Se ${arbolesFiltrados.length === 1 ? "encontró" : "encontraron"} ${arbolesFiltrados.length} ${arbolesFiltrados.length === 1 ? "árbol" : "árboles"}`);
      console.log("\nÁrboles filtrados:", arbolesFiltrados);
      
      // Si los datos ya están cargados, solo necesitamos actualizar el filtro
      if (!dataLoaded) {
        setDataLoaded(true);
      }
      
      // Navegar al mapa para ver los árboles cuando se confirma después de un breve retraso
      setTimeout(() => {
        navigation.navigate('Map');
      }, 500);
    }
  };

  // Función para navegar a la vista de características de subparcela
  const openSubparcelaView = (id) => {
    setSelectedSubparcela(id);
    
    navigation.navigate('CaracteristicasView', { 
      subparcelaId: id
    });
  };

  // Función para abrir el manual de usuario
  const openManual = () => {
    // Aquí puedes definir la URL del manual o la acción a realizar
    // Por ejemplo, abrir una URL externa o navegar a una pantalla de manual
    Linking.openURL('https://visionamazonia.minambiente.gov.co/content/uploads/2023/04/Manual_IFN_Colombia_v4.pdf');
    // O alternativamente, navegar a una pantalla de manual interna:
    // navigation.navigate('ManualUsuario');
  };

  // Renderiza un checkbox con su etiqueta
  const renderCheckbox = (key, label) => (
    <View style={styles.checkboxContainer}>
      <Checkbox
        status={checkedItems[key] ? "checked" : "unchecked"}
        onPress={() => handleCheckboxChange(key)}
        color="#4285F4"
        uncheckedColor="#757575"
        style={styles.checkbox}
      />
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  );

  // Renderiza un botón de subparcela
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
          <TouchableOpacity 
            style={styles.aplicarButton} 
            onPress={confirmar}
            disabled={isApplying || loading}
          >
            {isApplying || loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.aplicarButtonText}> Cargando...</Text>
              </View>
            ) : (
              <Text style={styles.aplicarButtonText}>Aplicar</Text>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Mensaje de error si hay alguno */}
        {error && (
          <Text style={styles.errorText}>
            Error al cargar los datos: {error}
          </Text>
        )}
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
      
      {/* Enlace al manual de usuario */}
      <TouchableOpacity onPress={openManual}>
        <Text style={styles.manualLink}>Consultar manual de campo</Text>
      </TouchableOpacity>
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
    marginBottom: 22, 
    marginTop: 10,
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
    marginBottom: 15,
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
    marginVertical: 4, // Añadir margen vertical
  },
  checkbox: {
    borderWidth: 1,
    borderColor: "#757575",
    borderRadius: 2,
    margin: 0,
    padding: 0,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 15,
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
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  manualLink: {
    color: '#1E88E5',
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 15,
    textDecorationLine: 'underline',
    padding: 6,
  }
});

export default VisualizarTab;