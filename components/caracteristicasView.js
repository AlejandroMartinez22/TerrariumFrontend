import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from "react-native";
import { useBrigadista } from "../context/BrigadistaContext";
import { useNavigation } from "@react-navigation/native";
import { getCaracteristicasSubparcela } from "../hooks/useView";
import { useConteoArbolesSubparcela } from "../hooks/useConteoArbolesSubparcela";

export default function CaracteristicasView({ route }) {
  // Extraemos el nombre de la subparcela desde los parámetros de navegación
  const { subparcelaId: nombreSubparcela } = route.params;
  const { brigadista } = useBrigadista();
  const navigation = useNavigation();

  // Imagen que se muestra si no hay árboles registrados
  const iconoArbolesNoEncontrados = require('../assets/IconoArbolesNoEncontrados.png');

  // Estados locales para controlar datos, errores y carga
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subparcelaData, setSubparcelaData] = useState(null);
  const [coberturas, setCoberturas] = useState([]);
  const [alteraciones, setAlteraciones] = useState([]);

  // Extraemos el ID del conglomerado del brigadista (si está disponible)
  const conglomeradoId = brigadista?.idConglomerado;

  // Hook para obtener conteo de árboles
  const {
    estadisticas,
    loading: loadingIndividuos,
    error: errorIndividuos
  } = useConteoArbolesSubparcela(
    conglomeradoId,
    subparcelaData?.id
  );

  // useEffect para cargar datos de la subparcela al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (!conglomeradoId) {
          setError("No hay información del brigadista disponible");
          setLoading(false);
          return;
        }

        setLoading(true);
        const resultado = await getCaracteristicasSubparcela(
          nombreSubparcela,
          conglomeradoId
        );

        if (resultado) {
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
  }, [nombreSubparcela, conglomeradoId]);

  // Si está cargando, mostrar indicador de actividad
  if (loading || loadingIndividuos) {
    return (
      <SafeAreaView style={styles.fullScreenContainer}>
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={{ marginTop: 10 }}>
            Cargando datos de la subparcela...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Si hay error, mostrar mensaje de error
  if (error || errorIndividuos) {
    return (
      <SafeAreaView style={styles.fullScreenContainer}>
        <View style={styles.centeredContent}>
          <Text style={styles.errorText}>{error || errorIndividuos}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Si no hay datos o brigadista, mostrar mensaje adecuado
  if (!subparcelaData || !brigadista) {
    return (
      <SafeAreaView style={styles.fullScreenContainer}>
        <View style={styles.centeredContent}>
          <Text>{!brigadista ? "Sesión no disponible" : "No se encontraron datos para esta subparcela."}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Render principal con los datos de la subparcela
  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <View style={styles.mainContent}>
        <Text style={styles.titulo}>
          Características de la {nombreSubparcela}
        </Text>

        {/* Información general: ID, coordenadas */}
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
      </View>

      {/* Tabla de coberturas y alteraciones */}
      <View style={styles.infoTableContainer}>
        {/* Tabla de cobertura */}
        <View style={styles.infoTable}>
          <View style={styles.infoTableHeader}>
            <Text style={styles.infoTableHeaderText}>Cobertura</Text>
            <Text style={styles.infoTableHeaderText}>%</Text>
          </View>
          {coberturas.length > 0 ? (
            <>
              {coberturas.slice(0, 4).map((item, index) => (
                <View key={index} style={styles.infoTableRow}>
                  <Text
                    style={[styles.infoTableCell, styles.smallText]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.nombre || "N/A"}
                  </Text>
                  <Text style={styles.infoTableCell}>
                    {item.porcentaje || "N/A"}
                  </Text>
                </View>
              ))}
              {/* Rellenar filas vacías si hay menos de 4 */}
              {Array.from({ length: Math.max(0, 4 - coberturas.length) }).map((_, index) => (
                <View key={`empty-${index}`} style={styles.infoTableRow}>
                  <Text style={styles.infoTableCell}></Text>
                  <Text style={styles.infoTableCell}></Text>
                </View>
              ))}
            </>
          ) : (
            <>
              <View style={styles.infoTableRow}>
                <Text
                  style={[styles.infoTableCell, { textAlign: "center", flex: 2 }]}
                >
                  No hay datos de cobertura
                </Text>
              </View>
              {Array.from({ length: 3 }).map((_, index) => (
                <View key={`empty-${index}`} style={styles.infoTableRow}>
                  <Text style={styles.infoTableCell}></Text>
                  <Text style={styles.infoTableCell}></Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Tabla de alteraciones */}
        <View style={styles.infoTable}>
          <View style={styles.infoTableHeader}>
            <Text style={styles.infoTableHeaderText}>Alteración</Text>
            <Text style={styles.infoTableHeaderText}>Severidad</Text>
          </View>
          {alteraciones.length > 0 ? (
            <>
              {alteraciones.slice(0, 4).map((item, index) => (
                <View key={index} style={styles.infoTableRow}>
                  <Text style={[styles.infoTableCell, styles.smallText]}>
                    {item.nombre || "N/A"}
                  </Text>
                  <Text
                    style={[
                      styles.infoTableCell,
                      item.severidad === "FA"
                        ? styles.redText
                        : item.severidad === "MA"
                          ? styles.blueText
                          : item.severidad === "NP"
                            ? styles.greenText
                            : styles.boldBlueText,
                    ]}
                  >
                    {item.severidad || "N/A"}
                  </Text>
                </View>
              ))}
              {/* Rellenar filas vacías si hay menos de 4 */}
              {Array.from({ length: Math.max(0, 4 - alteraciones.length) }).map((_, index) => (
                <View key={`empty-${index}`} style={styles.infoTableRow}>
                  <Text style={styles.infoTableCell}></Text>
                  <Text style={styles.infoTableCell}></Text>
                </View>
              ))}
            </>
          ) : (
            <>
              <View style={styles.infoTableRow}>
                <Text
                  style={[styles.infoTableCell, { textAlign: "center", flex: 2 }]}
                >
                  No hay datos de alteración
                </Text>
              </View>
              {Array.from({ length: 3 }).map((_, index) => (
                <View key={`empty-${index}`} style={styles.infoTableRow}>
                  <Text style={styles.infoTableCell}></Text>
                  <Text style={styles.infoTableCell}></Text>
                </View>
              ))}
            </>
          )}
        </View>
      </View>

      {/* Tabla de conteo de árboles */}
      <View style={styles.infoTableContainer}>
        {estadisticas.total > 0 ? (
          <View style={[styles.infoTable, { flex: 1 }]}>
            <View style={styles.infoTableHeader}>
              <Text style={styles.infoTableHeaderText}>Conteo de Árboles</Text>
              <Text style={styles.infoTableHeaderText}>Cantidad</Text>
            </View>

            {["Brinzal", "Latizal", "Fustal", "Fustal Grande"].map((tipo, idx) => (
              <View key={idx} style={styles.infoTableRow}>
                <Text style={[styles.infoTableCell, styles.boldText]}>{tipo}</Text>
                <Text style={styles.infoTableCell}>
                  {estadisticas.porTipo[tipo] ?? 0}
                </Text>
              </View>
            ))}

            <View style={styles.infoTableRow}>
              <Text style={[styles.infoTableCell, styles.boldText]}>Total de árboles</Text>
              <Text style={styles.infoTableCell}>{estadisticas.total}</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.emptyTreesBox, { flex: 1 }]}>
            <View style={styles.noTreesContent}>
              <Text style={styles.noTreesText}>
                No hay ningún árbol registrado de momento
              </Text>
              <Image
                source={iconoArbolesNoEncontrados}
                style={styles.noTreesImage}
              />
            </View>
          </View>
        )}
      </View>

      {/* Botón para cerrar y volver */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeButtonText}>Cerrar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Estilos para el componente
const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  mainContent: {
    padding: 16,
    backgroundColor: "white",
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
    marginTop: 10,
    color: "black",
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
    marginBottom: 10,
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
    marginTop: 10,
    marginBottom: 12,
    paddingHorizontal: 16,
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
    fontSize: 12.5,
  },
  infoTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    height: 28, // Altura mínima para todas las filas
  },

  infoTableRowWithImage: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    height: 56, // Altura para la fila con imagen (equivalente a 2 filas estándar)
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
    width: "75%",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 25, // antes era 0
    marginHorizontal: 16, // opcional, para alinearlo con los bordes
  },

  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 16,
  },
  boldText: {
    fontWeight: "bold",
  },
  smallText: {
    fontSize: 11,
  },
  redText: {
    fontWeight: "500",
    color: "#FF0000",
  },
  blueText: {
    fontWeight: "500",
    color: "#0000FF",
  },
  greenText: {
    fontWeight: "500",
    color: "#008000",
  },
  noTreesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    minHeight: 200,
    marginBottom: 12,
  },

  noTreesContentWrapper: {
    height: 140, // Exactamente igual a la altura de 5 filas de 28px
    justifyContent: 'center',
    alignItems: 'center',
  },

  noTreesContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },

  noTreesText: {
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
    color: '#666',
  },

  emptyTreesBox: {
    height: 175, // Altura total - exactamente igual a la tabla con encabezado (5 filas de 28px + encabezado)
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  noTreesImage: {
    width: 100, //cambiar a 50 si no
    height: 100,
    opacity: 0.6,
    resizeMode: 'contain',

  },
});