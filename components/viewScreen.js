import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Checkbox } from 'react-native-paper';

const VisualizarTab = ({ onConfirm }) => {
  // Estado para los checkboxes - ninguno seleccionado por defecto
  const [checkedItems, setCheckedItems] = useState({
    latizales: false,
    brinzales: false,
    fustales: false,
    fustalesGrandes: false,
  });

  // Estado para la subparcela seleccionada - ninguna seleccionada por defecto
  const [selectedSubparcela, setSelectedSubparcela] = useState(null);
  
  // Estado para mostrar u ocultar el modal
  const [modalVisible, setModalVisible] = useState(false);
  
  // Datos de ejemplo para la subparcela seleccionada
  const subparcelaData = {
    id: selectedSubparcela,
    longitud: '42.194º',
    latitud: '11.278º',
    error: '9',
    cobertura: [
      { tipo: 'Arbustal', valor: '12' },
      { tipo: 'Pastizal', valor: '0' },
      { tipo: 'Suelo desnudo', valor: '0' }
    ],
    alteracion: [
      { tipo: 'Extracción de especies leñosas', severidad: 'Mediana' },
      { tipo: 'Deforestación', severidad: 'Mayor' }
    ]
  };

  // Función para manejar cambios en los checkboxes
  const handleCheckboxChange = (key) => {
    setCheckedItems({
      ...checkedItems,
      [key]: !checkedItems[key],
    });
  };

  // Función para manejar el botón de confirmar
  const confirmar = () => {
    // Filtra solo los checkbox marcados
    const checkedItemsOnly = Object.keys(checkedItems).reduce((acc, key) => {
      if (checkedItems[key]) {
        acc[key] = true;
      }
      return acc;
    }, {});
    
    if (onConfirm && Object.keys(checkedItemsOnly).length > 0) {
      onConfirm({
        checkedItems: checkedItemsOnly,
      });
    }
  };

  // Función para abrir el modal de una subparcela
  const openSubparcelaModal = (id) => {
    setSelectedSubparcela(id);
    setModalVisible(true);
  };

  // Renderiza un checkbox con su etiqueta
  const renderCheckbox = (key, label) => (
    <View style={styles.checkboxContainer}>
      <Checkbox
        status={checkedItems[key] ? 'checked' : 'unchecked'}
        onPress={() => handleCheckboxChange(key)}
        color="#4285F4"
      />
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  );

  // Renderiza un botón de subparcela (ahora todos blancos)
  const renderSubparcelaButton = (id) => {
    return (
      <TouchableOpacity
        style={styles.subparcelaButton}
        onPress={() => openSubparcelaModal(id)}
      >
        <Text style={styles.subparcelaButtonText}>{id}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Título principal */}
      <Text style={styles.title}>Visualizar</Text>

      {/* Sección de árboles en el mapa */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Árboles en el mapa</Text>
        <View style={styles.checkboxGrid}>
          <View style={styles.checkboxRow}>
            {renderCheckbox('latizales', 'Latizales')}
            {renderCheckbox('brinzales', 'Brinzales')}
          </View>
          <View style={styles.checkboxRow}>
            {renderCheckbox('fustales', 'Fustales')}
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={checkedItems.fustalesGrandes ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChange('fustalesGrandes')}
                color="#4285F4"
              />
              <View>
                <Text style={styles.checkboxLabel}>Fustales</Text>
                <Text style={styles.checkboxLabel}>Grandes</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Botón Aplicar (ahora entre las dos secciones) */}
      <TouchableOpacity 
        style={styles.aplicarButton}
        onPress={confirmar}
      >
        <Text style={styles.aplicarButtonText}>Aplicar</Text>
      </TouchableOpacity>

      {/* Sección de información de subparcelas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de las subparcelas</Text>
        <View style={styles.subparcelaRows}>
          <View style={styles.subparcelaRow}>
            {renderSubparcelaButton('SPF-1')}
            {renderSubparcelaButton('SPF-2')}
            {renderSubparcelaButton('SPF-3')}
          </View>
          <View style={styles.subparcelaRow}>
            {renderSubparcelaButton('SPF-4')}
            {renderSubparcelaButton('SPF-5')}
          </View>
        </View>
      </View>
      
      {/* Modal para mostrar características de la subparcela */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Características de la {selectedSubparcela}</Text>
            
            {/* Datos de coordenadas */}
            <View style={styles.modalRow}>
              <View style={styles.modalColumn}>
                <Text style={styles.modalLabel}>ID</Text>
                <View style={styles.modalField}>
                  <Text>{subparcelaData.id}</Text>
                </View>
              </View>
              <View style={styles.modalColumn}>
                <Text style={styles.modalLabel}>Longitud</Text>
                <View style={styles.modalField}>
                  <Text>{subparcelaData.longitud}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.modalRow}>
              <View style={styles.modalColumn}>
                <Text style={styles.modalLabel}>Latitud</Text>
                <View style={styles.modalField}>
                  <Text>{subparcelaData.latitud}</Text>
                </View>
              </View>
              <View style={styles.modalColumn}>
                <Text style={styles.modalLabel}>Error en la medición (m)</Text>
                <View style={styles.modalField}>
                  <Text>{subparcelaData.error}</Text>
                </View>
              </View>
            </View>
            
            {/* Tablas de cobertura y alteración */}
            <View style={styles.modalTableContainer}>
              <View style={styles.modalTable}>
                <View style={styles.modalTableHeader}>
                  <Text style={styles.modalTableHeaderText}>Cobertura</Text>
                  <Text style={styles.modalTableHeaderText}>%</Text>
                </View>
                {subparcelaData.cobertura.map((item, index) => (
                  <View key={index} style={styles.modalTableRow}>
                    <Text style={styles.modalTableCell}>{item.tipo}</Text>
                    <Text style={styles.modalTableCell}>{item.valor}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.modalTable}>
                <View style={styles.modalTableHeader}>
                  <Text style={styles.modalTableHeaderText}>Alteración</Text>
                  <Text style={styles.modalTableHeaderText}>Severidad</Text>
                </View>
                {subparcelaData.alteracion.map((item, index) => (
                  <View key={index} style={styles.modalTableRow}>
                    <Text style={[styles.modalTableCell, { fontSize: 12 }]}>{item.tipo}</Text>
                    <Text style={styles.modalTableCell}>{item.severidad}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Botón de cerrar */}
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  section: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  checkboxGrid: {
    flexDirection: 'column',
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  subparcelaRows: {
    flexDirection: 'column',
    gap: 12,
  },
  subparcelaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  subparcelaButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    minWidth: 80,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  subparcelaButtonText: {
    fontWeight: '500',
  },
  aplicarButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginVertical: 20,
  },
  aplicarButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '90%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  modalLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  modalField: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#eaeaea',
    padding: 8,
    borderRadius: 4,
  },
  modalTableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  modalTable: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalTableHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalTableHeaderText: {
    flex: 1,
    padding: 6,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTableCell: {
    flex: 1,
    padding: 6,
    textAlign: 'center',
    fontSize: 13,
  },
  closeButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default VisualizarTab;