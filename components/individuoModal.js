// Importaciones necesarias de React y React Native
import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    SafeAreaView,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";

// Importación de hooks personalizados para validación, cálculos y contexto
import { useFormArbolValidation } from "../hooks/useFormArbolValidation";
import { useCalculosIndividuoArboreo } from "../hooks/useCalculosIndividuoArboreo";
import { useIndividuo } from "../hooks/useIndividuo";
import { useSubparcela } from "../hooks/useView";
import { useBrigadista } from "../context/BrigadistaContext";

// Componente principal: Modal para registrar un individuo arbóreo
export default function IndividuoModal({
    route,
    navigation
}) {
    // Extrae el nombre de la subparcela desde los parámetros de navegación
    const { nombreSubparcela } = route.params || { nombreSubparcela: "SPF1" };

    // Acceso al contexto del brigadista (para obtener el ID de conglomerado)
    const { brigadista } = useBrigadista();
    const conglomeradoId = brigadista?.idConglomerado;

    // Hooks personalizados para lógica de negocio y base de datos
    const { siguienteIdIndividuo, guardarIndividuo } = useIndividuo();
    const { obtenerIdSubparcela } = useSubparcela();

    // Estados internos
    const [idIndividuo, setIdIndividuo] = useState("");
    const [subparcelaId, setSubparcelaId] = useState("");
    const [subparcela, setSubparcela] = useState(nombreSubparcela);
    const [loading, setLoading] = useState(true); // Muestra indicador de carga

    // Control de modales tipo dropdown
    const [showDropdownModal, setShowDropdownModal] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [dropdownValue, setDropdownValue] = useState(null);

    // Listas de opciones para campos select
    const condicionOptions = ["MP", "TM", "TV", "VC", "VP"];
    const talloOptions = ["Único", "Múltiple"];
    const formaFusteOptions = ["CIL", "FA", "INC", "IRR", "RT"];
    const danoOptions = ["DB", "DM", "EB", "Q", "SD"];

    // Valores iniciales para el formulario
    const initialValues = {
        condicion: "MP",
        azimut: "",
        distanciaCentro: "",
        tallo: "Único",
        diametro: "",
        distanciaHorizontal: "",
        anguloVistoBajo: "",
        anguloVistoAlto: "",
        formaFuste: "CIL",
        dano: "SD",
        penetracion: ""
    };

    // Hook de validación personalizado para los formularios
    const {
        values,
        errors,
        errorMessages,
        isValid,
        handleChange,
        validateForm,
        setValues
    } = useFormArbolValidation(initialValues);

    // Hook de cálculo para obtener valores derivados (tamaño y altura)
    const { tamanoIndividuo, alturaTotal } = useCalculosIndividuoArboreo(values);

    // useEffect para inicializar datos cuando se monta el componente
    useEffect(() => {
        const inicializarDatos = async () => {
            setLoading(true);
            try {
                if (!conglomeradoId) {
                    console.error("No se encontró el ID del conglomerado");
                    return;
                }

                // Obtiene ID de subparcela desde el backend
                const idSubparcela = await obtenerIdSubparcela(nombreSubparcela, conglomeradoId);
                setSubparcelaId(idSubparcela);

                // Obtiene ID para el nuevo individuo desde el backend
                const nextId = await siguienteIdIndividuo();
                setIdIndividuo(nextId);

                // Reinicia valores del formulario
                setValues({
                    ...initialValues,
                    condicion: "MP",
                    tallo: "Único",
                    formaFuste: "CIL",
                    dano: "SD"
                });

                setSubparcela(nombreSubparcela);
                setShowDropdownModal(false);
            } catch (error) {
                console.error("Error al inicializar datos:", error);
            } finally {
                setLoading(false);
            }
        };

        // Inicializa si hay nombre de subparcela y ID de conglomerado
        if (nombreSubparcela && conglomeradoId) {
            inicializarDatos();
        }
    }, [nombreSubparcela, conglomeradoId]);

    // Función que se llama al presionar el botón de guardar
    const handleGuardar = async () => {
        if (!validateForm()) {
            return; // No guardar si el formulario es inválido
        }

        // Datos que serán enviados al backend
        const datosIndividuo = {
            idIndividuo,
            subparcelaId,
            tamanoIndividuo,
            alturaTotal,
            condicion: values.condicion,
            azimut: values.azimut,
            distanciaCentro: values.distanciaCentro,
            tallo: values.tallo,
            diametro: values.diametro,
            distanciaHorizontal: values.distanciaHorizontal,
            anguloVistoBajo: values.anguloVistoBajo,
            anguloVistoAlto: values.anguloVistoAlto,
            formaFuste: values.formaFuste,
            dano: values.dano,
            penetracion: values.penetracion,
            cedula_brigadista: brigadista?.cedula,
        };

        try {
            setLoading(true);
            const id = await guardarIndividuo(datosIndividuo);
            if (id) {
                Alert.alert(
                    "Éxito",
                    "El individuo se ha guardado correctamente",
                    [{ text: "OK", onPress: () => navigation.goBack() }]
                );
            } else {
                Alert.alert(
                    "Error",
                    "No se pudo guardar el individuo. Inténtalo de nuevo.",
                    [{ text: "OK" }]
                );
            }
        } catch (error) {
            console.error("Error al guardar individuo:", error);
            Alert.alert(
                "Error",
                "Ocurrió un error al guardar el individuo: " + error.message,
                [{ text: "OK" }]
            );
        } finally {
            setLoading(false);
        }
    };

    // Abre el modal de opciones dropdown
    const openDropdown = (field) => {
        let options = [];
        let currentValue = "";

        switch (field) {
            case "condicion":
                options = condicionOptions;
                currentValue = values.condicion;
                break;
            case "tallo":
                options = talloOptions;
                currentValue = values.tallo;
                break;
            case "formaFuste":
                options = formaFusteOptions;
                currentValue = values.formaFuste;
                break;
            case "dano":
                options = danoOptions;
                currentValue = values.dano;
                break;
        }

        setActiveDropdown(field);
        setDropdownOptions(options);
        setDropdownValue(currentValue);
        setShowDropdownModal(true);
    };

    // Al seleccionar una opción del dropdown
    const selectOption = (option) => {
        handleChange(activeDropdown, option);
        setShowDropdownModal(false);
    };

    // Maneja el cierre del modal (navega hacia atrás)
    const handleClose = () => {
        navigation.goBack();
    };

    // Renderiza una opción dentro del dropdown
    const renderOptionItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalOptionItem}
            onPress={() => selectOption(item)}
        >
            <Text style={[
                styles.modalOptionText,
                item === dropdownValue ? styles.selectedOptionText : null
            ]}>
                {item}
            </Text>
        </TouchableOpacity>
    );

    // Si está en estado de carga, mostrar spinner
    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.fullScreen, styles.centerContent]}>
                    <ActivityIndicator size="large" color="#1E5A26" />
                    <Text style={styles.loadingText}>Cargando datos...</Text>
                </View>
            </SafeAreaView>
        );
    }



    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Cambia el color de la barra de estado y el estilo del texto */}
            <StatusBar backgroundColor="#1E5A26" barStyle="light-content" />

            {/* Ajusta la vista para evitar que el teclado tape los inputs */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.fullScreen}
            >
                {/* Scroll para contenido que sobrepasa la pantalla */}
                <ScrollView contentContainerStyle={[styles.scrollViewContent, { paddingBottom: 60 }]} keyboardShouldPersistTaps="handled">
                    <View style={styles.modalView}>
                        {/* Encabezado del modal con título */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Registro del Individuo</Text>
                        </View>

                        {/* Muestra información general (Subparcela e Id asignado) */}
                        <View style={styles.topInfoContainer}>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Subparcela:</Text>
                                {/* Si no hay dato, muestra "Cargando..." */}
                                <Text style={styles.infoValue}>{subparcelaId || "Cargando..."}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Id asignado:</Text>
                                <Text style={styles.infoValue}>{idIndividuo || "Cargando..."}</Text>
                            </View>
                        </View>

                        {/* Contenedor del formulario con inputs y selectores */}
                        <View style={styles.formContainer}>
                            {/* Fila 1: Tamaño del Individuo y Condición */}
                            <View style={styles.formRow}>
                                <View style={styles.formColumn}>
                                    <Text style={styles.label}>Tamaño del Individuo</Text>
                                    <View style={styles.inputContainer}>
                                        {/* Campo de texto no editable, muestra tamaño */}
                                        <TextInput
                                            style={[styles.standardInput, styles.disabledInput]}
                                            value={tamanoIndividuo}
                                            placeholder="Por determinar"
                                            editable={false}
                                        />
                                        <View style={styles.errorContainer}>
                                            {/* Espacio reservado para posibles mensajes de error */}
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.formColumn}>
                                    <Text style={styles.label}>* Condición</Text>
                                    <View style={styles.inputContainer}>
                                        {/* Selector que abre dropdown al presionar */}
                                        <TouchableOpacity
                                            style={styles.standardSelect}
                                            onPress={() => openDropdown("condicion")}
                                        >
                                            <Text>{values.condicion}</Text>
                                            <Text style={styles.dropdownArrow}>▼</Text>
                                        </TouchableOpacity>
                                        <View style={styles.errorContainer}>
                                            {/* Espacio reservado para errores */}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Fila 2: Azimut y Distancia del centro */}
                            <View style={styles.formRow}>
                                <View style={styles.formColumn}>
                                    <Text style={styles.label}>* Azimut (°)</Text>
                                    <View style={styles.inputContainer}>
                                        {/* Input numérico para azimut, con validación visual */}
                                        <TextInput
                                            style={[styles.standardInput, errors.azimut && values.azimut && values.azimut.trim() !== '' && styles.inputError]}
                                            value={values.azimut}
                                            onChangeText={(text) => handleChange('azimut', text)}
                                            placeholder="0.0"
                                            keyboardType="numeric"
                                        />
                                        <View style={styles.errorContainer}>
                                            {/* Muestra mensaje de error si existe */}
                                            {errors.azimut && (
                                                <Text style={styles.errorText}>{errorMessages.azimut}</Text>
                                            )}
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.formColumn}>
                                    <Text style={styles.label}>* Distancia del centro (m)</Text>
                                    <View style={styles.inputContainer}>
                                        {/* Input numérico para distancia al centro, con validación */}
                                        <TextInput
                                            style={[styles.standardInput, errors.distanciaCentro && values.distanciaCentro && values.distanciaCentro.trim() !== '' && styles.inputError]}
                                            value={values.distanciaCentro}
                                            onChangeText={(text) => handleChange('distanciaCentro', text)}
                                            placeholder="0.0"
                                            keyboardType="numeric"
                                        />
                                        <View style={styles.errorContainer}>
                                            {errors.distanciaCentro && (
                                                <Text style={styles.errorText}>{errorMessages.distanciaCentro}</Text>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Fila 3: Tallo y Diámetro */}
                            <View style={styles.formRow}>
                                <View style={styles.formColumn}>
                                    <Text style={styles.label}>* Tallo</Text>
                                    <View style={styles.inputContainer}>
                                        {/* Selector para elegir tipo de tallo */}
                                        <TouchableOpacity
                                            style={styles.standardSelect}
                                            onPress={() => openDropdown("tallo")}
                                        >
                                            <Text>{values.tallo}</Text>
                                            <Text style={styles.dropdownArrow}>▼</Text>
                                        </TouchableOpacity>
                                        <View style={styles.errorContainer}>
                                            {/* Reservado para errores */}
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.formColumn}>
                                    <Text style={styles.label}>* Diámetro (cm)</Text>
                                    <View style={styles.inputContainer}>
                                        {/* Input numérico para diámetro con validación */}
                                        <TextInput
                                            style={[styles.standardInput, errors.diametro && values.diametro && values.diametro.trim() !== '' && styles.inputError]}
                                            value={values.diametro}
                                            onChangeText={(text) => handleChange('diametro', text)}
                                            placeholder="0.0"
                                            keyboardType="numeric"
                                        />
                                        <View style={styles.errorContainer}>
                                            {errors.diametro && (
                                                <Text style={styles.errorText}>{errorMessages.diametro}</Text>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Fila 4: Distancia Horizontal y Ángulo visto hacia abajo */}
                            <View style={styles.formRow}>
                                <View style={styles.formColumn}>
                                    <Text style={styles.label}>* Distancia Horizontal (m)</Text>
                                    <View style={styles.inputContainer}>
                                        {/* Input para distancia horizontal, validado */}
                                        <TextInput
                                            style={[styles.standardInput, errors.distanciaHorizontal && values.distanciaHorizontal && values.distanciaHorizontal.trim() !== '' && styles.inputError]}
                                            value={values.distanciaHorizontal}
                                            onChangeText={(text) => handleChange('distanciaHorizontal', text)}
                                            placeholder="0.0"
                                            keyboardType="numeric"
                                        />
                                        <View style={styles.errorContainer}>
                                            {errors.distanciaHorizontal && (
                                                <Text style={styles.errorText}>{errorMessages.distanciaHorizontal}</Text>
                                            )}
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.formColumn}>
                                    <Text style={styles.label}>* Ángulo visto hacia abajo</Text>
                                    <View style={styles.inputContainer}>
                                        {/* Input para ángulo visto hacia abajo con validación */}
                                        <TextInput
                                            style={[styles.standardInput, errors.anguloVistoBajo && values.anguloVistoBajo && values.anguloVistoBajo.trim() !== '' && styles.inputError]}
                                            value={values.anguloVistoBajo}
                                            onChangeText={(text) => handleChange('anguloVistoBajo', text)}
                                            placeholder="0.0"
                                            keyboardType="numeric"
                                        />
                                        <View style={styles.errorContainer}>
                                            {errors.anguloVistoBajo && (
                                                <Text style={styles.errorText}>{errorMessages.anguloVistoBajo}</Text>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Fila 5: Ángulo visto hacia arriba y Altura total */}
                            <View style={styles.formRow}>
                                <View style={styles.formColumn}>
                                    <Text style={styles.label}>* Ángulo visto hacia arriba</Text>
                                    <View style={styles.inputContainer}>
                                        {/* Input para ángulo visto hacia arriba con validación */}
                                        <TextInput
                                            style={[styles.standardInput, errors.anguloVistoAlto && values.anguloVistoAlto && values.anguloVistoAlto.trim() !== '' && styles.inputError]}
                                            value={values.anguloVistoAlto}
                                            onChangeText={(text) => handleChange('anguloVistoAlto', text)}
                                            placeholder="0.0"
                                            keyboardType="numeric"
                                        />
                                        <View style={styles.errorContainer}>
                                            {errors.anguloVistoAlto && (
                                                <Text style={styles.errorText}>{errorMessages.anguloVistoAlto}</Text>
                                            )}
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.formColumn}>
                                    <Text style={styles.label}>Altura total (m)</Text>
                                    <View style={styles.inputContainer}>
                                        {/* Campo no editable que muestra altura calculada */}
                                        <TextInput
                                            style={[styles.standardInput, styles.disabledInput]}
                                            value={alturaTotal}
                                            placeholder="0.0"
                                            editable={false}
                                        />
                                        <View style={styles.errorContainer}>
                                            {/* Reservado para errores */}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Fila 6: Forma del fuste y Daño */}
                            <View style={styles.formRow}>
                                <View style={styles.formColumn}>
                                    <Text style={styles.label}>* Forma del fuste</Text>
                                    <View style={styles.inputContainer}>
                                        {/* Selector para forma del fuste */}
                                        <TouchableOpacity
                                            style={styles.standardSelect}
                                            onPress={() => openDropdown("formaFuste")}
                                        >
                                            <Text>{values.formaFuste}</Text>
                                            <Text style={styles.dropdownArrow}>▼</Text>
                                        </TouchableOpacity>
                                        <View style={styles.errorContainer}>
                                            {/* Reservado para errores */}
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.formColumn}>
                                    <Text style={styles.label}>* Daño</Text>
                                    <View style={styles.inputContainer}>
                                        {/* Selector para daño */}
                                        <TouchableOpacity
                                            style={styles.standardSelect}
                                            onPress={() => openDropdown("dano")}
                                        >
                                            <Text>{values.dano}</Text>
                                            <Text style={styles.dropdownArrow}>▼</Text>
                                        </TouchableOpacity>
                                        <View style={styles.errorContainer}>
                                            {/* Reservado para errores */}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Fila 7: Penetración y botón de guardar */}
                            <View style={styles.formRow}>
                                <View style={styles.formColumn}>
                                    <Text style={styles.label}>
                                        {/* Condición para mostrar asterisco en penetración */}
                                        {(values.condicion === 'MP' || values.condicion === 'TM' || values.condicion === 'TV') && '* '}
                                        Penetración (cm)
                                    </Text>
                                    <View style={styles.inputContainer}>
                                        {/* Input para penetración, editable solo para ciertas condiciones */}
                                        <TextInput
                                            style={[
                                                styles.standardInput,
                                                errors.penetracion && values.penetracion && values.penetracion.trim() !== '' && styles.inputError,
                                                !(values.condicion === 'MP' || values.condicion === 'TM' || values.condicion === 'TV') && styles.disabledInput
                                            ]}
                                            value={values.penetracion}
                                            onChangeText={(text) => handleChange('penetracion', text)}
                                            placeholder="0.0"
                                            keyboardType="numeric"
                                            editable={values.condicion === 'MP' || values.condicion === 'TM' || values.condicion === 'TV'}
                                        />
                                        <View style={styles.errorContainer}>
                                            {/* Muestra error solo si la condición es válida */}
                                            {errors.penetracion && (values.condicion === 'MP' || values.condicion === 'TM' || values.condicion === 'TV') && (
                                                <Text style={styles.errorText}>{errorMessages.penetracion}</Text>
                                            )}
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.formColumn}>
                                    {/* Botón para guardar, deshabilitado si el formulario no es válido */}
                                    <Text style={styles.label}>&nbsp;</Text>
                                    <View style={styles.inputContainer}>
                                        <TouchableOpacity
                                            style={[
                                                styles.standardButton,
                                                !isValid && styles.buttonDisabled
                                            ]}
                                            onPress={handleGuardar}
                                            disabled={!isValid}
                                        >
                                            <Text
                                                style={[
                                                    styles.buttonText,
                                                    !isValid && styles.buttonTextDisabled
                                                ]}
                                            >
                                                Hecho
                                            </Text>
                                        </TouchableOpacity>
                                        <View style={styles.errorContainer}>
                                            {/* Reservado para mensajes */}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Modal para mostrar opciones dropdown */}
            <Modal
                visible={showDropdownModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDropdownModal(false)}
            >
                {/* Overlay que cierra el modal si se toca fuera */}
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowDropdownModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {/* Título dinámico según dropdown activo */}
                            <Text style={styles.modalTitle}>
                                {activeDropdown === "condicion" ? "Seleccionar Condición" :
                                    activeDropdown === "tallo" ? "Seleccionar Tallo" :
                                        activeDropdown === "formaFuste" ? "Seleccionar Forma de Fuste" :
                                            "Seleccionar Daño"}
                            </Text>

                            {/* Lista de opciones para seleccionar */}
                            <FlatList
                                data={dropdownOptions}
                                renderItem={renderOptionItem}
                                keyExtractor={(item) => item}
                                style={styles.optionsList}
                            />

                            {/* Botón para cerrar el modal */}
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setShowDropdownModal(false)}
                            >
                                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    )
}

// Estilos para el componente
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    fullScreen: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 20,
    },
    modalView: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 17,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        paddingBottom: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
        textAlign: "center",
    },
    topInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 25,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    infoLabel: {
        fontWeight: "bold",
        marginRight: 5,
        fontSize: 17,
    },
    infoValue: {
        fontSize: 17,
    },
    formContainer: {
        width: "100%",
        paddingVertical: 20,
    },
    formRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10, // Ajustado para tener un espacio consistente
        width: "100%",
    },
    formColumn: {
        width: "48%",
    },
    label: {
        fontSize: 12,
        marginBottom: 10,
        color: "#333",
    },
    inputContainer: {
        marginBottom: 0, // Eliminado el margen inferior aquí
    },
    errorContainer: {
        height: 18, // Altura fija para todos los contenedores de error
        justifyContent: 'flex-start', // Alineación superior para los mensajes
        paddingTop: 2, // Pequeño padding para separar del input
    },
    errorText: {
        color: "red",
        fontSize: 10,
        marginTop: 0, // Eliminado margen superior aquí
    },
    standardInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        fontSize: 12,
        height: 45,
        marginBottom: 0, // Eliminado el margen inferior
    },
    standardSelect: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        height: 45,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    standardButton: {
        backgroundColor: "#4285F4",
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        height: 45,
    },
    inputError: {
        borderColor: "red",
    },
    disabledInput: {
        backgroundColor: "#f0f0f0",
        color: "#666",
    },
    dropdownArrow: {
        fontSize: 12,
        color: "#666",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    buttonDisabled: {
        backgroundColor: "#cccccc",
    },
    buttonTextDisabled: {
        color: "#888888",
    },

    // Estilos para el modal de dropdown
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 0,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalContent: {
        padding: 20,
    },
    optionsList: {
        maxHeight: 250,
    },
    modalOptionItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    modalOptionText: {
        fontSize: 16,
    },
    selectedOptionText: {
        fontWeight: "bold",
        color: "#4285F4",
    },
    modalCloseButton: {
        marginTop: 15,
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        alignItems: "center",
    },
    modalCloseButtonText: {
        fontSize: 16,
        color: "#333",
    },
});