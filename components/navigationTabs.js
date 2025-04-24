  import React, { useEffect, useState } from "react";
  import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
  import { Image, View, TouchableWithoutFeedback, Alert } from "react-native";
  import { useIsFocused } from "@react-navigation/native";

  import MapScreen from "./mapScreen";
  import AddScreen from "./addScreen";
  import ViewScreen from "./viewScreen";

  import TutorialOverlay from "./tutorialOverlay";
  import CaracteristicasModal from "./CaracteristicasModal";
  import { useBrigadista } from "../context/BrigadistaContext";
  import { useReferencia } from "../context/ReferenciaContext";
  import { useSubparcelas } from "../context/SubparcelaContext";

  import { useSincronizarSubparcelas } from "../hooks/useSincronizarSubparcelas";
  import { VerificarPuntosEnBackEnd } from "../api"; 

  import AsyncStorage from "@react-native-async-storage/async-storage";



  const Tab = createBottomTabNavigator();

  export default function NavigationTabs() {
    const [showTutorial, setShowTutorial] = useState(false);
    const [timerStarted, setTimerStarted] = useState(false);
    const [tutorialStep, setTutorialStep] = useState(1);
    const [showCaracteristicasModal, setShowCaracteristicasModal] = useState(false);
    
    // Estado para manejar el índice de la subparcela actual
    const [currentSubparcelaIndex, setCurrentSubparcelaIndex] = useState(0);
    
    // Inicializar estados para CaracteristicasModal
    const [errorMedicion, setErrorMedicion] = useState("");
    const [selectedPunto, setSelectedPunto] = useState({ latitude: 0, longitude: 0 });
    
    const { brigadista, localTutorialCompletado, completarTutorial } = useBrigadista();
    const { puntosReferencia, cargarPuntosReferencia } = useReferencia();
    const { subparcelas, loading } = useSubparcelas(); // Obtener subparcelas del contexto
    const isFocused = useIsFocused();

    // Estado para almacenar la cantidad de puntos de referencia verificados directamente de la BD
    const [cantidadPuntos, setCantidadPuntos] = useState(0);

    // Hook para sincronizar con Supabase
    const { sincronizar, loading: sincronizandoData } = useSincronizarSubparcelas();

    // Estado para almacenar las características de todas las subparcelas
    const [subparcelasCaracteristicas, setSubparcelasCaracteristicas] = useState({});
    const [sincronizando, setSincronizando] = useState(false);

    // Función para verificar puntos de referencia directamente en la base de datos
    const verificarPuntosDirectamente = async () => {
      if (brigadista?.cedula) {
        try {
          console.log("Verificando puntos directamente para:", brigadista.cedula);
          const cantidad = await VerificarPuntosEnBackEnd(brigadista.cedula);
          console.log("Cantidad de puntos verificados en BD:", cantidad);
          
          // Asegúrate de que cantidad sea numérico
          setCantidadPuntos(Number(cantidad) || 0);
          
          // Si estamos en el paso 4 y hay suficientes puntos, avanzar
          if (tutorialStep === 4 && cantidad >= 4) {
            console.log(`Avanzando al paso 5 con ${cantidad} puntos verificados en BD`);
            setTutorialStep(5);
          }
          
          return cantidad;
        } catch (error) {
          console.error("Error al verificar puntos:", error);
          // En caso de error, asegurarse de que no afecte la UI
          setCantidadPuntos(0);
        }
      }
      return 0;
    };

    // Cargar puntos de referencia cuando el brigadista está disponible
    useEffect(() => {
      if (brigadista && brigadista.cedula) {
        console.log("Cargando puntos para brigadista:", brigadista.cedula);
        cargarPuntosReferencia(brigadista.cedula);
        verificarPuntosDirectamente(); // Verificar cantidad directamente en BD
      }
    }, [brigadista]);

    useEffect(() => {
      if (
        isFocused &&
        brigadista &&
        !localTutorialCompletado &&
        brigadista.rol === "Jefe de Brigada" &&
        !timerStarted
      ) {
        setTimerStarted(true);
        setTimeout(() => {
          setShowTutorial(true);
        }, 6000);
      }
    }, [isFocused, brigadista, localTutorialCompletado]);

    // Verificación periódica mientras estamos en el paso 4
    useEffect(() => {
      let intervalId;
      
      if (tutorialStep === 4 && brigadista?.cedula) {
        // Verificar puntos inmediatamente
        verificarPuntosDirectamente();
        
        // Y luego cada 3 segundos mientras estemos en el paso 4
        intervalId = setInterval(() => {
          verificarPuntosDirectamente();
        }, 3000);
      }
      
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [tutorialStep, brigadista]);

    // Verificar cantidad de puntos para avanzar en el tutorial
    useEffect(() => {
      if (tutorialStep === 4) {
        console.log("Verificando puntos para tutorial:");
        console.log("- Puntos en estado local:", puntosReferencia.length);
        console.log("- Puntos verificados en BD:", cantidadPuntos);
        
        // Usar la cantidad verificada de la base de datos
        if (cantidadPuntos >= 4) {
          console.log("¡Suficientes puntos verificados en BD! Avanzando al paso 5");
          setTutorialStep(5);
        }
      }
    }, [puntosReferencia, cantidadPuntos, tutorialStep]);

    // Cargar datos guardados del almacenamiento local al iniciar
    useEffect(() => {
      const cargarDatosGuardados = async () => {
        try {
          if (brigadista?.idConglomerado) {
            const datosGuardados = await AsyncStorage.getItem(
              `subparcelas_datos_${brigadista.idConglomerado}`
            );
            
            if (datosGuardados) {
              setSubparcelasCaracteristicas(JSON.parse(datosGuardados));
            }
          }
        } catch (error) {
          console.error("Error al cargar datos guardados:", error);
        }
      };
      
      cargarDatosGuardados();
    }, [brigadista]);

    const handleCloseTutorial = () => {
      setShowTutorial(false);
      
      // Si estamos en el paso final (6) y hay subparcelas, mostrar el modal para la primera subparcela
      if (tutorialStep === 6 && subparcelas.length > 0) {
        showNextSubparcelaModal();
      }
      
    };

    const handleVerificarPuntos = () => {
      verificarPuntosDirectamente();
    };

    // Función para mostrar el modal de características para la siguiente subparcela
    const showNextSubparcelaModal = () => {
      if (currentSubparcelaIndex < subparcelas.length) {
        // Configurar el punto seleccionado con las coordenadas de la subparcela actual
        const subparcela = subparcelas[currentSubparcelaIndex];
        setSelectedPunto({
          latitude: subparcela.latitud,
          longitude: subparcela.longitud
        });
        
        // Limpiar el error de medición para la nueva subparcela
        setErrorMedicion("");
        
        // Mostrar el modal
        setShowCaracteristicasModal(true);
      }
    };

    const handleCloseCaracteristicasModal = () => {
      setShowCaracteristicasModal(false);
    };

    const handleGuardarCaracteristicas = async (datosSubparcela) => {
      // Obtener la subparcela actual
      const subparcela = subparcelas[currentSubparcelaIndex];
      
      // Guardar las características de la subparcela actual
      const nuevosSubparcelasCaracteristicas = {
        ...subparcelasCaracteristicas,
        [subparcela.id]: {
          ...datosSubparcela,
          id: subparcela.id,
          nombre: subparcela.nombre_subparcela,
          latitud: subparcela.latitud,
          longitud: subparcela.longitud
        }
      };
      
      setSubparcelasCaracteristicas(nuevosSubparcelasCaracteristicas);
      
      // Guardar en almacenamiento local
      try {
        if (brigadista?.idConglomerado) {
          await AsyncStorage.setItem(
            `subparcelas_datos_${brigadista.idConglomerado}`,
            JSON.stringify(nuevosSubparcelasCaracteristicas)
          );
        }
      } catch (error) {
        console.error("Error al guardar datos:", error);
        Alert.alert(
          "Error",
          "No se pudieron guardar los datos. Por favor intente nuevamente."
        );
      }
      
      // Cerrar el modal actual
      handleCloseCaracteristicasModal();
      
      // Incrementar el índice para la siguiente subparcela
      const nextIndex = currentSubparcelaIndex + 1;
      setCurrentSubparcelaIndex(nextIndex);
      
      // Si hay más subparcelas, mostrar el modal para la siguiente
      if (nextIndex < subparcelas.length) {
        setTimeout(() => {
          showNextSubparcelaModal();
        }, 500); // Pequeño retraso para mejor experiencia de usuario
      } else {
        // Todas las subparcelas han sido procesadas
        console.log("Todas las subparcelas han sido procesadas:", nuevosSubparcelasCaracteristicas);
        
        // Intentar sincronizar con la base de datos
        try {
          setSincronizando(true);
          await sincronizar(nuevosSubparcelasCaracteristicas);
          setSincronizando(false);
          completarTutorial();  
          
          Alert.alert(
            "¡Felicidades!",
            "Has completado correctamente los pasos iniciales y los datos se han sincronizado con éxito. A partir de ahora, los colaboradores pueden comenzar con el registro de árboles.",
            [{ text: "OK" }]
          );
        } catch (error) {
          setSincronizando(false);
          console.error("Error al sincronizar con la base de datos:", error);
          
          Alert.alert(
            "¡Felicidades!",
            "Has completado correctamente los pasos iniciales. Los datos se han guardado localmente pero no se pudieron sincronizar con la base de datos. Puedes intentar sincronizarlos más tarde desde la pantalla de visualización.",
            [{ text: "OK" }]
          );
        }
      }
    };

    // Obtener la subparcela actual si existe
    const currentSubparcela = subparcelas[currentSubparcelaIndex] || null;

    return (
      <>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: "#1E5A26",
              paddingTop: 10,
              paddingBottom: 10,
              height: 70,
              borderTopWidth: 0,
            },
            tabBarButton: (props) => {
              const isDisabled = !localTutorialCompletado && route.name !== "Map";
              return (
                <View style={{ flex: 1, opacity: isDisabled ? 0.5 : 1 }}>
                  <TouchableWithoutFeedback
                    onPress={isDisabled ? null : props.onPress}
                    disabled={isDisabled}
                  >
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                      {props.children}
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              );
            },
            tabBarIcon: ({ focused }) => {
              let iconSource;
              if (route.name === "Map") {
                iconSource = focused
                  ? require("../assets/IconoMapaActivo.png")
                  : require("../assets/IconoMapa.png");
              } else if (route.name === "Add") {
                iconSource = focused
                  ? require("../assets/IconoAddActivo.png")
                  : require("../assets/IconoAdd.png");
              } else if (route.name === "View") {
                iconSource = focused
                  ? require("../assets/IconoVerActivo.png")
                  : require("../assets/IconoVer.png");
              }

              return (
                <Image
                  source={iconSource}
                  style={{ width: 35, height: 35 }}
                  resizeMode="contain"
                />
              );
            },
          })}
        >
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen name="Add" component={AddScreen} />
          <Tab.Screen name="View" component={ViewScreen} />
        </Tab.Navigator>

        {showTutorial && (
          <TutorialOverlay
            step={tutorialStep}
            setStep={setTutorialStep}
            onClose={handleCloseTutorial}
            onVerificarPuntos={handleVerificarPuntos}
            cantidadPuntos={cantidadPuntos}
          />
        )}

        {currentSubparcela && (
          <CaracteristicasModal 
            visible={showCaracteristicasModal} 
            onClose={handleCloseCaracteristicasModal}
            onGuardar={handleGuardarCaracteristicas}
            puntoId={currentSubparcela.id}
            nombreSubparcela={currentSubparcela.nombre_subparcela}
            selectedPunto={selectedPunto}
            errorMedicion={errorMedicion}
            setErrorMedicion={setErrorMedicion}
          />
        )}
      </>
    );
  }