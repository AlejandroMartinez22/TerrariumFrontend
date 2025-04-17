import React, { useState, useEffect, useRef } from "react";
import { View, SafeAreaView, StyleSheet, Text, Image } from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useBrigadista } from "../context/BrigadistaContext";
import { useReferencia } from "../context/ReferenciaContext";
import ReferenciaModal from "./puntoReferenciaModal";
import ReferenciaMarker from "./referenciaMarker";
import TrayectoModal from "./trayectoModal";

// Importar los hooks personalizados
import { useCoordenadas } from "../hooks/useCoordenadas";
import { useCentrosPoblados } from "../hooks/useCentrosPoblados";
import { useReferencias } from "../hooks/usePuntoReferencia";
import { useTrayectos } from "../hooks/useTrayecto";

export default function MapScreen() {
  const { brigadista } = useBrigadista();
  const mapRef = useRef(null);
  const { puntosReferencia, generarReferenciaInicial, setPuntosReferencia } = useReferencia();

  // Custom hooks
  const { coordenadas, fetchCoordenadas } = useCoordenadas(brigadista);
  const { centrosPoblados } = useCentrosPoblados(brigadista);
  const { getSiguienteId, guardarReferencia, actualizarPuntoReferencia, borrarReferencia } = useReferencias();
  const { guardarTrayecto, actualizarDatosTrayecto } = useTrayectos();

  // Estado local
  const [modalVisible, setModalVisible] = useState(false);
  const [trayectoModalVisible, setTrayectoModalVisible] = useState(false);
  const [selectedPunto, setSelectedPunto] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [errorMedicion, setErrorMedicion] = useState("");
  const [puntoId, setPuntoId] = useState("");
  const [tempPuntoData, setTempPuntoData] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  const defaultCenter = {
    latitude: 7.12539,
    longitude: -73.1198,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const [mapZoom, setMapZoom] = useState(defaultCenter.latitudeDelta);

  useEffect(() => {
    if (coordenadas.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(
        coordenadas.map((coord) => ({
          latitude: coord.latitud,
          longitude: coord.longitud,
        })),
        {
          edgePadding: { top: 50, bottom: 50, left: 50, right: 50 },
          animated: true,
        }
      );
    }
  }, [coordenadas]);

  const openModal = (punto, index) => {
    setSelectedPunto({ ...punto, index });
    setEditedDescription(punto.description || "");
    setErrorMedicion(punto.errorMedicion || "");
    setPuntoId(punto.id);
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

  const continuar = async () => {
    if (!selectedPunto) return;

    const puntoActualizado = {
      ...selectedPunto,
      title: selectedPunto.title || `Punto de referencia ${selectedPunto.index + 1}`,
      description: editedDescription,
      errorMedicion: errorMedicion,
      latitude: selectedPunto.latitude,
      longitude: selectedPunto.longitude,
    };

    setTempPuntoData(puntoActualizado);
    setModalVisible(false);

    try {
      // Actualiza el punto de referencia usando el hook personalizado
      await actualizarPuntoReferencia(puntoActualizado, brigadista.cedula);
      setTrayectoModalVisible(true);
    } catch (error) {
      console.error("❌ Error al actualizar el punto de referencia:", error);
    }
  };

  const confirmarTrayecto = async (datosTrayecto) => {
    if (!tempPuntoData && !selectedPunto) return;

    const puntoBase = tempPuntoData || selectedPunto;
    const puntoConTrayecto = {
      ...puntoBase,
      trayecto: datosTrayecto,
    };

    const esEdicion = puntoBase?.trayecto !== undefined;

    const nuevosPuntos = puntosReferencia.map((punto, i) =>
      i === puntoConTrayecto.index ? puntoConTrayecto : punto
    );

    // Si es un punto nuevo (no existe en el array), lo añadimos
    if (puntoConTrayecto.index >= puntosReferencia.length) {
      nuevosPuntos.push(puntoConTrayecto);
    }

    setPuntosReferencia(nuevosPuntos);
    setTrayectoModalVisible(false);

    try {
      if (!esEdicion) {
        // Inserta el nuevo punto y trayecto usando hooks personalizados
        const puntoId = await guardarReferencia(puntoConTrayecto, brigadista.cedula);
        await guardarTrayecto(datosTrayecto, puntoId);
        console.log("✅ Punto y trayecto guardados");
      } else {
        // Actualiza el trayecto existente usando hook personalizado
        await actualizarDatosTrayecto(datosTrayecto, puntoBase.id);
        console.log("✏️ Trayecto actualizado correctamente");
      }
    } catch (error) {
      console.error("❌ Error al guardar o editar:", error);
    }
  };

  const handleLongPress = async (event) => {
    const coordinate = event.nativeEvent.coordinate;

    // Obtén el siguiente ID utilizando el hook personalizado
    const siguienteId = await getSiguienteId();

    if (siguienteId) {
      const nuevoPunto = {
        ...generarReferenciaInicial(siguienteId, coordinate),
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      };

      setSelectedPunto({ ...nuevoPunto, index: puntosReferencia.length });
      setEditedDescription("");
      setErrorMedicion("");
      setPuntoId(nuevoPunto.id);
      setModalVisible(true);
    } else {
      console.error("No se pudo generar un nuevo ID.");
    }
  };

  const eliminarPunto = async (puntoId) => {
    try {
      // Eliminar usando el hook personalizado
      const resultado = await borrarReferencia(puntoId);

      if (resultado.success) {
        const nuevosPuntos = puntosReferencia.filter((punto) => punto.id !== puntoId);
        setPuntosReferencia(nuevosPuntos);
        console.log(`Punto con ID ${puntoId} eliminado correctamente`);
      } else {
        console.error("Error al eliminar el punto:", resultado.error);
      }
    } catch (error) {
      console.error("Error al procesar la eliminación:", error);
    }

    setModalVisible(false);
  };

  const handleRegionChange = (region) => {
    const newZoom = region.latitudeDelta;

    if (Math.abs(mapZoom - newZoom) > 0.0001) {
      setMapZoom(newZoom);
      setForceUpdate((prev) => prev + 1);
    }
  };

  const shouldShowLabels = mapZoom < 0.005;

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
              {shouldShowLabels && (
                <Marker
                  coordinate={{
                    latitude: coordenada.latitud,
                    longitude: coordenada.longitud,
                  }}
                >
                  <View style={{ backgroundColor: "transparent", padding: 4 }}>
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

          {centrosPoblados.map((centro, index) => (
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
          ))}

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
        onEliminar={() => eliminarPunto(selectedPunto?.id)}
        editedDescription={editedDescription}
        setEditedDescription={setEditedDescription}
        errorMedicion={errorMedicion}
        setErrorMedicion={setErrorMedicion}
        puntoId={puntoId}
        selectedPunto={selectedPunto}
      />

      <TrayectoModal
        visible={trayectoModalVisible}
        onClose={handleCloseTrayectoModal}
        onConfirmar={confirmarTrayecto}
        trayectos={puntosReferencia.map((p) => p.trayecto).filter(Boolean)}
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
    flex: 1,
  },
});