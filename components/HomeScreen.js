import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}> <Image style={styles.image} source={require("../assets/IconoAnadir.png")} /> </TouchableOpacity>
      <TouchableOpacity style={styles.button}> <Image style={styles.image} source={require("../assets/IconoMapa.png")} /> </TouchableOpacity>
      <TouchableOpacity style={styles.button}> <Image style={styles.image} source={require("../assets/IconoReporte.png")} /> </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: "#E9E9E9",
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 15,
    marginVertical: 25, // separación entre los botones
    backgroundColor: '#fff',
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain'
  }
});