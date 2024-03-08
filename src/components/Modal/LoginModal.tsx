import React, { useState, useEffect } from 'react';
import { Alert, Modal, Image, StyleSheet, Text, TextInput, Pressable, View } from 'react-native';

export const LoginModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setModalVisible(true);
  }, []);

  const handleLogin = () => {
    Alert.alert('Inicio de sesión exitoso');
    setModalVisible(false);
  };

  const handleRegister = () => {
    Alert.alert('Registro exitoso');
    setModalVisible(false);
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal cerrado.');
        setModalVisible(false);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Image source={require('assets/images/close.png')} style={{ height: 15, width: 15 }} />
          </Pressable>
          <Image source={require('assets/images/alert.png')} style={{ height: 70, width: 70 }} />
          <Text style={styles.modalTitle}>¡Bienvenid@ a Tombo!</Text>
          <Text style={styles.modalSubtitle}>{isSignUp ? 'Regístrate' : 'Inicia sesión'}</Text>
          <TextInput
            style={[styles.input, { width: 200 }]}
            placeholder="Nombre de usuario"
            onChangeText={text => setUsername(text)}
          />
          {isSignUp && (
            <TextInput
              style={[styles.input, { width: 200 }]}
              placeholder="Correo Electrónico"
              onChangeText={text => setEmail(text)}
            />
          )}
          <TextInput
            style={[styles.input, { width: 200 }]}
            placeholder="Contraseña"
            secureTextEntry
            onChangeText={text => setPassword(text)}
          />
          {isSignUp && (
            <TextInput
              style={[styles.input, { width: 200 }]}
              placeholder="Confirmar Contraseña"
              secureTextEntry
              onChangeText={text => setConfirmPassword(text)}
            />
          )}

          <Text style={styles.switchText}>
            {isSignUp ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}
            <Pressable onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={{ textDecorationLine: 'underline' }}>
                {isSignUp ? 'Inicia sesión' : 'Regístrate'}
              </Text>
            </Pressable>
          </Text>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.primaryButton]}
              onPress={isSignUp ? handleRegister : handleLogin}>
              <Text style={styles.buttonText}>{isSignUp ? 'Registrarse' : 'Ingresar'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#E2EAEA',
    height: 40,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  switchText: {
    marginBottom: 15,
    fontSize: 16,
    color: '#888',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
