import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const TutorialOverlay = ({ step, setStep, onClose, onVerificarPuntos, cantidadPuntos }) => {
  const steps = [
    'Como Jefe de Brigada, tu primer paso es dirigir a tu equipo hacia el conglomerado asignado.',
    'Para facilitar el recorrido, deberás marcar cuatro puntos de referencia en el camino que sirvan como guía durante el desplazamiento.',
    'Para añadir un punto de referencia, mantén pulsado en cualquier parte del mapa; se abrirá una ventana donde deberás ingresar la información solicitada.',
    'Añade los cuatro puntos de referencia en el mapa',
    '¡Bien hecho! Has registrado con éxito los cuatro puntos de referencia. El siguiente paso es identificar las características de cada una de las subparcelas dentro del conglomerado.',
    'Ingresa las características de las cinco subparcelas en las ventanas emergentes'
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      onClose(); // Finalizar tutorial
    }
  };

  const handleVerificarPuntos = () => {
    if (onVerificarPuntos) {
      onVerificarPuntos();
    }
  };

  const isNextDisabled = step === 4 && cantidadPuntos < 4; // En el paso 4, solo avanzar si hay 4+ puntos
  
  // Renderizado especial para el paso 4 - verificación de puntos
  const renderStep4Content = () => {
    return (
      <>
        <Text style={styles.text}>{steps[step - 1]}</Text>
        
        <View style={styles.pointsContainer}>
        <Text style={styles.waitingText}>
          {cantidadPuntos >= 4 
            ? '¡Puntos verificados correctamente!' 
            : `Puntos de referencia verificados: ${cantidadPuntos || 0}/4`}
        </Text>
        </View>
      </>
    );
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        {step === 4 ? renderStep4Content() : <Text style={styles.text}>{steps[step - 1]}</Text>}

        <View style={styles.buttonsRow}>
          {/* Espacio vacío a la izquierda cuando no hay botón de verificar, que mantiene la alineación */}
          {step !== 4 || cantidadPuntos >= 4 ? <View style={styles.spacer} /> : null}
          
          {/* Botón de verificar puntos */}
          {step === 4 && cantidadPuntos < 4 && (
            <TouchableOpacity 
              style={styles.verifyButton}
              onPress={handleVerificarPuntos}
            >
              <Text style={styles.verifyButtonText}>Verificar puntos</Text>
            </TouchableOpacity>
          )}
          
          {/* Botón de siguiente/cerrar siempre a la derecha */}
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
  pointsContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  waitingText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  spacer: {
    flex: 1, // Esto empuja el botón siguiente/cerrar hacia la derecha
  },
  verifyButton: {
    backgroundColor: '#1287A6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
  button: {
    backgroundColor: '#1287A6',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
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