// Importaciones necesarias para React Native
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// Asumimos que utilizas React Navigation para la navegación entre pantallas
// Si usas otra biblioteca de navegación, deberás ajustar el código

// Componente que representa la pantalla de registro de árboles
const registrarMuestraArborea = ({ navigation }) => {
  // Función para navegar a otro componente con el tipo de subparcela seleccionado
  const handleOptionSelect = (option) => {
    // Aquí navegamos a la pantalla de detalles de subparcela y pasamos la opción seleccionada
    navigation.navigate('viewScreen', { subparcelaType: option });
    
    // Si no estás usando React Navigation o quieres implementar otra lógica,
    // puedes usar un callback o un estado global (Redux, Context API) para manejar esto
  };

  // Renderizado de los botones de opciones
  const renderButton = (text) => {
    return (
      <TouchableOpacity 
        style={styles.optionButton}
        onPress={() => handleOptionSelect(text)}
      >
        <Text style={styles.buttonText}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrar nueva</Text>
      <Text style={styles.titulo}>muestra árborea</Text>
      
      {/* Contenedor flexbox para la imagen y botones lado a lado */}
      <View style={styles.contentContainer}>
        {/* Espacio para la imagen del árbol que se añadirá después */}
        <View style={styles.imagePlaceholder}></View>
        
        {/* Contenedor para los botones de opciones */}
        <View style={styles.optionsContainer}>
          {renderButton('SPF-1')}
          {renderButton('SPF-2')}
          {renderButton('SPF-3')}
          {renderButton('SPF-4')}
          {renderButton('SPF-5')}
        </View>
      </View>
      
    </View>
  );
};

export default registrarMuestraArborea;

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
    top: 20,
    color: "#000",
    textAlign: "center",
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 150,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    // Puedes añadir un borde o un color de fondo para visualizar el espacio
    // borderWidth: 1,
    // borderColor: '#ccc',
  },
  optionsContainer: {
    flex: 1,
    marginLeft: 20,
  },
  optionButton: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'white',
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  }
});