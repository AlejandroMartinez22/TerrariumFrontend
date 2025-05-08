/*LISTO COMPONENTE */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  Alert, // Añadido el import de Alert aquí
} from "react-native";
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
import { useValidacionGeografica } from "../hooks/useValidacionGeografica";
import { useCampamentoVerification } from "../hooks/useCampamentoVerificacion";

export default function MapScreen() {
  const { brigadista, localTutorialCompletado, completarTutorial } = useBrigadista();
  const { calcularDistancia, validarDistanciaPunto } = useValidacionGeografica();
  const DISTANCIA_MAXIMA = 5000; //(5km)
  const mapRef = useRef(null);

  // Custom hooks
  const {
    coordenadas,
    fetchCoordenadas,
    isLoading: loadingCoordenadas,
  } = useCoordenadas(brigadista);

  const { centrosPoblados, fetchCentrosPoblados, isLoading: loadingCentros } = useCentrosPoblados(brigadista);

  const { 
    existeCampamento, 
    actualizarEstadoCampamento, 
    verificarCampamento 
  } = useCampamentoVerification();

  const {
    getSiguienteId,
    guardarReferencia,
    actualizarPuntoReferencia,
    borrarReferencia,
  } = useReferencias();

  const { guardarTrayecto, actualizarDatosTrayecto } = useTrayectos();

  // Usar el hook para gestionar puntos de referencia desde la base de datos
  const {
    puntosReferencia,
    setPuntosReferencia,
    fetchPuntosReferencia,
    isLoading: loadingPuntosReferencia,
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
  const [isNewPoint, setIsNewPoint] = useState(false);
  const [defaultCenter, setDefaultCenter] = useState(null);
  const [tipoPunto, setTipoPunto] = useState("Referencia"); // Valor predeterminado


  const [mapZoom, setMapZoom] = useState("0.2");
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


  // para establecer correctamente el tipoPunto al editar un punto existente
  useEffect(() => {
    if (modalVisible && selectedPunto && !isNewPoint) {
      // Si estamos editando un punto existente, cargar su tipo
      setTipoPunto(selectedPunto.tipo || "Referencia");
    } else if (modalVisible && isNewPoint) {
      // Si es un punto nuevo, reiniciar al valor predeterminado
      setTipoPunto("Referencia");
    }
  }, [modalVisible, selectedPunto, isNewPoint]);
  

  useEffect(() => {
    verificarCampamento();
  }, []);
  
  // Función para actualizar el estado del campamento después de guardar o eliminar
  const actualizarEstadoTipoCampamento = async (puntoData, esEliminacion = false) => {
    if (!puntoData) return;
    
    // Si se está eliminando un campamento o cambiando su tipo desde campamento a referencia
    if ((esEliminacion && puntoData.tipo === "Campamento") || 
       (!esEliminacion && puntoData.tipo !== "Campamento" && selectedPunto?.tipo === "Campamento")) {
      actualizarEstadoCampamento(false, null);
    } 
    // Si se está creando un nuevo campamento o cambiando un punto a tipo campamento
    else if (!esEliminacion && puntoData.tipo === "Campamento") {
      actualizarEstadoCampamento(true, puntoData.id);
    }
  };
  

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

  useEffect(() => {
    if (!loadingCoordenadas && coordenadas.length > 0) {
      const firstValid = coordenadas.find(
        (coord) => coord.latitud && coord.longitud
      );
      if (firstValid) {
        setDefaultCenter({
          latitude: parseFloat(firstValid.latitud),
          longitude: parseFloat(firstValid.longitud),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    }
  }, [loadingCoordenadas, coordenadas]);

  // Refrescar puntos cuando sea necesario
  const refreshPuntos = async () => {
    await fetchPuntosReferencia();
  };

  const openModal = (punto, index) => {
    setSelectedPunto({ ...punto, index });
    setEditedDescription(punto.description || "");
    setErrorMedicion(punto.errorMedicion || "");
    setPuntoId(punto.id);
    setTipoPunto(punto.tipo || "Referencia"); // Añadir esta línea
    setIsNewPoint(false); // Es un punto existente
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

    // Preparamos los datos actualizados
    const puntoActualizado = {
      ...selectedPunto,
      title:
        selectedPunto.title || `Punto de referencia ${selectedPunto.index + 1}`,
      description: editedDescription,
      errorMedicion: errorMedicion,
      latitude: selectedPunto.latitude,
      longitude: selectedPunto.longitude,
      tipo: tipoPunto,
    };

    // Almacenamos temporalmente el punto actualizado
    setTempPuntoData(puntoActualizado);
    setModalVisible(false);

    // Si no vamos a mostrar el modal de trayecto, guardamos directamente
    if (!(!localTutorialCompletado && isNewPoint)) {
      await guardarSinTrayecto(puntoActualizado); // Pasar el punto actualizado directamente
    } else {
      // Si mostraremos el modal de trayecto, dejamos que confirmarTrayecto se encargue
      setTrayectoModalVisible(true);
    }
  };

  // Nueva función para guardar punto sin trayecto
  const guardarSinTrayecto = async (puntoData) => {
    // Usar el punto pasado directamente o caer en el tempPuntoData
    const puntoAGuardar = puntoData || tempPuntoData;
  
    if (!puntoAGuardar) return;
  
    try {
      if (isNewPoint) {
        console.log("🆕 Guardando nuevo punto sin trayecto");
        await guardarReferencia(puntoAGuardar, brigadista.cedula);
  
        // Actualizar la interfaz con el nuevo punto
        setPuntosReferencia([...puntosReferencia, puntoAGuardar]);
        
        // Actualizar estado de campamento si es necesario
        await actualizarEstadoTipoCampamento(puntoAGuardar);
      } else {
        console.log("🔄 Actualizando punto existente");
        await actualizarPuntoReferencia(puntoAGuardar, brigadista.cedula);
  
        // Actualizar la interfaz
        const updatedPuntos = puntosReferencia.map((p) =>
          p.id === puntoAGuardar.id ? puntoAGuardar : p
        );
        setPuntosReferencia(updatedPuntos);
        
        // Actualizar estado de campamento si es necesario
        await actualizarEstadoTipoCampamento(puntoAGuardar);
      }
  
      // Refresca los puntos de la base de datos
      await refreshPuntos();
    } catch (error) {
      console.error("❌ Error al guardar punto:", error);
    }
  
    setTempPuntoData(null); // Limpiamos el punto temporal
  };

  const confirmarTrayecto = async (datosTrayecto) => {
    if (!tempPuntoData && !selectedPunto) return;

    const puntoBase = tempPuntoData || selectedPunto;
    const puntoConTrayecto = {
      ...puntoBase,
      trayecto: datosTrayecto,
    };

    try {
      if (isNewPoint) {
        console.log("🆕 Guardando nuevo punto y trayecto");
        const puntoId = await guardarReferencia(
          puntoConTrayecto,
          brigadista.cedula
        );

        if (puntoId) {
          // Aseguramos que el trayecto se guarde con el ID correcto
          await guardarTrayecto(datosTrayecto, puntoId, brigadista.cedula);
          console.log("✅ Punto y trayecto nuevos guardados");

          // Añadir el ID correcto al punto para la interfaz
          const puntoCompleto = { ...puntoConTrayecto, id: puntoId };

          // Actualizar la interfaz con el nuevo punto
          setPuntosReferencia([...puntosReferencia, puntoCompleto]);
        }
      } else {
        console.log("🔄 Actualizando punto y trayecto existentes");
        await actualizarPuntoReferencia(puntoConTrayecto, brigadista.cedula);
        await actualizarDatosTrayecto(
          datosTrayecto,
          puntoBase.id,
          brigadista.cedula
        );
        console.log("✏️ Punto y trayecto actualizados correctamente");

        // Actualizar la interfaz
        const updatedPuntos = puntosReferencia.map((p) =>
          p.id === puntoConTrayecto.id ? puntoConTrayecto : p
        );
        setPuntosReferencia(updatedPuntos);
      }

      // Refresca los puntos de la base de datos
      await refreshPuntos();
    } catch (error) {
      console.error("❌ Error al guardar punto y trayecto:", error);
    }

    await actualizarEstadoTipoCampamento(puntoConTrayecto);
    setTrayectoModalVisible(false);
    setTempPuntoData(null); // Limpiamos el punto temporal
  };

  const handleLongPress = async (event) => {
    const coordinate = event.nativeEvent.coordinate;
    
    // Verificar si hay coordenadas del conglomerado disponibles
    if (coordenadas.length === 0 || !coordenadas[0].latitud || !coordenadas[0].longitud) {
      Alert.alert(
        "Error",
        "No se puede añadir un punto de referencia porque no hay información del conglomerado disponible."
      );
      return;
    }

    // Obtener las coordenadas del centro del conglomerado (primer elemento del array)
    const centroConglomerado = {
      latitude: typeof coordenadas[0].latitud === "string" 
        ? parseFloat(coordenadas[0].latitud) 
        : coordenadas[0].latitud,
      longitude: typeof coordenadas[0].longitud === "string" 
        ? parseFloat(coordenadas[0].longitud) 
        : coordenadas[0].longitud
    };

    // Usar la función del hook para validar la distancia
    const validacion = validarDistanciaPunto(
      coordinate,
      centroConglomerado,
      DISTANCIA_MAXIMA
    );

    // Si el punto no es válido, mostrar alerta y salir
    if (!validacion.valido) {
      Alert.alert(
        "Ubicación no válida",
        `El punto que intentas agregar está muy alejado del área del conglomerado, Este debe encontrarse dentro de un radio de 5 km. Por favor, selecciona una ubicación más cercana.`
      );
      return;
    } 

    try {
      // Proceder con la creación del punto de referencia
      // Obtén el siguiente ID usando el hook personalizado
      const siguienteId = await getSiguienteId();

      if (siguienteId) {
        const nuevoPunto = {
          ...generarReferenciaInicial(siguienteId, coordinate),
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          tipo: tipoPunto,
        };

        setSelectedPunto({ ...nuevoPunto, index: puntosReferencia.length });
        setEditedDescription("");
        setErrorMedicion("");
        setPuntoId(nuevoPunto.id);
        setIsNewPoint(true); // Marcamos como punto nuevo
        setModalVisible(true);
      } else {
        console.error("No se pudo generar un nuevo ID.");
      }
    } catch (error) {
      console.error("Error al generar nuevo punto:", error);
    }
  };


  const eliminarPunto = async (puntoId) => {
    try {
      // Si es un punto nuevo que aún no se ha guardado, simplemente cerramos el modal
      if (isNewPoint) {
        setModalVisible(false);
        return;
      }
      
      // Guardar una referencia al punto antes de eliminarlo para saber si era un campamento
      const puntoAEliminar = puntosReferencia.find(p => p.id === puntoId);
  
      // Pasar la cédula del brigadista actual como segundo parámetro
      const resultado = await borrarReferencia(puntoId, brigadista.cedula);
  
      if (resultado.success) {
        const nuevosPuntos = puntosReferencia.filter(
          (punto) => punto.id !== puntoId
        );
        setPuntosReferencia(nuevosPuntos);
        console.log(`Punto con ID ${puntoId} eliminado correctamente`);
        
        // Actualizar estado de campamento si eliminamos un campamento
        if (puntoAEliminar && puntoAEliminar.tipo === "Campamento") {
          actualizarEstadoCampamento(false, null);
        }
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
  if (isLoading || !defaultCenter) {
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
          {coordenadas.length > 0 &&
            coordenadas[0].latitud &&
            coordenadas[0].longitud && (
              <Circle
                center={{
                  latitude:
                    typeof coordenadas[0].latitud === "string"
                      ? parseFloat(coordenadas[0].latitud)
                      : coordenadas[0].latitud,
                  longitude:
                    typeof coordenadas[0].longitud === "string"
                      ? parseFloat(coordenadas[0].longitud)
                      : coordenadas[0].longitud,
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
            const lat =
              typeof coordenada.latitud === "string"
                ? parseFloat(coordenada.latitud)
                : coordenada.latitud;
            const lng =
              typeof coordenada.longitud === "string"
                ? parseFloat(coordenada.longitud)
                : coordenada.longitud;

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
                    <View
                      style={{ backgroundColor: "transparent", padding: 4 }}
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
                  source={require("../assets/IconoCentroPoblado.png")}
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
        isNewPoint={isNewPoint}
        cedulaUsuarioActual={brigadista?.cedula}
        tipoPunto={tipoPunto}         
        setTipoPunto={setTipoPunto}  
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

// Estilos para el componente
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
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});
