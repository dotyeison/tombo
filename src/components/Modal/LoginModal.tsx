import React, { useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, Pressable, View } from 'react-native';

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
            <Text style={styles.closeButtonText}>X</Text>
          </Pressable>
          <Text style={styles.modalTitle}>¡Bienvenido a Tombo!</Text>
          <Text style={styles.modalSubtitle}>{isSignUp ? 'Regístrate' : 'Inicia sesión'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            onChangeText={text => setUsername(text)}
          />
          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Correo Electrónico"
              onChangeText={text => setEmail(text)}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            onChangeText={text => setPassword(text)}
          />
          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Confirmar Contraseña"
              secureTextEntry
              onChangeText={text => setConfirmPassword(text)}
            />
          )}
          <Text style={styles.switchText}>
            {isSignUp
              ? '¿Ya tienes una cuenta? Inicia sesión'
              : '¿No tienes una cuenta? Regístrate'}
          </Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.primaryButton]}
              onPress={isSignUp ? handleRegister : handleLogin}>
              <Text style={styles.buttonText}>{isSignUp ? 'Registrarse' : 'Ingresar'}</Text>
            </Pressable>
            <Pressable style={styles.textLink} onPress={toggleSignUp}>
              <Text style={styles.buttonText}>
                {isSignUp ? 'Ir a Iniciar sesión' : 'Ir a Registrarse'}
              </Text>
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
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  openButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#F194FF',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
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
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
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
    backgroundColor: '#2196F3',
  },
  textLink: {
    textDecorationLine: 'underline',
  },
});
