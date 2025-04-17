import React, { useState, useEffect, useRef } from "react";
import { View, SafeAreaView, StyleSheet, Text, Image } from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { useBrigadista } from "../context/BrigadistaContext";
import { getCoordenadas } from "../supabase/getCoordenadas";
import { useReferencia } from "../context/ReferenciaContext";
import { getCentrosPoblados } from "../supabase/getCentroPoblado";
import ReferenciaModal from "./puntoReferenciaModal";
import ReferenciaMarker from "./referenciaMarker";
import TrayectoModal from "./trayectoModal";

export default function MapScreen() {
  const { brigadista } = useBrigadista();
  const [coordenadas, setCoordenadas] = useState([]);
  const mapRef = useRef(null);

  const { puntosReferencia, generarReferenciaInicial, setPuntosReferencia } =
    useReferencia();

  const [modalVisible, setModalVisible] = useState(false);
  const [trayectoModalVisible, setTrayectoModalVisible] = useState(false);
  const [selectedPunto, setSelectedPunto] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [errorMedicion, setErrorMedicion] = useState("");
  const [puntoId, setPuntoId] = useState("");
  const [tempPuntoData, setTempPuntoData] = useState(null);
  const [centrosPoblados, setCentrosPoblados] = useState([]);

  const defaultCenter = {
    latitude: 7.12539,
    longitude: -73.1198,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Cambiado el valor inicial a 0.01 para que coincida con el valor inicial del mapa
  const [mapZoom, setMapZoom] = useState(defaultCenter.latitudeDelta);

  // Estado para forzar re-renderización cuando cambia el zoom
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const fetchCoordenadas = async () => {
      if (brigadista?.idConglomerado) {
        const data = await getCoordenadas(brigadista);
        setCoordenadas(data);

        if (data.length > 0 && mapRef.current) {
          mapRef.current.fitToCoordinates(
            data.map((coord) => ({
              latitude: coord.latitud,
              longitude: coord.longitud,
            })),
            {
              edgePadding: { top: 50, bottom: 50, left: 50, right: 50 },
              animated: true,
            }
          );
        }
      }
    };

    fetchCoordenadas();
  }, [brigadista]);

  // Corregido: Ahora la función se llama correctamente getCentrosPoblados
  useEffect(() => {
    const fetchCentrosPoblados = async () => {
      if (brigadista) {
        try {
          console.log("Obteniendo centros poblados para:", brigadista);
          const centros = await getCentrosPoblados(brigadista);
          console.log("Centros poblados obtenidos:", centros);
          setCentrosPoblados(centros);
        } catch (error) {
          console.error("Error al cargar centros poblados:", error);
        }
      }
    };

    fetchCentrosPoblados();
  }, [brigadista]);

  const openModal = (punto, index) => {
    setSelectedPunto({ ...punto, index });
    setEditedDescription(punto.description || "");
    setErrorMedicion(punto.errorMedicion || "");
    setPuntoId(`PR00${index + 1}`);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setTempPuntoData(null);
    setModalVisible(false);
  };

  const handleCloseTrayectoModal = () => {
    setTempPuntoData(null);
    setTrayectoModalVisible(false);
  };

  const continuar = () => {
    if (!selectedPunto) return;

    const puntoActualizado = {
      ...selectedPunto,
      title:
        selectedPunto.title || `Punto de referencia ${selectedPunto.index + 1}`,
      description: editedDescription,
      errorMedicion: errorMedicion,
      latitude: selectedPunto.latitude,
      longitude: selectedPunto.longitude,
    };

    setTempPuntoData(puntoActualizado);
    setModalVisible(false);
    setTrayectoModalVisible(true);
  };

  const confirmarTrayecto = (datosTrayecto) => {
    if (!tempPuntoData) return;

    const puntoConTrayecto = {
      ...tempPuntoData,
      trayecto: datosTrayecto,
    };

    let nuevosPuntos;
    if (puntoConTrayecto.index < puntosReferencia.length) {
      nuevosPuntos = puntosReferencia.map((punto, i) =>
        i === puntoConTrayecto.index ? puntoConTrayecto : punto
      );
    } else {
      nuevosPuntos = [...puntosReferencia, puntoConTrayecto];
    }

    setPuntosReferencia(nuevosPuntos);
    setTrayectoModalVisible(false);
  };

  const eliminarPunto = () => {
    const nuevosPuntos = puntosReferencia.filter(
      (_, i) => i !== selectedPunto.index
    );
    setPuntosReferencia(nuevosPuntos);
    setModalVisible(false);
    setTempPuntoData(null);
  };

  const handleLongPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    const nuevoPunto = {
      ...generarReferenciaInicial(coordinate),
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    };

    setSelectedPunto({ ...nuevoPunto, index: puntosReferencia.length });
    setEditedDescription("");
    setErrorMedicion("");
    setPuntoId(nuevoPunto.id);
    setModalVisible(true);
  };

  // Función para manejar el cambio de región del mapa
  const handleRegionChange = (region) => {
    const newZoom = region.latitudeDelta;

    // Solo actualiza el estado si el valor de zoom cambió significativamente
    if (Math.abs(mapZoom - newZoom) > 0.0001) {
      setMapZoom(newZoom);
      // Forzar re-renderización
      setForceUpdate((prev) => prev + 1);
    }
  };

  // Un mejor umbral para mostrar las etiquetas (ajusta este valor según necesites)
  const shouldShowLabels = mapZoom < 0.005; // Muestra etiquetas cuando el zoom es cercano

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          mapType="satellite"
          initialRegion={defaultCenter}
          onLongPress={handleLongPress}
          onRegionChangeComplete={handleRegionChange}
        >
          {coordenadas.length > 0 && (
            <Circle
              center={{
                latitude: coordenadas[0].latitud,
                longitude: coordenadas[0].longitud,
              }}
              radius={100}
              strokeColor="rgba(0, 122, 255, 0.8)"
              fillColor="rgba(0, 122, 255, 0.2)"
              zIndex={1}
            />
          )}

          {coordenadas.map((coordenada, index) => (
            <React.Fragment key={`coord-${index}-${forceUpdate}`}>
              <Circle
                center={{
                  latitude: coordenada.latitud,
                  longitude: coordenada.longitud,
                }}
                radius={1}
                strokeColor="rgba(255, 255, 255, 0.9)"
                fillColor="rgba(255, 255, 255, 0.5)"
              />
              <Circle
                center={{
                  latitude: coordenada.latitud,
                  longitude: coordenada.longitud,
                }}
                radius={15}
                strokeColor="rgba(255, 10, 10, 0.8)"
                fillColor="rgba(255, 20, 20, 0.5)"
              />
              
              {/* Mostramos las etiquetas cuando el zoom es suficiente */}
              {shouldShowLabels && (
                <Marker
                  coordinate={{
                    latitude: coordenada.latitud,
                    longitude: coordenada.longitud,
                  }}
                  anchor={{ x: 0.5, y: 1.5 }}
                  tracksViewChanges={true} // Cambiado a true para que reaccione a los cambios
                >
                  <View
                    style={{
                      backgroundColor: "transparent",
                      paddingHorizontal: 0,
                      paddingVertical: 4,
                      borderRadius: 4,
                      fontSize: 100,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {coordenada.nombre_subparcela}
                    </Text>
                  </View>
                </Marker>
              )}
            </React.Fragment>
          ))}
          
          {/* Debug: Agregar log para verificar los datos */}
          {console.log("Renderizando centros poblados:", centrosPoblados)}
          
          {/* Corregido: Bloque apropiadamente cerrado para centrosPoblados con verificación */}
          {Array.isArray(centrosPoblados) && centrosPoblados.length > 0 ? (
            centrosPoblados.map((centro, index) => (
              <Marker
                key={`centro-${index}-${forceUpdate}`}
                coordinate={{
                  latitude: parseFloat(centro.latitud),
                  longitude: parseFloat(centro.longitud),
                }}
                title={centro.descripcion}
              >
                <Image
                  source={require("../assets/poblado.png")}
                  style={{ width: 28, height: 28 }}
                  resizeMode="contain"
                />
              </Marker>
            ))
          ) : (
            // Marcador de prueba opcional para depuración
            <Marker
              key="test-marker"
              coordinate={{
                latitude: defaultCenter.latitude + 0.001,
                longitude: defaultCenter.longitude + 0.001,
              }}
              title="Marcador de prueba"
            >
              <Image
                source={require("../assets/poblado.png")}
                style={{ width: 28, height: 28 }}
                resizeMode="contain"
              />
            </Marker>
          )}

          {puntosReferencia.map((punto, index) => (
            <ReferenciaMarker
              key={`ref-${index}-${forceUpdate}`}
              punto={punto}
              index={index}
              onPress={openModal}
            />
          ))}
        </MapView>
      </View>

      <ReferenciaModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onContinuar={continuar}
        onEliminar={eliminarPunto}
        puntoId={puntoId}
        selectedPunto={selectedPunto}
        editedDescription={editedDescription}
        setEditedDescription={setEditedDescription}
        errorMedicion={errorMedicion}
        setErrorMedicion={setErrorMedicion}
      />

      <TrayectoModal
        visible={trayectoModalVisible}
        onClose={handleCloseTrayectoModal}
        onConfirmar={confirmarTrayecto}
        trayectos={puntosReferencia
          .map((punto) => punto.trayecto)
          .filter(Boolean)}
        selectedPunto={tempPuntoData || selectedPunto}
        trayectoEditado={(tempPuntoData || selectedPunto)?.trayecto}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});