import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useBrigadista } from "../context/BrigadistaContext";
import { useNavigation } from "@react-navigation/native";
import { getCaracteristicasSubparcela } from "../hooks/useView";

export default function CaracteristicasView({ route }) {
  const { subparcelaId: nombreSubparcela } = route.params;
  const { brigadista } = useBrigadista();
  const navigation = useNavigation();

  // Estados para manejar datos y carga
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subparcelaData, setSubparcelaData] = useState(null);
  const [coberturas, setCoberturas] = useState([]);
  const [alteraciones, setAlteraciones] = useState([]);

  // Cargar datos cuando el componente se monta
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const resultado = await getCaracteristicasSubparcela(
          nombreSubparcela,
          brigadista.idConglomerado
        );

        if (resultado) {
          console.log("Datos recibidos en componente:", resultado);
          // Asignar los datos a los estados correspondientes
          setSubparcelaData(resultado.subparcelaData);
          setCoberturas(resultado.coberturas || []);
          setAlteraciones(resultado.alteraciones || []);
        } else {
          setError("No se pudieron cargar los datos");
        }
      } catch (err) {
        setError("Error al cargar los datos: " + err.message);
        console.error("Error en CaracteristicasView:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [nombreSubparcela, brigadista.idConglomerado]);

  // Renderizado para estado de carga
  if (loading) {
    return (
      <View style={[styles.container, styles.centeredContent]}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={{ marginTop: 10 }}>
          Cargando datos de la subparcela...
        </Text>
      </View>
    );
  }

  // Renderizado para estado de error
  if (error) {
    return (
      <View style={[styles.container, styles.centeredContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Renderizado cuando no hay datos
  if (!subparcelaData) {
    return (
      <View style={[styles.container, styles.centeredContent]}>
        <Text>No se encontraron datos para esta subparcela.</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Renderizado principal con datos
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.titulo}>
          Características de la {nombreSubparcela}
        </Text>

        {/* Datos de coordenadas */}
        <View style={styles.infoRow}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>ID</Text>
            <View style={styles.infoField}>
              <Text style={styles.infoText}>{subparcelaData.id || "N/A"}</Text>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Longitud</Text>
            <View style={styles.infoField}>
              <Text style={styles.infoText}>
                {subparcelaData.longitud || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Latitud</Text>
            <View style={styles.infoField}>
              <Text style={styles.infoText}>
                {subparcelaData.latitud || "N/A"}
              </Text>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Error en la medición (m)</Text>
            <View style={styles.infoField}>
              <Text style={styles.infoText}>3</Text>
            </View>
          </View>
        </View>

        {/* Tablas de cobertura y alteración */}
        <View style={styles.infoTableContainer}>
          <View style={styles.infoTable}>
            <View style={styles.infoTableHeader}>
              <Text style={styles.infoTableHeaderText}>Cobertura</Text>
              <Text style={styles.infoTableHeaderText}>%</Text>
            </View>
            {coberturas && coberturas.length > 0 ? (
              coberturas.map((item, index) => (
                <View key={index} style={styles.infoTableRow}>
                  <Text style={[styles.infoTableCell, styles.boldText]}>
                    {item.nombre || "N/A"}
                  </Text>
                  <Text style={styles.infoTableCell}>
                    {item.porcentaje || "N/A"}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.infoTableRow}>
                <Text
                  style={[
                    styles.infoTableCell,
                    { textAlign: "center", flex: 2 },
                  ]}
                >
                  No hay datos de cobertura
                </Text>
              </View>
            )}
          </View>

          <View style={styles.infoTable}>
            <View style={styles.infoTableHeader}>
              <Text style={styles.infoTableHeaderText}>Alteración</Text>
              <Text style={styles.infoTableHeaderText}>Severidad</Text>
            </View>
            {alteraciones && alteraciones.length > 0 ? (
              alteraciones.map((item, index) => (
                <View key={index} style={styles.infoTableRow}>
                  <Text style={[styles.infoTableCell, styles.smallText]}>
                    {item.nombre || "N/A"}
                  </Text>
                  <Text style={[styles.infoTableCell, styles.boldBlueText]}>
                    {item.severidad || "N/A"}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.infoTableRow}>
                <Text
                  style={[
                    styles.infoTableCell,
                    { textAlign: "center", flex: 2 },
                  ]}
                >
                  No hay datos de alteración
                </Text>
              </View>
            )}

            {/* Filas adicionales vacías para coincidir con el mockup */}
            <View style={styles.infoTableRow}>
              <Text style={styles.infoTableCell}></Text>
              <Text style={styles.infoTableCell}></Text>
            </View>
            <View style={styles.infoTableRow}>
              <Text style={styles.infoTableCell}></Text>
              <Text style={styles.infoTableCell}></Text>
            </View>
          </View>
        </View>

        {/* Botón de cerrar */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: 10,
  },
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    width: "100%",
    maxWidth: 420,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 4,
    textAlign: "center",
  },
  infoField: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#e0e0e0",
    padding: 8,
    borderRadius: 4,
    height: 40,
    justifyContent: "center",
  },
  infoText: {
    textAlign: "center",
  },
  infoTableContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 20,
  },
  infoTable: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  infoTableHeader: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  infoTableHeaderText: {
    flex: 1,
    padding: 8,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
  },
  infoTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    minHeight: 28, // Altura mínima para todas las filas
  },
  infoTableCell: {
    flex: 1,
    padding: 6,
    textAlign: "center",
    fontSize: 13,
    justifyContent: "center",
  },
  closeButton: {
    backgroundColor: "#4285F4",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  boldText: {
    fontWeight: "bold",
  },
  smallText: {
    fontSize: 11,
  },
  boldBlueText: {
    fontWeight: "bold",
    color: "#0000FF",
  },
});
