import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View, TouchableWithoutFeedback } from "react-native";

import MapScreen from "./mapScreen";
import AddScreen from "./addScreen";

const Tab = createBottomTabNavigator();

export default function NavigationTabs() {
return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
        backgroundColor: "#1E5A26",
        paddingTop: 10,
        paddingBottom: 10,
        borderTopWidth: 4,
        height: 70,
        },

        tabBarButton: (props) => (
            <View style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={props.onPress}>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
    </Tab.Navigator>
);
}
