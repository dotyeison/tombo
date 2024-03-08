import React, { useState, useMemo, useEffect } from 'react';
import { Image, Pressable, Text, View, StyleSheet, StatusBar, Button } from 'react-native';
import { StackProps } from '@navigator/stack';
import { colors } from '@theme';
import { useAppState } from 'src/states/app/app.state';
import reverseGeocode from '@utils/reverseGeocode';
import { ImagePickerResponse, launchCamera } from 'react-native-image-picker';
import { TextInput } from 'react-native-gesture-handler';
import { SelectList } from 'react-native-dropdown-select-list';
import pocketbase from 'src/services/pocketbase';

interface Location {
  latitude?: number;
  longitude?: number;
  placeName?: string;
}

export default function Reports({ navigation }: StackProps) {
  const { currentLocation, eventTypes } = useAppState();
  const [eventType, setEventType] = useState('');
  const [location, setLocation] = useState<Location>({});
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<ImagePickerResponse>();

  useEffect(() => {
    const getNamePlace = async () => {
      if (location) {
        const placeName = await reverseGeocode(currentLocation!);
        setLocation({
          latitude: currentLocation?.latitude,
          longitude: currentLocation?.longitude,
          placeName,
        });
      }
    };
    getNamePlace();
  }, []);

  const handleSendReport = async () => {
    const report = {
      description,
      eventType,
      latitude: location.latitude,
      longitude: location.longitude,
      placeName: location.placeName,
      media,
    };

    await pocketbase.sendReport(report);
  };

  const handleOpenCamera = async () => {
    const result = await launchCamera({ mediaType: 'photo' });
    if (result) {
      setMedia(result);
    }
  };

  const test = async () => {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { someData: 'goes here' },
    };

    console.log({ message });
    console.log(`sending push notification with token ${expoPushToken}`);

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    console.log('push notification sent');
  };

  return (
    <View style={styles.root}>
      <Text style={styles.modalTitle}>Reporte de Alerta</Text>

      <Text style={styles.labelInput}>Tipo de Evento</Text>
      <StatusBar barStyle="light-content" />
      <SelectList
        setSelected={(value: string) => setEventType(value)}
        data={Array.from(Object.keys(eventTypes))}
      />
      <Text style={styles.labelInput}>Dirección</Text>
      <TextInput
        style={[styles.input, { width: '80%' }]}
        // onChangeText={text => setAddress(text)}
        placeholder="Ejemplo: Calle Las Flores 224, San Isidro"
      />

      <Text style={styles.labelInput}>Descripción</Text>
      <TextInput
        style={[styles.input, { width: '80%' }]}
        onChangeText={text => setDescription(text)}
        placeholder="Ingresar una descripción"
      />
      <Pressable style={styles.botonEnviar} /*onPress={}*/>
        <Text style={styles.buttonText}>ENVIAR</Text>
      </Pressable>
      <Pressable>
        <Image
          source={require('@assets/images/microphone.png')}
          style={{ height: 65, width: 65, marginTop: 40 }}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightGrayPurple',
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  labelInput: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    width: '80%',
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botonEnviar: {
    marginTop: 20,
    width: '80%',
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/* return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SelectList
        setSelected={(value: string) => setEventType(value)}
        data={Array.from(Object.keys(eventTypes))}
      />
      <View />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '80%' }}
        onChangeText={text => setDescription(text)}
        placeholder="Descripción"
        value={description}
      />
      <Button onPress={test} title="teeeest" />
      <Text style={styles.title}>Reportes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrayPurple,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonTitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    height: 44,
    width: '50%',
    backgroundColor: colors.lightPurple,
  },
});
*/
