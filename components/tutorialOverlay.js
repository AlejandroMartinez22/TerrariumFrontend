import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const TutorialOverlay = ({ step, setStep, onClose }) => {
  const steps = [
    'Como Jefe de Brigada, tu primer paso es dirigir a tu equipo hacia el conglomerado asignado.',
    'Para facilitar el recorrido, deberás marcar cuatro puntos de referencia en el camino que sirvan como guía durante el desplazamiento.',
    'Para añadir un punto de referencia, mantén pulsado en cualquier parte del mapa; se abrirá una ventana donde deberás ingresar la información solicitada.',
    'Añade los cuatro puntos de referencia en el mapa',
    '¡Bien hecho! Has registrado con éxito los cuatro puntos de referencia. El siguiente paso es identificar las características de cada una de las subparcelas dentro del conglomerado.'
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      onClose(); // Finalizar tutorial
    }
  };

  const isNextDisabled = step === 4; // En el paso 4, no se puede avanzar manualmente

  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <Text style={styles.text}>{steps[step - 1]}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.button, isNextDisabled && { opacity: 0.5 }]}
            disabled={isNextDisabled}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.buttonText}>
                {step < steps.length ? 'Siguiente' : 'Cerrar'}
              </Text>
              <Ionicons name="arrow-forward" size={14} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 100,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    pointerEvents: 'box-none',
  },
  popup: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    pointerEvents: 'auto',
  },
  text: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'left',
  },
  waitingText: {
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: '#1287A6',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 0,
  },
  buttonText: {
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    marginRight: 5,
  },
});

export default TutorialOverlay;
