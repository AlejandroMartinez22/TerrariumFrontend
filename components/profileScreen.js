/* YA ESTÁ LO RELACIONADO CON ESTE COMPONENTE */

import { Ionicons } from "@expo/vector-icons"; //Importamos Iconos de Expo.
// importar React y otros componentes necesarios de React Native
import {
View,
Text,
StyleSheet,
ActivityIndicator,
TouchableOpacity,
Image,
ImageBackground,
} from "react-native";
// importar el logo de Terrarium
import { handleSignOut } from "../hooks/signOut";
// importar el hook useLogin
import { useBrigadista } from "../context/BrigadistaContext";

export default function ProfileScreen({ navigation  }) {
// usar el hook useLogin para manejar el inicio de sesión
    const { brigadista, loading, error, setBrigadista, setError } = useBrigadista();

return (
    <ImageBackground
    source={require("../assets/FondoProfile.png")}
    style={styles.background}
    resizeMode="cover"
    imageStyle={{ opacity: 0.3 }}
    >
    <View style={styles.container}>
        <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
        >
            <Ionicons name="close" size={35} color="#757575" />
    </TouchableOpacity>

        <View style={styles.header}>
        <Text style={styles.title}>
            {brigadista
            ? `¡Sesión iniciada como ${brigadista?.nombre}!`
            : "¡Bienvenido a Terrarium!"}
        </Text>
        </View>

        <View style={styles.body}>
        {loading ? (
            <ActivityIndicator size="large" color="#4F7029" />
        ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
        ) : brigadista ? (
            <>
            <View style={styles.infoBlock}>
                <Image
                source={require("../assets/IconoBrigada.png")}
                style={styles.icon}
                />
                <Text style={styles.infoText}>
                Brigada asignada: #{brigadista?.brigada}
                </Text>
            </View>

            <View style={styles.infoBlock}>
                <Image
                source={require("../assets/IconoRol.png")}
                style={[styles.icon, styles.secondIcon]}
                />
                <Text style={styles.infoText}>Rol: {brigadista?.rol}</Text>
            </View>

            <View style={styles.infoBlock}>
                <Image
                source={require("../assets/IconoConglomerado.png")}
                style={styles.icon}
                />
                <Text style={styles.infoText}>
                Conglomerado asignado:{" "}
                {brigadista?.idConglomerado || "No asignado"}
                </Text>
            </View>
            </>
        ) : (
            <Text style={styles.infoText}>
            No se encontró información del brigadista
            </Text>
        )}
        </View>

        <TouchableOpacity
        style={styles.signOutButton}
        onPress={() => handleSignOut(navigation, setBrigadista, setError)} //Linea cambiada
        >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.signOutButtonText}>Cerrar sesión</Text>
            <Ionicons
            name="log-out-outline"
            size={20}
            color="white"
            style={styles.iconoSalir}
            />
        </View>
        </TouchableOpacity>
    </View>
    </ImageBackground>
);
}

// definir los estilos para el componente ProfileScreen
const styles = StyleSheet.create({
container: {
    flex: 1,
    padding:20,
},

closeButton: {
    position: 'absolute',
    top: 10,
    right: 8,
    zIndex: 10,
    padding: 5,
},

header: {
    alignItems: "center",
    marginTop: 35,
    marginBottom: 5,
},

title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 30,
    marginRight: 30,
},

body: {
    marginTop: 5,
    paddingTop: 0,
    alignItems: "center",
    justifyContent: "center",
},

infoBlock: {
    alignItems: "center",
    marginVertical: 18,
},

icon: {
    width: 115,
    height: 115,
    marginBottom: 5,
    resizeMode: "contain",
},

infoText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
},

secondIcon: {
    marginBottom: 10,
},

errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
},

signOutButton: {
    position: "absolute",
    alignSelf: "center",
    bottom: 40,
    backgroundColor: "#AB0808",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    elevation: 4,
},

signOutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
},

background: {
    flex: 1,
    width: "100%",
    height: "100%",
},

iconoSalir: {
    marginLeft: 8,
}
});