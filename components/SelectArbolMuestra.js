import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useBrigadista } from "../context/BrigadistaContext";
import { getArbolesSubparcela } from "../hooks/useArbolesSubparcelas";

const SelectArbolMuestra = ({ route, navigation }) => {
  // Obtenemos el subparcelaType de los parámetros
  const subparcelaType = route?.params?.subparcelaType;

  // Accedemos al contexto del brigadista
  const { brigadista } = useBrigadista();

  // Estados para almacenar la información
  const [arboles, setArboles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [subparcelaId, setSubparcelaId] = useState(null);

  const itemsPerPage = 5;

  // Efecto para cargar los árboles cuando el componente se monte o cuando cambien los parámetros
  useEffect(() => {
    // Verificamos que tenemos los datos necesarios
    if (!subparcelaType) {
      setError("No se proporcionó el nombre de la subparcela.");
      setLoading(false);
      console.error("Error: subparcelaType es undefined");
    } else if (!brigadista?.idConglomerado) {
      setError("No se encontró el ID del conglomerado del brigadista.");
      setLoading(false);
      console.error("Error: brigadista.idConglomerado es undefined");
    } else {
      // Si tenemos los datos, cargamos los árboles
      loadArboles();
    }
  }, [subparcelaType, brigadista?.idConglomerado]);

  // Función para cargar los árboles desde la API
  const loadArboles = async () => {
    try {
      setLoading(true);

      // Verificamos datos antes de hacer la llamada
      if (!subparcelaType || !brigadista?.idConglomerado) {
        throw new Error("Datos incompletos para cargar árboles");
      }

      // Llamada a la API - Ajustamos para manejar la estructura de respuesta correcta
      const response = await getArbolesSubparcela(
        subparcelaType,
        brigadista.idConglomerado
      );

      // Comprobamos si la respuesta tiene la estructura esperada
      if (response && response.data && response.success) {
        // Actualizamos el estado con los datos obtenidos
        setArboles(response.data.arboles || []);
        setSubparcelaId(response.data.subparcelaId);
        setLoading(false);
      } else if (response && response.arboles) {
        // Estructura alternativa si getArbolesBySubparcela ya extrajo los datos
        setArboles(response.arboles || []);
        setSubparcelaId(response.subparcelaId);
        setLoading(false);
      } else {
        throw new Error("Formato de respuesta inesperado");
      }
    } catch (err) {
      console.error("Error cargando árboles:", err);
      setError(`Error al cargar los datos: ${err.message}`);
      setLoading(false);

      // Mostramos una alerta para indicar el error
      Alert.alert(
        "Error",
        "Hubo un problema al cargar los datos de árboles. Por favor, intenta de nuevo.",
        [{ text: "OK" }]
      );
    }
  };

  // Cálculo para la paginación
  const totalPages = Math.ceil(arboles.length / itemsPerPage);

  // Manejadores para la paginación
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Obtener los árboles para la página actual
  const currentArboles = arboles.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Función para seleccionar un árbol
  const handleSelectArbol = (arbol) => {
    // Pasamos el subparcelaType, id del árbol y tamaño_individuo como parámetros separados
    navigation.navigate("registrarMuestra", {
      subparcela: subparcelaType,
      arbol: arbol.id,
      tamanoIndividuo: arbol.tamaño_individuo
    });
  };

  // Renderizado para el estado de carga
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Cargando datos de la subparcela...</Text>
      </View>
    );
  }

  // Renderizado principal
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Subparcela {subparcelaType}</Text>
        <Text style={styles.subtitle}>
          ID: {subparcelaId || subparcelaType}
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.numeroCell]}>Número</Text>
            <Text style={[styles.headerCell, styles.tamañoCell]}>Tamaño</Text>
            <Text style={[styles.headerCell, styles.idCell]}>Id</Text>
          </View>

          {currentArboles.length > 0 ? (
            currentArboles.map((arbol, index) => (
              <TouchableOpacity
                key={arbol.id || `arbol-${index}`}
                style={[
                  styles.tableRow,
                  index % 2 === 1 ? styles.highlightedRow : null,
                ]}
                onPress={() => handleSelectArbol(arbol)}
              >
                <Text style={[styles.cell, styles.numeroCell]}>
                  {`Arbol #${index + 1}` }
                </Text>
                <Text style={[styles.cell, styles.tamañoCell]}>
                  {arbol.tamaño_individuo}
                </Text>
                <Text style={[styles.cell, styles.idCell]}>
                  {arbol.id}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                No hay árboles registrados en esta subparcela
              </Text>
            </View>
          )}
        </View>

        {arboles.length > 0 && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              Total de árboles: {arboles.length}
            </Text>
          </View>
        )}
      </ScrollView>

      {currentArboles.length > 0 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage === 0 ? styles.disabledButton : null,
            ]}
            onPress={handlePreviousPage}
            disabled={currentPage === 0}
          >
            <Text style={styles.paginationButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.pageIndicator}>
            <Text style={styles.pageIndicatorText}>
              {currentPage + 1} / {totalPages || 1}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage >= totalPages - 1 ? styles.disabledButton : null,
            ]}
            onPress={handleNextPage}
            disabled={currentPage >= totalPages - 1}
          >
            <Text style={styles.paginationButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 60, // Espacio para el footer
  },
  headerContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Eliminado el fondo verde
  },
  title: {
    marginTop: 20,
    fontSize: 26, // Aumentado el tamaño de la fuente
    fontWeight: "bold",
    color: "#333", // Cambiado a color oscuro
  },
  subtitle: {
    fontSize: 20, // Aumentado el tamaño de la fuente
    color: "#555", // Cambiado a color oscuro
    marginTop: 4,
    marginBottom: 15,
  },
  tableContainer: {
    margin: 16,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "white",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#E0E0E0",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    padding: 12,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    padding: 12,
  },
  highlightedRow: {
    backgroundColor: "#F5F5F5", 
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 16,
  },
  cell: {
    fontSize: 14,
  },
  numeroCell: {
    flex: 1,
  },
  tamañoCell: {
    flex: 1,
    textAlign: "center",
  },
  idCell: {
    flex: 1,
    textAlign: "right",
  },
  statsContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: "#e8f5e9",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#a5d6a7",
  },
  statsText: {
    color: "#2E7D32",
    fontWeight: "500",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 76, // Espacio para que no se solape con el footer
  },
  paginationButton: {
    backgroundColor: "#1976D2", // Cambiado a color azul
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#BBDEFB", // Cambiado el color para botones deshabilitados
  },
  paginationButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 22, // Centrado vertical de la flecha
    textAlign: "center",
    paddingBottom: 2, // Ajuste fino para centrar visualmente
  },
  pageIndicator: {
    marginHorizontal: 16,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#2E7D32",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
  iconText: {
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#2E7D32",
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  retryButtonText: {
    color: "white",
  },
  backButton: {
    backgroundColor: "#757575",
    padding: 12,
    borderRadius: 4,
  },
  backButtonText: {
    color: "white",
  },
  noDataContainer: {
    padding: 20,
    alignItems: "center",
  },
  noDataText: {
    color: "#757575",
    fontSize: 16,
  },
  pageIndicatorText: {
    fontSize: 18,  // Tamaño de fuente más grande
  },
});

export default SelectArbolMuestra;