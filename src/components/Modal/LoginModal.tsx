import React, { useState, useEffect } from 'react';
import { useAppState } from '@states/app/app.state';
import { Alert, Modal, Image, StyleSheet, Text, TextInput, Pressable, View } from 'react-native';
import { pb } from 'src/services/pocketbase';

export const LoginModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  useEffect(() => {
    setModalVisible(true);
  }, []);

  const authenticateWithPocketBase = async () => {
    const { dispatch, setUser, setLoggedIn } = useAppState();
    if (isSignUp) {
      // Register (sign up)
      try {
        await pb.collection('users').create({ username, email, password, passwordConfirm });
        dispatch(setUser({ username, password }));
        dispatch(setLoggedIn(true)); //se cambia el state a loggeado
        Alert.alert('Registro exitoso');
      } catch (error) {
        console.error('Error during registration:', error);
        dispatch(setLoggedIn(false));
        Alert.alert('Error durante el registro');
      }
    } else {
      // Login (sign in)
      try {
        const authData = await pb.collection('users').authWithPassword(username, password); //ingresa datos para loggearse
        dispatch(setUser({ username, password }));
        dispatch(setLoggedIn(true)); //se cambia el state a logeado
        Alert.alert('Inicio de sesión exitoso');
        console.log('Auth Data:', authData);
      } catch (error) {
        console.error('Error during login:', error);
        dispatch(setLoggedIn(false));
        Alert.alert('Error durante el inicio de sesión');
      }
    }
  };

  const handleLogin = () => {
    authenticateWithPocketBase();
    setModalVisible(false);
  };

  const handleRegister = () => {
    authenticateWithPocketBase();
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
          <Image source={require('assets/images/alert.png')} style={{ height: 50, width: 50 }} />
          <Text style={styles.modalTitle}>¡Bienvenid@ a Tombo!</Text>
          <Text style={styles.modalSubtitle}>{isSignUp ? 'Regístrate' : 'Inicia sesión'}</Text>
          {!isSignUp && (
            <TextInput
              style={[styles.input, { width: 200 }]}
              placeholder="Correo Electrónico/Nombre de usuario"
              onChangeText={text => setUsername(text)}
            />
          )}
          {isSignUp && (
            <TextInput
              style={[styles.input, { width: 200 }]}
              placeholder="Nombre de usuario"
              onChangeText={text => setUsername(text)}
            />
          )}
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
              onChangeText={text => setPasswordConfirm(text)}
            />
          )}

          <Text style={styles.switchText}>
            {isSignUp ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}
            <Pressable onPress={() => toggleSignUp()}>
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
    marginTop: 20,
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
