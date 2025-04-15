import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View, TouchableWithoutFeedback } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import MapScreen from "./mapScreen";
import AddScreen from "./addScreen";
import ViewScreen from "./viewScreen";

import TutorialOverlay from "./tutorialOverlay";
import { useBrigadista } from "../context/BrigadistaContext";
import { useReferencia } from "../context/ReferenciaContext";

const Tab = createBottomTabNavigator();

export default function NavigationTabs() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(1);
  const { brigadista, localTutorialCompletado, completarTutorial } = useBrigadista();
  const { puntosReferencia } = useReferencia(); // para ver si ya agregaron los puntos
  const isFocused = useIsFocused();

  // Mostrar tutorial si aplica
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
      }, 6000); // mostrar luego de 6 seg
    }
  }, [isFocused, brigadista, localTutorialCompletado]);

  // Avanzar automáticamente al paso 5 si hay 4 puntos agregados
  useEffect(() => {
    if (tutorialStep === 4 && puntosReferencia.length >= 4) {
      setTutorialStep(5);
    }
  }, [puntosReferencia, tutorialStep]);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    completarTutorial(); // marcar como completado
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
    </>
  );
}
