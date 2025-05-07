// Importaciones necesarias para React Native
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// Componente que representa la pantalla de registro
const VentanaRegistrar = ({ navigation }) => {
  // Función para manejar la navegación cuando se presiona un botón
const handleButtonPress = (option) => {
  if (option === 'tree') {
    navigation.navigate('FormScreen', { type: option });
  } else if (option === 'sample') {
    // Navegar directamente al componente registrarMuestra
    navigation.navigate('registrarMuestra');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrar</Text>
      
      {/* Contenedor para los botones centrados */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleButtonPress('tree')}
        >
          <Text style={styles.buttonText}>Nuevo árbol</Text>
        </TouchableOpacity>
            
        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleButtonPress('sample')}
        >
          <Text style={styles.buttonText}>Nueva muestra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VentanaRegistrar;

// Estilos para la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 36,
    marginTop: 30,
    marginBottom: 60,
    color: "#000",
    textAlign: "center",
  },
  buttonsContainer: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
  }
});