import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { pb } from 'src/services/pocketbase';
import { getCoordinatesFromLocation } from 'src/utils/geocode';

const RegisterPlaceModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [placeDirection, setPlaceDirection] = useState('');

  const handleSubmit = async () => {
    // Implement your logic to register the place here
    console.log('Place Name:', placeName);
    console.log('Place Direction:', placeDirection);

    const coords = await getCoordinatesFromLocation(placeDirection);

    const record = await pb.collection('saved_locations').create({
      user: pb.authStore.model?.id,
      custom_name: placeName,
      address_name: placeDirection,
      listening: true,
      lat: coords?.latitude,
      lon: coords?.longitude,
    });

    // Reset input fields and close the modal
    setPlaceName('');
    setPlaceDirection('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.openModalButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.openModalButtonText}>Agregar Lugar</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar lugar</Text>
            <Text style={styles.label}>Nombre</Text>
            <TextInput style={styles.input} value={placeName} onChangeText={setPlaceName} />
            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              value={placeDirection}
              onChangeText={setPlaceDirection}
            />
            <TouchableOpacity style={styles.mapButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Seleccionar en el mapa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', // Align items to the left
    paddingHorizontal: 8, // Add horizontal padding
    maxHeight: '10%', // Add a top padding
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    minWidth: '95%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#ff5757',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  mapButton: {
    backgroundColor: '#ff5757',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  openModalButton: {
    backgroundColor: '#ff5757',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  openModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RegisterPlaceModal;
