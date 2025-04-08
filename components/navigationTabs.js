import React,{useState} from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View, TouchableWithoutFeedback} from "react-native";

import MapScreen from "./mapScreen";
import AddScreen from "./addScreen";
import ViewScreen from "./viewScreen";

const Tab = createBottomTabNavigator();


export default function NavigationTabs() {

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
    </>
);
}
