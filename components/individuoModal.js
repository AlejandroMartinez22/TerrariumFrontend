    import React, { useState, useEffect } from "react";
    import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform
    } from "react-native";

    // Función para obtener el ID del individuo (similar a la del ejemplo)
    import { getUltimoIdIndividuoDeBack } from "../api";

    export default function IndividuoModal({
    visible,
    onClose,
    onConfirmar,
    individuoEditado = null,
    }) {
    // Estado para almacenar los valores del formulario
    const [idIndividuo, setIdIndividuo] = useState("");
    const [subparcela, setSubparcela] = useState("SPF5");
    const [idAsignado, setIdAsignado] = useState("A001");
    const [tamanoIndividuo, setTamanoIndividuo] = useState(""); // No editable
    const [condicion, setCondicion] = useState("MP");
    const [azimut, setAzimut] = useState("");
    const [distanciaCentro, setDistanciaCentro] = useState("");
    const [tallo, setTallo] = useState("Único");
    const [diametro, setDiametro] = useState("");
    const [distanciaHorizontal, setDistanciaHorizontal] = useState("");
    const [anguloVistoBajo, setAnguloVistoBajo] = useState("");
    const [anguloVistoAlto, setAnguloVistoAlto] = useState("");
    const [alturaTotal, setAlturaTotal] = useState(""); // No editable
    const [formaFuste, setFormaFuste] = useState("CIL");
    const [dano, setDano] = useState("SD");
    const [penetracion, setPenetracion] = useState("");

    // Estados para controlar los dropdowns
    const [showCondicionDropdown, setShowCondicionDropdown] = useState(false);
    const [showTalloDropdown, setShowTalloDropdown] = useState(false);
    const [showFormaFusteDropdown, setShowFormaFusteDropdown] = useState(false);
    const [showDanoDropdown, setShowDanoDropdown] = useState(false);

    // Opciones para los dropdowns
    const condicionOptions = ["MP", "TM", "TV", "VC", "VP"];
    const talloOptions = ["Único", "Múltiple"];
    const formaFusteOptions = ["CIL", "FA", "INC", "IRR", "RT"];
    const danoOptions = ["DB", "DM", "EB", "Q", "SD"];

    // Estado para manejar errores de validación
    const [errors, setErrors] = useState({
        azimut: false,
        distanciaCentro: false,
        diametro: false,
        distanciaHorizontal: false,
        anguloVistoBajo: false,
        anguloVistoAlto: false,
        penetracion: false,
    });

    // Calcular si el formulario es válido
    const isFormValid = 
        azimut && azimut.trim() !== "" &&
        distanciaCentro && distanciaCentro.trim() !== "" &&
        diametro && diametro.trim() !== "" &&
        distanciaHorizontal && distanciaHorizontal.trim() !== "" &&
        anguloVistoBajo && anguloVistoBajo.trim() !== "" &&
        anguloVistoAlto && anguloVistoAlto.trim() !== "" &&
        penetracion && penetracion.trim() !== "";

    useEffect(() => {
        // Verificamos si el modal está visible
        if (!visible) return;

        const inicializarDatos = async () => {
        // Reiniciamos los errores cuando se abre el modal
        setErrors({
            azimut: false,
            distanciaCentro: false,
            diametro: false,
            distanciaHorizontal: false,
            anguloVistoBajo: false,
            anguloVistoAlto: false,
            penetracion: false,
        });
        
        // Ocultamos todos los dropdowns
        setShowCondicionDropdown(false);
        setShowTalloDropdown(false);
        setShowFormaFusteDropdown(false);
        setShowDanoDropdown(false);
        
        if (individuoEditado) {
            console.log("Cargando datos del individuo existente:", individuoEditado);
            
            // Si estamos editando, usamos los valores del individuo editado
            setSubparcela(individuoEditado.subparcela || "SPF5");
            setIdAsignado(individuoEditado.idAsignado || "A001");
            setTamanoIndividuo(individuoEditado.tamanoIndividuo || "");
            setCondicion(individuoEditado.condicion || "MP");
            setAzimut(individuoEditado.azimut ? String(individuoEditado.azimut) : "");
            setDistanciaCentro(individuoEditado.distanciaCentro ? String(individuoEditado.distanciaCentro) : "");
            setTallo(individuoEditado.tallo || "Único");
            setDiametro(individuoEditado.diametro ? String(individuoEditado.diametro) : "");
            setDistanciaHorizontal(individuoEditado.distanciaHorizontal ? String(individuoEditado.distanciaHorizontal) : "");
            setAnguloVistoBajo(individuoEditado.anguloVistoBajo ? String(individuoEditado.anguloVistoBajo) : "");
            setAnguloVistoAlto(individuoEditado.anguloVistoAlto ? String(individuoEditado.anguloVistoAlto) : "");
            setAlturaTotal(individuoEditado.alturaTotal ? String(individuoEditado.alturaTotal) : "");
            setFormaFuste(individuoEditado.formaFuste || "CIL");
            setDano(individuoEditado.dano || "SD");
            setPenetracion(individuoEditado.penetracion ? String(individuoEditado.penetracion) : "");
            setIdIndividuo(individuoEditado.idIndividuo || individuoEditado.id || "");
        } else {
            // Si estamos creando uno nuevo, establecemos valores por defecto
            setSubparcela("SPF5");
            setIdAsignado("A001");
            setTamanoIndividuo(""); // Calculado por la aplicación
            setCondicion("MP");
            setAzimut("");
            setDistanciaCentro("");
            setTallo("Único");
            setDiametro("");
            setDistanciaHorizontal("");
            setAnguloVistoBajo("");
            setAnguloVistoAlto("");
            setAlturaTotal(""); // Calculado por la aplicación
            setFormaFuste("CIL");
            setDano("SD");
            setPenetracion("");
            
            // Generamos un nuevo ID desde la base de datos
            try {
            const nuevoId = await getUltimoIdIndividuoDeBack();
            console.log("Nuevo ID generado desde el backend:", nuevoId);
            
            if (nuevoId) {
                setIdIndividuo(nuevoId);
            } else {
                setIdIndividuo("IND001");
                console.warn("No se pudo obtener un ID de la base de datos, usando ID predeterminado");
            }
            } catch (error) {
            console.error("Error al obtener el siguiente ID:", error);
            setIdIndividuo("IND001"); // ID por defecto en caso de error
            }
        }

        // Calcular altura total y tamaño del individuo (simulado)
        calcularCamposAutomaticos();
        };

        inicializarDatos();
    }, [visible, individuoEditado]);

    // Función para calcular automáticamente los campos no editables
    const calcularCamposAutomaticos = () => {
        // Estas son simulaciones de cálculos. En una implementación real,
        // estos valores se calcularían en base a fórmulas específicas
        
        // Si tenemos los valores necesarios para calcular la altura total
        if (distanciaHorizontal && anguloVistoAlto) {
        const distH = parseFloat(distanciaHorizontal);
        const angulo = parseFloat(anguloVistoAlto);
        if (!isNaN(distH) && !isNaN(angulo)) {
            // Formula simplificada para la simulación: tan(angulo) * distancia
            const altura = (Math.tan((angulo * Math.PI) / 180) * distH).toFixed(2);
            setAlturaTotal(altura);
        }
        }
        
        // Cálculo simulado del tamaño del individuo
        if (diametro) {
        const diam = parseFloat(diametro);
        if (!isNaN(diam)) {
            // Fórmula simplificada: diámetro * factor_ajuste
            const tamano = (diam * 0.8).toFixed(2);
            setTamanoIndividuo(tamano);
        }
        }
    };

    // Para debugging - registrar los cambios en las variables principales
    useEffect(() => {
        // Calcular campos automáticos cuando cambien los valores relevantes
        calcularCamposAutomaticos();
        
        console.log("Estado actual:", {
        subparcela,
        idAsignado,
        tamanoIndividuo,
        condicion,
        azimut,
        distanciaCentro,
        tallo,
        diametro,
        distanciaHorizontal,
        anguloVistoBajo,
        anguloVistoAlto,
        alturaTotal,
        formaFuste,
        dano,
        penetracion,
        idIndividuo,
        individuoEditadoPresente: !!individuoEditado
        });
    }, [
        distanciaHorizontal, 
        anguloVistoAlto, 
        diametro, 
        azimut, 
        distanciaCentro, 
        anguloVistoBajo, 
        penetracion
    ]);

    // Validar campos antes de guardar
    const validateFields = () => {
        let isValid = true;
        const newErrors = {
        azimut: !azimut || azimut.trim() === "",
        distanciaCentro: !distanciaCentro || distanciaCentro.trim() === "",
        diametro: !diametro || diametro.trim() === "",
        distanciaHorizontal: !distanciaHorizontal || distanciaHorizontal.trim() === "",
        anguloVistoBajo: !anguloVistoBajo || anguloVistoBajo.trim() === "",
        anguloVistoAlto: !anguloVistoAlto || anguloVistoAlto.trim() === "",
        penetracion: !penetracion || penetracion.trim() === "",
        };

        // Comprobar si hay algún error
        for (const key in newErrors) {
        if (newErrors[key]) {
            isValid = false;
            break;
        }
        }

        setErrors(newErrors);
        return isValid;
    };

    // Manejar el evento de guardar
    const handleGuardar = () => {
        if (!validateFields()) {
        return;
        }

        // Si el formulario es válido, guardamos los datos
        const datosIndividuo = {
        idIndividuo,
        subparcela,
        idAsignado,
        tamanoIndividuo,
        condicion,
        azimut,
        distanciaCentro,
        tallo,
        diametro,
        distanciaHorizontal,
        anguloVistoBajo,
        anguloVistoAlto,
        alturaTotal,
        formaFuste,
        dano,
        penetracion,
        };

        // Si estamos editando, pasamos el ID del individuo editado
        const esEdicion = !!individuoEditado;

        console.log("Guardando individuo:", datosIndividuo, "Es edición:", esEdicion);
        onConfirmar(datosIndividuo, esEdicion);
    };

    // Funciones para manejar la selección en los dropdowns
    const selectCondicionOption = (option) => {
        setCondicion(option);
        setShowCondicionDropdown(false);
    };

    const selectTalloOption = (option) => {
        setTallo(option);
        setShowTalloDropdown(false);
    };

    const selectFormaFusteOption = (option) => {
        setFormaFuste(option);
        setShowFormaFusteDropdown(false);
    };

    const selectDanoOption = (option) => {
        setDano(option);
        setShowDanoDropdown(false);
    };

    // Función para cerrar todos los dropdowns
    const closeAllDropdowns = () => {
        setShowCondicionDropdown(false);
        setShowTalloDropdown(false);
        setShowFormaFusteDropdown(false);
        setShowDanoDropdown(false);
    };

    return (
        <Modal 
        animationType="fade" 
        transparent={true} 
        visible={visible} 
        onRequestClose={onClose}
        >
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.centeredView}
        >
            <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={closeAllDropdowns}
            >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Registro del Individuo</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
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
                    {/* Fila 1 */}
                    <View style={styles.formRow}>
                    <View style={styles.formColumn}>
                        <Text style={styles.label}>*Tamaño del Individuo</Text>
                        <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={tamanoIndividuo}
                        editable={false}
                        placeholder="Calculado automáticamente"
                        />
                    </View>
                    <View style={styles.formColumn}>
                        <Text style={styles.label}>*Condición</Text>
                        <TouchableOpacity
                        style={styles.customSelect}
                        onPress={() => {
                            closeAllDropdowns();
                            setShowCondicionDropdown(!showCondicionDropdown);
                        }}
                        >
                        <Text>{condicion}</Text>
                        <Text style={styles.dropdownArrow}>▼</Text>
                        </TouchableOpacity>
                        {showCondicionDropdown && (
                        <View style={styles.dropdownMenu}>
                            {condicionOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.dropdownItem}
                                onPress={() => selectCondicionOption(option)}
                            >
                                <Text
                                style={[
                                    styles.dropdownItemText,
                                    condicion === option && styles.selectedOption,
                                ]}
                                >
                                {option}
                                </Text>
                            </TouchableOpacity>
                            ))}
                        </View>
                        )}
                    </View>
                    </View>

                    {/* Fila 2 */}
                    <View style={styles.formRow}>
                    <View style={styles.formColumn}>
                        <Text style={styles.label}>*Azimut (°)</Text>
                        <TextInput
                        style={[styles.input, errors.azimut && styles.inputError]}
                        value={azimut}
                        onChangeText={(text) => {
                            setAzimut(text);
                            if (text && text.trim()) {
                            setErrors(prev => ({...prev, azimut: false}));
                            }
                        }}
                        placeholder="0.0"
                        keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.formColumn}>
                        <Text style={styles.label}>*Distancia del centro (m)</Text>
                        <TextInput
                        style={[styles.input, errors.distanciaCentro && styles.inputError]}
                        value={distanciaCentro}
                        onChangeText={(text) => {
                            setDistanciaCentro(text);
                            if (text && text.trim()) {
                            setErrors(prev => ({...prev, distanciaCentro: false}));
                            }
                        }}
                        placeholder="0.0"
                        keyboardType="numeric"
                        />
                    </View>
                    </View>

                    {/* Fila 3 */}
                    <View style={styles.formRow}>
                    <View style={styles.formColumn}>
                        <Text style={styles.label}>*Tallo</Text>
                        <TouchableOpacity
                        style={styles.customSelect}
                        onPress={() => {
                            closeAllDropdowns();
                            setShowTalloDropdown(!showTalloDropdown);
                        }}
                        >
                        <Text>{tallo}</Text>
                        <Text style={styles.dropdownArrow}>▼</Text>
                        </TouchableOpacity>
                        {showTalloDropdown && (
                        <View style={styles.dropdownMenu}>
                            {talloOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.dropdownItem}
                                onPress={() => selectTalloOption(option)}
                            >
                                <Text
                                style={[
                                    styles.dropdownItemText,
                                    tallo === option && styles.selectedOption,
                                ]}
                                >
                                {option}
                                </Text>
                            </TouchableOpacity>
                            ))}
                        </View>
                        )}
                    </View>
                    <View style={styles.formColumn}>
                        <Text style={styles.label}>*Diámetro</Text>
                        <TextInput
                        style={[styles.input, errors.diametro && styles.inputError]}
                        value={diametro}
                        onChangeText={(text) => {
                            setDiametro(text);
                            if (text && text.trim()) {
                            setErrors(prev => ({...prev, diametro: false}));
                            }
                        }}
                        placeholder="0.0"
                        keyboardType="numeric"
                        />
                    </View>
                    </View>

                    {/* Fila 4 */}
                    <View style={styles.formRow}>
                    <View style={styles.formColumn}>
                        <Text style={styles.label}>*Distancia Horizontal</Text>
                        <TextInput
                        style={[styles.input, errors.distanciaHorizontal && styles.inputError]}
                        value={distanciaHorizontal}
                        onChangeText={(text) => {
                            setDistanciaHorizontal(text);
                            if (text && text.trim()) {
                            setErrors(prev => ({...prev, distanciaHorizontal: false}));
                            }
                        }}
                        placeholder="0.0"
                        keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.formColumn}>
                        <Text style={styles.label}>* Ángulo visto hacia abajo</Text>
                        <TextInput
                        style={[styles.input, errors.anguloVistoBajo && styles.inputError]}
                        value={anguloVistoBajo}
                        onChangeText={(text) => {
                            setAnguloVistoBajo(text);
                            if (text && text.trim()) {
                            setErrors(prev => ({...prev, anguloVistoBajo: false}));
                            }
                        }}
                        placeholder="0.0"
                        keyboardType="numeric"
                        />
                    </View>
                    </View>

                    {/* Fila 5 */}
                    <View style={styles.formRow}>
                    <View style={styles.formColumn}>
                        <Text style={styles.label}>* Ángulo visto hacia arriba</Text>
                        <TextInput
                        style={[styles.input, errors.anguloVistoAlto && styles.inputError]}
                        value={anguloVistoAlto}
                        onChangeText={(text) => {
                            setAnguloVistoAlto(text);
                            if (text && text.trim()) {
                            setErrors(prev => ({...prev, anguloVistoAlto: false}));
                            }
                        }}
                        placeholder="0.0"
                        keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.formColumn}>
                        <Text style={styles.label}>* Altura total</Text>
                        <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={alturaTotal}
                        editable={false}
                        placeholder="Calculado automáticamente"
                        />
                    </View>
                    </View>

                    {/* Fila 6 */}
                    <View style={styles.formRow}>
                    <View style={styles.formColumn}>
                        <Text style={styles.label}>* Forma del fuste</Text>
                        <TouchableOpacity
                        style={styles.customSelect}
                        onPress={() => {
                            closeAllDropdowns();
                            setShowFormaFusteDropdown(!showFormaFusteDropdown);
                        }}
                        >
                        <Text>{formaFuste}</Text>
                        <Text style={styles.dropdownArrow}>▼</Text>
                        </TouchableOpacity>
                        {showFormaFusteDropdown && (
                        <View style={styles.dropdownMenu}>
                            {formaFusteOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.dropdownItem}
                                onPress={() => selectFormaFusteOption(option)}
                            >
                                <Text
                                style={[
                                    styles.dropdownItemText,
                                    formaFuste === option && styles.selectedOption,
                                ]}
                                >
                                {option}
                                </Text>
                            </TouchableOpacity>
                            ))}
                        </View>
                        )}
                    </View>
                    <View style={styles.formColumn}>
                        <Text style={styles.label}>* Daño</Text>
                        <TouchableOpacity
                        style={styles.customSelect}
                        onPress={() => {
                            closeAllDropdowns();
                            setShowDanoDropdown(!showDanoDropdown);
                        }}
                        >
                        <Text>{dano}</Text>
                        <Text style={styles.dropdownArrow}>▼</Text>
                        </TouchableOpacity>
                        {showDanoDropdown && (
                        <View style={styles.dropdownMenu}>
                            {danoOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.dropdownItem}
                                onPress={() => selectDanoOption(option)}
                            >
                                <Text
                                style={[
                                    styles.dropdownItemText,
                                    dano === option && styles.selectedOption,
                                ]}
                                >
                                {option}
                                </Text>
                            </TouchableOpacity>
                            ))}
                        </View>
                        )}
                    </View>
                    </View>

                    {/* Fila 7 - Solo un campo */}
                    <View style={styles.formRowFull}>
                    <Text style={styles.label}>Penetración (cm)</Text>
                    <TextInput
                        style={[styles.input, errors.penetracion && styles.inputError]}
                        value={penetracion}
                        onChangeText={(text) => {
                        setPenetracion(text);
                        if (text && text.trim()) {
                            setErrors(prev => ({...prev, penetracion: false}));
                        }
                        }}
                        placeholder="0.0"
                        keyboardType="numeric"
                    />
                    </View>

                    <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={[
                        styles.hechoButton, 
                        !isFormValid && styles.hechoButtonDisabled
                        ]}
                        onPress={handleGuardar}
                        disabled={!isFormValid}
                    >
                        <Text 
                        style={[
                            styles.hechoButtonText,
                            !isFormValid && styles.hechoButtonTextDisabled
                        ]}
                        >
                        Hecho
                        </Text>
                    </TouchableOpacity>
                    </View>
                </View>
                </View>
            </ScrollView>
            </TouchableOpacity>
        </KeyboardAvoidingView>
        </Modal>
    );
    }

    const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        paddingBottom: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#666",
    },
    topInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    infoLabel: {
        fontWeight: "bold",
        marginRight: 5,
    },
    infoValue: {
        fontSize: 16,
    },
    formContainer: {
        width: "100%",
    },
    formRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    formRowFull: {
        marginBottom: 15,
    },
    formColumn: {
        width: "48%",
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    inputError: {
        borderColor: "red",
    },
    disabledInput: {
        backgroundColor: "#f0f0f0",
        color: "#666",
    },
    customSelect: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dropdownArrow: {
        fontSize: 12,
        color: "#666",
    },
    dropdownMenu: {
        position: "absolute",
        top: 65,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        zIndex: 1000,
        elevation: 5,
        maxHeight: 150,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    dropdownItemText: {
        fontSize: 14,
    },
    selectedOption: {
        fontWeight: "bold",
        color: "#2196F3",
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    hechoButton: {
        backgroundColor: "#4285F4",
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        alignItems: "center",
        width: "50%",
    },
    hechoButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    hechoButtonDisabled: {
        backgroundColor: "#cccccc",
    },
    hechoButtonTextDisabled: {
        color: "#888888",
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 2,
    },
    });