import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { getInfoBrigada } from '../supabase/getInfoBrigadista';
import { handleSignOut } from '../backend/signOut';

export default function WelcomeScreen({ navigation }) {
  const [brigadaInfo, setBrigadaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrigadaInfo = async () => {
      try {
        setLoading(true);
        const info = await getInfoBrigada();
        setBrigadaInfo(info);
      } catch (err) {
        console.error("Error al obtener información de brigada:", err);
        setError("No se pudo cargar la información");
      } finally {
        setLoading(false);
      }
    };

    fetchBrigadaInfo();

    const timer = setTimeout(() => {
      navigation.replace('Home'); // replace evita que el usuario vuelva con el botón "atrás"
    }, 5000);



  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {brigadaInfo ? `¡Bienvenido ${brigadaInfo.nombre}!` : '¡Bienvenido a Terrarium!'}
        </Text>
      </View>
    
      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator size="large" color="#4F7029" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : brigadaInfo ? (
          <>
            <View style={styles.infoBlock}>
              <Image
                source={require('../assets/IconoBrigada.png')}
                style={styles.icon}
              />
              <Text style={styles.infoText}>
                Brigada asignada: #{brigadaInfo.brigada}
              </Text>
            </View>

            <View style={styles.infoBlock}>
              <Image
                source={require('../assets/IconoRol.png')}
                style={styles.icon}
              />
              <Text style={styles.infoText}>
                Rol: {brigadaInfo.rol}
              </Text>
            </View>

            <View style={styles.infoBlock}>
              <Image
                source={require('../assets/IconoConglomerado.png')}
                style={styles.icon}
              />
              <Text style={styles.infoText}>
                Conglomerado asignado: {brigadaInfo.idConglomerado || 'No asignado'}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.infoText}>No se encontró información del brigadista</Text>
        )}
      </View> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    alignItems: 'center',
    marginTop: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  body: {
    marginTop:5,
    paddingTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoBlock: {
    alignItems: 'center',
    marginVertical: 20
  },

  icon: {
    width: 150,
    height: 150,
    marginBottom: 1,
    resizeMode: 'contain'
  },

  infoText: {
    fontSize: 18,
    textAlign: 'center',
  },
  
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },

  continueButton: {
    position: 'absolute',
    bottom: 40,               // margen más pequeño desde abajo
    alignSelf: 'center',     // centra horizontalmente
    backgroundColor: '#547A2E',
    padding: 12,
    borderRadius: 8,
  },
  
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});