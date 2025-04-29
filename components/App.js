// react es para la interfaz de usuario
import React from 'react';
// React Navigation para la navegación entre pantallas
import { NavigationContainer } from '@react-navigation/native';
// Componente de navegación de pila para crear una pila de pantallas
import { createStackNavigator } from '@react-navigation/stack';
// Componente para manejar el área segura de la pantalla, útil para evitar problemas con el notch y la barra de estado
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Proveedores de contexto para manejar el estado global de la aplicación
import { BrigadistaProvider } from '../context/BrigadistaContext';
import { SubparcelaProvider } from '../context/SubparcelaContext'; 
import { ReferenciaProvider } from '../context/ReferenciaContext'; 

// Importación de las pantallas de la aplicación
import LoginScreen from './LoginScreen';
import ProfileScreen from './profileScreen';
import AppNavigator from './appNavigator';

// Crear un stack navigator para manejar la navegación entre pantallas
const Stack = createStackNavigator(); 

/*
Componente principal de la aplicación
Esta funcion app, podriamos llamarla la central de la aplicacion, ya que es la que contiene el stack navigator 
y los providers que permiten manejar el estado global de la aplicacion, ademas de la navegacion entre pantallas
*/
export default function App() {
  return (
    
    <BrigadistaProvider>
      <SubparcelaProvider> 
        <ReferenciaProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="MainScreen" component={AppNavigator} />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </ReferenciaProvider>
      </SubparcelaProvider>
    </BrigadistaProvider>
  );
}
