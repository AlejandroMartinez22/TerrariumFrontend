import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons'; //Importamos Iconos de Expo.

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ImageBackground
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
  }, []);

  return (

    <ImageBackground
    source={require('../assets/FondoWelcome.png')}
    style={styles.background}
    resizeMode="cover"
    imageStyle={{ opacity: 0.3}}>

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
                style={[styles.icon, styles.secondIcon]}
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

      <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('Home')}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.continueButtonText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={20} color="white" style={styles.iconoFlecha} />
        </View>
      </TouchableOpacity>

    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20
  },

  title: {
    fontSize: 28,
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
    marginVertical: 10
  },

  icon: {
    width: 130,
    height: 130,
    marginBottom: 1,
    resizeMode: 'contain'
  },

  infoText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  secondIcon: {
    marginBottom: 10
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
    backgroundColor: '#186A3B',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',      //  Alínea hijos en fila
    alignItems: 'center',      //  Centra verticalmente
    gap: 8,      
    elevation: 4,
  },
  
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  background: {
    flex: 1,
    width: '100%',
    height: '100%', 
  },

  iconoFlecha: {
    marginLeft: 8
  }
});