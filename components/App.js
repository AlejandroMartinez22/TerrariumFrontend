// Importaciones necesarias para React y React Navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importación de proveedores de contexto para manejar el estado global
import { BrigadistaProvider } from '../context/BrigadistaContext';
import { SubparcelaProvider } from '../context/SubparcelaContext';
import { ReferenciaProvider } from '../context/ReferenciaContext';
import { ArbolesProvider } from '../context/ArbolesContext'; 

// Importación de pantallas de la aplicación
import LoginScreen from './LoginScreen';
import ProfileScreen from './profileScreen';
import AppNavigator from './appNavigator';

// Configuración del stack navigator para la navegación entre pantallas
const Stack = createStackNavigator();

/* 
Componente principal de la aplicación 
Aquí se encapsulan los proveedores de contexto y la navegación entre pantallas.
*/
export default function App() {
  return (
    <BrigadistaProvider>
      <ArbolesProvider>
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
      </ArbolesProvider>
    </BrigadistaProvider>
  );
}