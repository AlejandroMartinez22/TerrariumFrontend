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
    StyleSheet
    } from "react-native";

    // Importar el hook de validación
    import { useFormArbolValidation } from "../hooks/useFormArbolValidation";
    import { useCalculosIndividuoArboreo } from "../hooks/useCalculosIndividuoArboreo"; 

    export default function IndividuoModal({ 
    route, 
    navigation 
    }) {
    // Recibe el parámetro nombreSubparcela desde la pantalla anterior
    const { nombreSubparcela } = route.params || { nombreSubparcela: "SPF1" };

    // Estado para almacenar datos que no son parte del formulario validado
    const [idIndividuo, setIdIndividuo] = useState("");
    const [subparcela, setSubparcela] = useState(nombreSubparcela);
    const [idAsignado, setIdAsignado] = useState("A001");
    
    // Estados para controlar los modales de selección
    const [showDropdownModal, setShowDropdownModal] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [dropdownValue, setDropdownValue] = useState(null);

    // Opciones para los dropdowns
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

    // Usar el hook de validación
    const { 
        values, 
        errors, 
        errorMessages, 
        isValid, 
        handleChange, 
        validateForm,
        setValues 
    } = useFormArbolValidation(initialValues);

    const { tamanoIndividuo, alturaTotal } = useCalculosIndividuoArboreo(values); // Usar el hook de cálculos para el tamaño y altura

    useEffect(() => {
        const inicializarDatos = async () => {
        // Reiniciamos los valores del formulario
        setValues({
            ...initialValues,
            condicion: "MP",
            tallo: "Único",
            formaFuste: "CIL",
            dano: "SD"
        });
        
        // Valores que no son parte del formulario validado
        setSubparcela(nombreSubparcela);
        setIdAsignado("A001");
        
        // Cerramos el modal de dropdown si está abierto
        setShowDropdownModal(false);
        
        // Generamos un nuevo ID desde la base de datos
        };

        inicializarDatos();
    }, [nombreSubparcela]);

    // Manejar el evento de guardar
    const handleGuardar = () => {
        if (!validateForm()) {
        return;
        }

        // Si el formulario es válido, guardamos los datos
        const datosIndividuo = {
        idIndividuo,
        subparcela,
        idAsignado,
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
        };

        console.log("Guardando individuo:", datosIndividuo);
        
        // Aquí iría la lógica para guardar el individuo en la base de datos
        
        // Volvemos a la pantalla anterior
        navigation.goBack();
    };

    // Función para abrir el selector como modal
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

    // Función para seleccionar una opción y cerrar el modal
    const selectOption = (option) => {
        handleChange(activeDropdown, option);
        setShowDropdownModal(false);
    };

    // Función para manejar el cierre del modal
    const handleClose = () => {
        navigation.goBack();
    };

    // Renderizar un elemento de la lista de opciones
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

    return (
        <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#1E5A26" barStyle="light-content" />
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.fullScreen}
        >
            <ScrollView contentContainerStyle={[styles.scrollViewContent, { paddingBottom: 60 }]} keyboardShouldPersistTaps="handled">
            <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Registro del Individuo</Text>
                </View>
                
                <View style={styles.topInfoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Subparcela:</Text>
                    <Text style={styles.infoValue}>{subparcela}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Id asignado:</Text>
                    <Text style={styles.infoValue}>{idAsignado}</Text>
                </View>
                </View>

                <View style={styles.formContainer}>
                {/* Fila 1: Tamaño del Individuo y Condición */}
                <View style={styles.formRow}>
                    <View style={styles.formColumn}>
                    <Text style={styles.label}>Tamaño del Individuo</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                        style={[styles.standardInput, styles.disabledInput]}
                        value={tamanoIndividuo}
                        placeholder="Por determinar"
                        editable={false}
                        />
                        <View style={styles.errorContainer}>
                        {/* Espacio reservado para mantener consistencia */}
                        </View>
                    </View>
                    </View>
                    <View style={styles.formColumn}>
                    <Text style={styles.label}>* Condición</Text>
                    <View style={styles.inputContainer}>
                        <TouchableOpacity
                        style={styles.standardSelect}
                        onPress={() => openDropdown("condicion")}
                        >
                        <Text>{values.condicion}</Text>
                        <Text style={styles.dropdownArrow}>▼</Text>
                        </TouchableOpacity>
                        <View style={styles.errorContainer}>
                        {/* Espacio reservado para mantener consistencia */}
                        </View>
                    </View>
                    </View>
                </View>

                {/* Fila 2: Azimut y Distancia del centro */}
                <View style={styles.formRow}>
                    <View style={styles.formColumn}>
                    <Text style={styles.label}>* Azimut (°)</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                        style={[styles.standardInput, errors.azimut && values.azimut && values.azimut.trim() !== '' && styles.inputError]}
                        value={values.azimut}
                        onChangeText={(text) => handleChange('azimut', text)}
                        placeholder="0.0"
                        keyboardType="numeric"
                        />
                        <View style={styles.errorContainer}>
                        {errors.azimut && (
                            <Text style={styles.errorText}>{errorMessages.azimut}</Text>
                        )}
                        </View>
                    </View>
                    </View>
                    <View style={styles.formColumn}>
                    <Text style={styles.label}>* Distancia del centro (m)</Text>
                    <View style={styles.inputContainer}>
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
                        <TouchableOpacity
                        style={styles.standardSelect}
                        onPress={() => openDropdown("tallo")}
                        >
                        <Text>{values.tallo}</Text>
                        <Text style={styles.dropdownArrow}>▼</Text>
                        </TouchableOpacity>
                        <View style={styles.errorContainer}>
                        {/* Espacio reservado para mantener consistencia */}
                        </View>
                    </View>
                    </View>
                    <View style={styles.formColumn}>
                    <Text style={styles.label}>* Diámetro (cm)</Text>
                    <View style={styles.inputContainer}>
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
                        <TextInput
                        style={[styles.standardInput, styles.disabledInput]}
                        value={alturaTotal}
                        placeholder="0.0"
                        editable={false}
                        />
                        <View style={styles.errorContainer}>
                        {/* Espacio reservado para mantener consistencia */}
                        </View>
                    </View>
                    </View>
                </View>

                {/* Fila 6: Forma del fuste y Daño */}
                <View style={styles.formRow}>
                    <View style={styles.formColumn}>
                    <Text style={styles.label}>* Forma del fuste</Text>
                    <View style={styles.inputContainer}>
                        <TouchableOpacity
                        style={styles.standardSelect}
                        onPress={() => openDropdown("formaFuste")}
                        >
                        <Text>{values.formaFuste}</Text>
                        <Text style={styles.dropdownArrow}>▼</Text>
                        </TouchableOpacity>
                        <View style={styles.errorContainer}>
                        {/* Espacio reservado para mantener consistencia */}
                        </View>
                    </View>
                    </View>
                    <View style={styles.formColumn}>
                    <Text style={styles.label}>* Daño</Text>
                    <View style={styles.inputContainer}>
                        <TouchableOpacity
                        style={styles.standardSelect}
                        onPress={() => openDropdown("dano")}
                        >
                        <Text>{values.dano}</Text>
                        <Text style={styles.dropdownArrow}>▼</Text>
                        </TouchableOpacity>
                        <View style={styles.errorContainer}>
                        {/* Espacio reservado para mantener consistencia */}
                        </View>
                    </View>
                    </View>
                </View>

                {/* Fila 7: Penetración y botón de Hecho */}
                <View style={styles.formRow}>
                    <View style={styles.formColumn}>
                    <Text style={styles.label}>
                        {(values.condicion === 'MP' || values.condicion === 'TM' || values.condicion === 'TV') && '* '}
                        Penetración (cm)
                    </Text>
                    <View style={styles.inputContainer}>
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
                        {errors.penetracion && (values.condicion === 'MP' || values.condicion === 'TM' ||  values.condicion === 'TV') && (
                            <Text style={styles.errorText}>{errorMessages.penetracion}</Text>
                        )}
                        </View>
                    </View>
                    </View>
                    <View style={styles.formColumn}>
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
                        {/* Espacio reservado para mantener consistencia */}
                        </View>
                    </View>
                    </View>
                </View>
                </View>
            </View>
            </ScrollView>
        </KeyboardAvoidingView>

        {/* Modal para los dropdowns */}
        <Modal
            visible={showDropdownModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowDropdownModal(false)}
        >
            <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDropdownModal(false)}
            >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                    {activeDropdown === "condicion" ? "Seleccionar Condición" :
                    activeDropdown === "tallo" ? "Seleccionar Tallo" :
                    activeDropdown === "formaFuste" ? "Seleccionar Forma de Fuste" :
                    "Seleccionar Daño"}
                </Text>
                
                <FlatList
                    data={dropdownOptions}
                    renderItem={renderOptionItem}
                    keyExtractor={(item) => item}
                    style={styles.optionsList}
                />
                
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
    );
    }

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