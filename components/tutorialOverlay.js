    import React, { useState } from 'react';
    import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
    import { Ionicons } from "@expo/vector-icons";

    const TutorialOverlay = ({ onClose }) => {
    const [step, setStep] = useState(1);

    const steps = [
        'Como Jefe de Brigada, tu primer paso es dirigir a tu equipo hacia el conglomerado asignado. ',
        'Para facilitar el recorrido, deberás marcar cuatro puntos de referencia en el camino que sirvan como guía durante el desplazamiento.',
        'Para añadir un punto de referencia, mantén pulsado en cualquier parte del mapa; se abrirá una ventana donde deberás ingresar la información solicitada.',
        'Añade los cuatro puntos de referencia en el mapa',
        '¡Bien hecho! Has registrado con éxito los cuatro puntos de referencia. El siguiente paso es identificar las características de cada una de las subparcelas dentro del conglomerado.'
    ];

    const handleNext = () => {
        if (step < steps.length) {
        setStep(step + 1);
        } else {
        // Al finalizar el tutorial, llamamos a onClose
        // que a su vez llamará a completarTutorial
        onClose();
        }
    };

    return (
        <View style={styles.overlay}>
        <View style={styles.popup}>
            <Text style={styles.text}>{steps[step - 1]}</Text>
            <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleNext} style={styles.button}>
                <View style={{flexDirection: "row", alignItems: "center"}}> 
                <Text style={styles.buttonText}>
                    {step < steps.length ? 'Siguiente' : 'Cerrar'}
                </Text>
                <Ionicons name="arrow-forward" size={14} color="white"/>
                </View>
            </TouchableOpacity>
            </View>
        </View>
        </View>
    );
    };

    const { width, height } = Dimensions.get('window');

    const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        bottom: 100,
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        pointerEvents: 'box-none', // Deja pasar interacción al fondo excepto al popup
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
    },

    text: {
        fontSize: 14,
        marginBottom: 12,
        textAlign: 'left', // Alinea el texto a la izquierda
    },

    buttonContainer: {
        alignItems: 'flex-end', // Alinea el botón a la derecha
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
