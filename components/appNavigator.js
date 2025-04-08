import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Image } from "react-native";
import NavigationTabs from "./navigationTabs"; 
import ProfileScreen from "./profileScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator>
        <Stack.Screen
            name="Main"
            component={NavigationTabs}
            options={({ navigation }) => ({
                
            headerTitle: () => (<Image source={require("../assets/LogoTerrarium.png")} style={{resizeMode: "contain", width: 110, height:30, margin:0, padding: 0}}/>),
            headerStyle: {
                backgroundColor: "#1E5A26",
            },
            headerTintColor: "#fff",
            
            headerRight: () => (
                <TouchableOpacity
                onPress={() => navigation.navigate("Profile")}
                style={{ marginRight: 15 }}
                >
                <Image
                    source={require("../assets/IconoPerfil.png")}
                    style={{ width: 32, height: 32 }}
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
