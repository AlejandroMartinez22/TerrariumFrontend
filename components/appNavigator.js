// Importaciones necesarias para React y React Native
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";

// Importación de componentes y contexto
import NavigationTabs from "./navigationTabs";
import ProfileScreen from "./profileScreen";
import registrarMuestra from "./registrarMuestra";
import SeleccionarSubparcelaArbol from "./SeleccionarSubparcelaArbol";
import { useBrigadista } from "../context/BrigadistaContext";
import SelectArbolMuestra from "./SelectArbolMuestra";
// Creación del stack navigator para manejar la navegación entre pantallas
const Stack = createStackNavigator();

/* 
Componente principal de la aplicación 
Encapsula la navegación entre pestañas y el acceso al contexto del brigadista.
*/
export default function AppNavigator() {
  const { brigadista } = useBrigadista();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={NavigationTabs}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Image
              source={require("../assets/LogoTerrarium.png")}
              style={{ resizeMode: "contain", width: 100, height: 28 }}
            />
          ),
          headerStyle: { backgroundColor: "#1E5A26" },
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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="registrarMuestra"
        component={registrarMuestra}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Image
              source={require("../assets/LogoTerrarium.png")}
              style={{ resizeMode: "contain", width: 100, height: 28 }}
            />
          ),
          headerStyle: { backgroundColor: "#1E5A26" },
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
        name="registrarArbol"
        component={SeleccionarSubparcelaArbol}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Image
              source={require("../assets/LogoTerrarium.png")}
              style={{ resizeMode: "contain", width: 100, height: 28 }}
            />
          ),
          headerStyle: { backgroundColor: "#1E5A26" },
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
        name="viewScreen"
        component={SelectArbolMuestra}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Image
              source={require("../assets/LogoTerrarium.png")}
              style={{ resizeMode: "contain", width: 100, height: 28 }}
            />
          ),
          headerStyle: { backgroundColor: "#1E5A26" },
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
    </Stack.Navigator>
  );
}

// Estilos para el diseño del encabezado y botón de sesión
const styles = StyleSheet.create({
  BotonSesion: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  NombreBrigadista: {
    color: "white",
    fontWeight: "bold",
    marginRight: 6,
    fontSize: 14.5,
  },
});
