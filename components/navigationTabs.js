    import React, { useEffect, useState } from "react";
    import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
    import { Image, View, TouchableWithoutFeedback } from "react-native";
    import { useIsFocused } from "@react-navigation/native";

    import MapScreen from "./mapScreen";
    import AddScreen from "./addScreen";
    import ViewScreen from "./viewScreen";

    import TutorialOverlay from "./tutorialOverlay";
    import { useBrigadista } from "../context/BrigadistaContext";

    const Tab = createBottomTabNavigator();

    export default function NavigationTabs() {
    const [showTutorial, setShowTutorial] = useState(false);
    const [timerStarted, setTimerStarted] = useState(false);
    const { brigadista, localTutorialCompletado, completarTutorial } = useBrigadista();
    const isFocused = useIsFocused();

    useEffect(() => {
        // Verificamos si es jefe de brigada para mostrar el tutorial
        if (
        isFocused &&
        brigadista &&
        !localTutorialCompletado &&
        brigadista.rol === "Jefe de brigada" && // Solo mostrar tutorial a jefes de brigada
        !timerStarted
        ) {
        setTimerStarted(true);
        setTimeout(() => {
            setShowTutorial(true);
        }, 6000); // 6 segundos
        }
    }, [isFocused, brigadista, localTutorialCompletado]);

    // Función para cerrar el tutorial y marcarlo como completado
    const handleCloseTutorial = () => {
        setShowTutorial(false);
        completarTutorial();
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
                // Los botones están deshabilitados para todos los usuarios si no han completado el tutorial
                const isDisabled = !localTutorialCompletado && route.name !== "Map";
                
                return (
                <View style={{ flex: 1, opacity: isDisabled ? 0.5 : 1 }}>
                    <TouchableWithoutFeedback 
                    onPress={isDisabled ? null : props.onPress} 
                    disabled={isDisabled}
                    >
                    <View
                        style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        }}
                    >
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
                    style={{
                    width: 35,
                    height: 35,
                    }}
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

        {/* Mostrar el tutorial solo si es jefe de brigada */}
        {showTutorial && <TutorialOverlay onClose={handleCloseTutorial} />}
        </>
    );
    }