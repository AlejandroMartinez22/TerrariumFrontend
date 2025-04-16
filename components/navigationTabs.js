import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View, TouchableWithoutFeedback } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import MapScreen from "./mapScreen";
import AddScreen from "./addScreen";
import ViewScreen from "./viewScreen";

import TutorialOverlay from "./tutorialOverlay";
import CaracteristicasModal from "./CaracteristicasModal";
import { useBrigadista } from "../context/BrigadistaContext";
import { useReferencia } from "../context/ReferenciaContext";

const Tab = createBottomTabNavigator();

export default function NavigationTabs() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(1);
  const [showCaracteristicasModal, setShowCaracteristicasModal] = useState(false);
  
  // Inicializar estados para CaracteristicasModal
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedNumber, setSelectedNumber] = useState("");
  const [errorMedicion, setErrorMedicion] = useState("");
  const [selectedPunto, setSelectedPunto] = useState({ latitude: 0, longitude: 0 });
  
  const { brigadista, localTutorialCompletado, completarTutorial } = useBrigadista();
  const { puntosReferencia } = useReferencia();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (
      isFocused &&
      brigadista &&
      !localTutorialCompletado &&
      brigadista.rol === "Jefe de brigada" &&
      !timerStarted
    ) {
      setTimerStarted(true);
      setTimeout(() => {
        setShowTutorial(true);
      }, 6000);
    }
  }, [isFocused, brigadista, localTutorialCompletado]);

  useEffect(() => {
    if (tutorialStep === 4 && puntosReferencia.length >= 4) {
      setTutorialStep(5);
    }
  }, [puntosReferencia, tutorialStep]);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    
    // Si estamos en el paso final (5), mostrar el modal de características
    if (tutorialStep === 5) {
      setShowCaracteristicasModal(true);
    }
    
    completarTutorial();
  };

  const handleCloseCaracteristicasModal = () => {
    setShowCaracteristicasModal(false);
  };

  const handleGuardarCaracteristicas = () => {
    // Lógica para guardar los datos
    console.log("Guardando características:", {
      selectedOption,
      selectedNumber,
      errorMedicion
    });
    
    // Cerrar el modal
    handleCloseCaracteristicasModal();
  };

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
        />
      )}

      <CaracteristicasModal 
        visible={showCaracteristicasModal} 
        onClose={handleCloseCaracteristicasModal}
        onGuardar={handleGuardarCaracteristicas}
        puntoId="SP-01" // O el ID que corresponda
        selectedPunto={selectedPunto}
        errorMedicion={errorMedicion}
        setErrorMedicion={setErrorMedicion}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        selectedNumber={selectedNumber}
        setSelectedNumber={setSelectedNumber}
      />
    </>
  );
}