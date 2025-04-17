import React, { useState, useEffect, useRef } from "react";
import { View, SafeAreaView, StyleSheet, Text, Image } from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useReferenciaRealtime } from "../hooks/useReferenciaRealtime";
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

export default function MapScreen() {
  const { brigadista } = useBrigadista();
  const [coordenadas, setCoordenadas] = useState([]);
  const mapRef = useRef(null);
  const { siguienteId } = useReferenciaRealtime();
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

  const confirmarTrayecto = async (datosTrayecto) => {
    if (!tempPuntoData) return;

    // Combinamos los datos del punto de referencia y del trayecto
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

    // Guardamos el punto de referencia y el trayecto en la base de datos
    try {
      const puntoId = await insertarReferencia(
        puntoConTrayecto,
        brigadista.cedula
      ); // Guarda el punto de referencia

      // Ahora guardamos el trayecto asociado
      await insertarTrayecto(datosTrayecto, puntoId); // Guarda el trayecto en la base de datos

      console.log("Punto de referencia y trayecto insertados correctamente");
    } catch (error) {
      console.error("Error al insertar punto de referencia o trayecto:", error);
    }
  };

  const handleLongPress = async (event) => {
    const coordinate = event.nativeEvent.coordinate;

    // Obtén el siguiente ID utilizando la función asincrónica
    const siguienteId = await obtenerSiguienteId();

    if (siguienteId) {
      const nuevoPunto = {
        ...generarReferenciaInicial(coordinate),
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        id: siguienteId, // Asigna el siguiente ID generado
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

  const eliminarPunto = (puntoId) => {
    // Filtramos el punto por su ID para eliminarlo de la lista de puntos
    const nuevosPuntos = puntosReferencia.filter(
      (punto) => punto.id !== puntoId
    );
    setPuntosReferencia(nuevosPuntos);

    // Opcionalmente, puedes agregar la lógica para eliminar el punto de la base de datos aquí
    console.log(`Punto con ID ${puntoId} eliminado de la lista`);

    // Si necesitas eliminar el punto en la base de datos también, puedes hacerlo aquí:
    // await supabase.from('punto_referencia').delete().match({ id: puntoId });

    // Cerrar el modal después de eliminar el punto
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
        onEliminar={() => eliminarPunto(selectedPunto?.id)} // Pasa la función de eliminar con el ID del punto
        editedDescription={editedDescription}
        setEditedDescription={setEditedDescription}
        errorMedicion={errorMedicion}
        setErrorMedicion={setErrorMedicion}
        puntoId={puntoId}
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
    flex: 1,
  },
});
