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
import { obtenerSiguienteId } from "../supabase/getUltimoIdReferencia"; // Importamos la función para obtener el siguiente ID
import { insertarReferencia } from "../supabase/saveReferencia"; // Función para insertar el punto de referencia
import { insertarTrayecto } from "../supabase/saveTrayecto"; // Función para insertar el trayecto
import { actualizarTrayecto } from "../supabase/updateTrayecto";
import { actualizarReferencia } from "../supabase/updateReferencia";
import { eliminarReferencia } from "../supabase/deleteReferencia";


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

  const [mapZoom, setMapZoom] = useState(defaultCenter.latitudeDelta);
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

  useEffect(() => {
    const fetchCentrosPoblados = async () => {
      if (brigadista) {
        try {
          const centros = await getCentrosPoblados(brigadista);
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
    setPuntoId(punto.id); // Usamos el ID real asignado
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
      title:
        selectedPunto.title || `Punto de referencia ${selectedPunto.index + 1}`,
      description: editedDescription,
      errorMedicion: errorMedicion,
      latitude: selectedPunto.latitude,
      longitude: selectedPunto.longitude,
    };

    setTempPuntoData(puntoActualizado);
    setModalVisible(false);

    // Aquí llamas a la función para actualizar el punto en la base de datos
    try {
      // Llamada para actualizar el punto de referencia
      await actualizarReferencia(puntoActualizado, brigadista.cedula);

      // Luego abres el modal del trayecto
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
        // Inserta el nuevo trayecto
        const puntoId = await insertarReferencia(
          puntoConTrayecto,
          brigadista.cedula
        );
        await insertarTrayecto(datosTrayecto, puntoId);
        console.log("✅ Punto y trayecto guardados");
      } else {
        // Actualiza el trayecto existente
        await actualizarTrayecto(datosTrayecto, puntoBase.id);
        console.log("✏️ Trayecto actualizado correctamente");
      }
    } catch (error) {
      console.error("❌ Error al guardar o editar:", error);
    }
  };

  const handleLongPress = async (event) => {
    console.log(selectedPunto);
    const coordinate = event.nativeEvent.coordinate;

    // Obtén el siguiente ID utilizando la función asincrónica
    const siguienteId = await obtenerSiguienteId();

    if (siguienteId) {
      const nuevoPunto = {
        ...generarReferenciaInicial(siguienteId, coordinate),
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      };

      // Asigna los valores correspondientes
      setSelectedPunto({ ...nuevoPunto, index: puntosReferencia.length });
      setEditedDescription("");
      setErrorMedicion("");
      setPuntoId(nuevoPunto.id);
      setModalVisible(true);
    } else {
      console.error("No se pudo generar un nuevo ID.");
    }
  };


  // Luego, modifica tu función eliminarPunto para usar el nuevo método:
  const eliminarPunto = async (puntoId) => {
    try {
      // Llamar a la función para eliminar de la base de datos
      const resultado = await eliminarReferencia(puntoId);

      if (resultado.success) {
        // Si la eliminación en la base de datos fue exitosa, actualiza el estado local
        const nuevosPuntos = puntosReferencia.filter(
          (punto) => punto.id !== puntoId
        );
        setPuntosReferencia(nuevosPuntos);
        console.log(`Punto con ID ${puntoId} eliminado correctamente`);
      } else {
        console.error("Error al eliminar el punto:", resultado.error);
        // Opcionalmente, puedes mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error("Error al procesar la eliminación:", error);
    }

    // Cerrar el modal después de intentar eliminar el punto
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
        selectedPunto={selectedPunto} // Añade esta línea
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
