import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import NavigationTabs from "./navigationTabs"; 
import ProfileScreen from "./profileScreen";
import { useBrigadista } from "../context/BrigadistaContext";

const Stack = createStackNavigator();

export default function AppNavigator() {

    const { brigadista } = useBrigadista(); //Desestructuramos el objeto del contexto para usar únicamente el objeto que contiene el nombre del brigadista

    return (
        <Stack.Navigator>
        <Stack.Screen
            name="Main"
            component={NavigationTabs}
            options={({ navigation }) => ({
                
            headerTitle: () => (<Image source={require("../assets/LogoTerrarium.png")} style={{resizeMode: "contain", width: 100, height:28, margin:0, padding: 0}}/>),
            headerStyle: {
                backgroundColor: "#1E5A26",
            },
            headerTintColor: "#fff",
            
            headerRight: () => (
                <TouchableOpacity
                onPress={() => navigation.navigate("Profile")}
                style={styles.BotonSesion}
                > 
                    <Text style={styles.NombreBrigadista}>{brigadista?.nombre}</Text>  
                <Image
                    source={require("../assets/IconoPerfil.png")}
                    style={{ width: 29, height: 29 }}
                />
                </TouchableOpacity>
            ),
            })}
        />
        <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: false}}
        />
        </Stack.Navigator>
    );
}


const styles = StyleSheet.create ({
    BotonSesion:{
        flexDirection: "row",
        alignItems: "center",
        marginRight: 15, 
    },
    NombreBrigadista:{
        color: "white",
        fontWeight: "bold",
        marginRight: 6,
        fontSize: 14.5


    }
})