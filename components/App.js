// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BrigadistaProvider } from '../context/BrigadistaContext';
import { SubparcelaProvider } from '../context/SubparcelaContext'; 
import { ReferenciaProvider } from '../context/ReferenciaContext'; 

// Pantallas
import LoginScreen from './LoginScreen';
import ProfileScreen from './profileScreen';
import AppNavigator from './appNavigator';

const Stack = createStackNavigator(); 

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
