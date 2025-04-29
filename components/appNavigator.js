// React para la interfaz de usuario
import React from "react";
// React Navigation para la navegación entre pantallas
import { createStackNavigator } from "@react-navigation/stack";
// Elementos de react native necesarios para realizar la interfaz
import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";
//importacion para la navegacion de pestañas
import NavigationTabs from "./navigationTabs"; 
import ProfileScreen from "./profileScreen";
//importacion del contexto del brigadista para acceder a su informacion
import { useBrigadista } from "../context/BrigadistaContext";

//Instancia del navegador
const Stack = createStackNavigator();

// Componente principal de la aplicación
export default function AppNavigator() {
    //Constante donde se almacenará la información del brigadista
    const { brigadista } = useBrigadista();

    //
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