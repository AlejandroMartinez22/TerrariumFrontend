import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importar pantallas
import LoginScreen from './LoginScreen';
import ProfileScreen from './profileScreen';
import AppNavigator from './appNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
<SafeAreaProvider>
      <NavigationContainer>

        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Main" component={AppNavigator} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
