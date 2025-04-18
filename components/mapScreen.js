import React, { useState, useEffect, useRef } from "react";
import { View, SafeAreaView, StyleSheet, Text, Image, ActivityIndicator } from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useBrigadista } from "../context/BrigadistaContext";
import ReferenciaModal from "./puntoReferenciaModal";
import ReferenciaMarker from "./referenciaMarker";
import TrayectoModal from "./trayectoModal";

// Importar los hooks personalizados
import { useCoordenadas } from "../hooks/useCoordenadas";
import { useCentrosPoblados } from "../hooks/useCentrosPoblados";
import { useReferencias } from "../hooks/useReferencia";
import { useTrayectos } from "../hooks/useTrayecto";
import { usePuntosReferencia } from "../hooks/usePuntosReferencia";

export default function MapScreen() {
  const { brigadista } = useBrigadista();
  const mapRef = useRef(null);
  
  // Custom hooks
  const { coordenadas, fetchCoordenadas, isLoading: loadingCoordenadas } = useCoordenadas(brigadista);
  const { centrosPoblados, isLoading: loadingCentros } = useCentrosPoblados(brigadista);
  const { getSiguienteId, guardarReferencia, actualizarPuntoReferencia, borrarReferencia } = useReferencias();
  const { guardarTrayecto, actualizarDatosTrayecto } = useTrayectos();
  
  // Usar el hook para gestionar puntos de referencia desde la base de datos
  const { 
    puntosReferencia, 
    setPuntosReferencia, 
    fetchPuntosReferencia,
    isLoading: loadingPuntosReferencia 
  } = usePuntosReferencia(brigadista);

  // Estado local
  const [modalVisible, setModalVisible] = useState(false);
  const [trayectoModalVisible, setTrayectoModalVisible] = useState(false);
  const [selectedPunto, setSelectedPunto] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [errorMedicion, setErrorMedicion] = useState("");
  const [puntoId, setPuntoId] = useState("");
  const [tempPuntoData, setTempPuntoData] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Coordenadas por defecto (Bucaramanga)
  const defaultCenter = {
    latitude: 7.12539,
    longitude: -73.1198,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const [mapZoom, setMapZoom] = useState(defaultCenter.latitudeDelta);
  const [isLoading, setIsLoading] = useState(true);

  // Función para generar puntos de referencia
  const generarReferenciaInicial = (id, coordinate) => {
    return {
      id,
      title: `Punto de referencia ${puntosReferencia.length + 1}`,
      description: "",
      errorMedicion: "",
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    };
  };

  // Verificar si todos los datos están cargados
  useEffect(() => {
    if (!loadingCoordenadas && !loadingCentros && !loadingPuntosReferencia) {
      setIsLoading(false);
    }
  }, [loadingCoordenadas, loadingCentros, loadingPuntosReferencia]);

  // Ajustar el mapa a las coordenadas si están disponibles
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

  // Refrescar puntos cuando sea necesario
  const refreshPuntos = async () => {
    await fetchPuntosReferencia();
  };

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

    // Actualiza el estado local
    const nuevosPuntos = puntosReferencia.map((punto, i) =>
      punto.id === puntoConTrayecto.id ? puntoConTrayecto : punto
    );

    // Si es un punto nuevo (no existe en el array), agrégalo
    if (!puntosReferencia.some(p => p.id === puntoConTrayecto.id)) {
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
        // Actualiza el trayecto existente usando un hook personalizado
        await actualizarDatosTrayecto(datosTrayecto, puntoBase.id);
        console.log("✏️ Trayecto actualizado correctamente");
      }
      
      // Refresca los puntos de la base de datos para asegurar que tengamos los datos más actualizados
      await refreshPuntos();
    } catch (error) {
      console.error("❌ Error al guardar o editar:", error);
    }
  };

  const handleLongPress = async (event) => {
    const coordinate = event.nativeEvent.coordinate;

    // Obtén el siguiente ID usando el hook personalizado
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

  // Mostrar indicador de carga mientras se obtienen los datos
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </SafeAreaView>
    );
  }

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
          {coordenadas.length > 0 && coordenadas[0].latitud && coordenadas[0].longitud && (
            <Circle
              center={{
                latitude: typeof coordenadas[0].latitud === 'string' ? parseFloat(coordenadas[0].latitud) : coordenadas[0].latitud,
                longitude: typeof coordenadas[0].longitud === 'string' ? parseFloat(coordenadas[0].longitud) : coordenadas[0].longitud,
              }}
              radius={100}
              strokeColor="rgba(0, 122, 255, 0.8)"
              fillColor="rgba(0, 122, 255, 0.2)"
              zIndex={1}
            />
          )}

          {coordenadas.map((coordenada, index) => {
            // Omitir coordenadas inválidas
            if (!coordenada.latitud || !coordenada.longitud) return null;
            
            // Asegurar que las coordenadas sean números
            const lat = typeof coordenada.latitud === 'string' ? parseFloat(coordenada.latitud) : coordenada.latitud;
            const lng = typeof coordenada.longitud === 'string' ? parseFloat(coordenada.longitud) : coordenada.longitud;
            
            // Omitir si son números inválidos
            if (isNaN(lat) || isNaN(lng)) return null;
            
            return (
              <React.Fragment key={`coord-${index}-${forceUpdate}`}>
                <Circle
                  center={{
                    latitude: lat,
                    longitude: lng,
                  }}
                  radius={1}
                  strokeColor="rgba(255, 255, 255, 0.9)"
                  fillColor="rgba(255, 255, 255, 0.5)"
                />
                <Circle
                  center={{
                    latitude: lat,
                    longitude: lng,
                  }}
                  radius={15}
                  strokeColor="rgba(255, 10, 10, 0.8)"
                  fillColor="rgba(255, 20, 20, 0.5)"
                />
                {shouldShowLabels && (
                  <Marker
                    coordinate={{
                      latitude: lat,
                      longitude: lng,
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
            );
          })}

          {centrosPoblados.map((centro, index) => {
            // Omitir coordenadas inválidas
            if (!centro.latitud || !centro.longitud) return null;
            
            // Asegurar que las coordenadas sean números
            const lat = parseFloat(centro.latitud);
            const lng = parseFloat(centro.longitud);
            
            // Omitir si el parsing resultó en NaN
            if (isNaN(lat) || isNaN(lng)) return null;
            
            return (
              <Marker
                key={`centro-${index}-${forceUpdate}`}
                coordinate={{
                  latitude: lat,
                  longitude: lng,
                }}
                title={centro.descripcion}
              >
                <Image
                  source={require("../assets/poblado.png")}
                  style={{ width: 28, height: 28 }}
                  resizeMode="contain"
                />
              </Marker>
            );
          })}

          {puntosReferencia.map((punto, index) => (
            <ReferenciaMarker
              key={`ref-${punto.id}-${forceUpdate}`}
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  }
});