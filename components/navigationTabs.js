    import React, { useEffect, useState } from "react";
    import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
    import { Image, View, TouchableWithoutFeedback } from "react-native";
    import { useIsFocused } from "@react-navigation/native";

    import MapScreen from "./mapScreen";
    import AddScreen from "./addScreen";
    import ViewScreen from "./viewScreen";

    import TutorialOverlay from "./tutorialOverlay"; // Asegúrate de que esta ruta esté bien
    import { useBrigadista } from "../context/BrigadistaContext";

    const Tab = createBottomTabNavigator();

    export default function NavigationTabs() {
    const [showTutorial, setShowTutorial] = useState(false);
    const [timerStarted, setTimerStarted] = useState(false);
    const { brigadista } = useBrigadista();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (
        isFocused &&
        brigadista &&
        brigadista.tutorial_completado === false &&
        !timerStarted
        ) {
        setTimerStarted(true);
        setTimeout(() => {
            setShowTutorial(true);
        }, 10000); // 10 segundos
        }
    }, [isFocused, brigadista]);

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
            tabBarButton: (props) => (
                <View style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={props.onPress}>
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
            ),
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
                    width: 28,
                    height: 28,
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

        {/* Mostrar el tutorial */}
        {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}
        </>
    );
    }
