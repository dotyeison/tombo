import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { StackProps } from '@navigator/stack';
import { colors } from '@theme';
import MapView, { Marker, PROVIDER_GOOGLE, MapPressEvent } from 'react-native-maps';
import { useDispatch } from 'react-redux';
import { useAppState } from 'src/states/app/app.state';
import reverseGeocode from '@utils/reverseGeocode';

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
    backgroundColor: colors.lightPurple,
    height: 44,
    width: '50%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default function HomeMap({ navigation }: StackProps) {
  const { dispatch, setSelectedLocation } = useAppState();

  const onLocationSelect = async (event: MapPressEvent) => {
    const latitude = event.nativeEvent.coordinate.latitude;
    const longitude = event.nativeEvent.coordinate.longitude;
    const place_name = await reverseGeocode({ latitude, longitude });

    dispatch(
      setSelectedLocation({
        latitude,
        longitude,
        place_name,
      }),
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <MapView
        style={styles.map}
        mapType="standard"
        provider={PROVIDER_GOOGLE}
        onPress={onLocationSelect}>
        <Marker
          description="Delivery person 1"
          coordinate={{
            latitude: -12.0624831,
            longitude: -76.9901451,
          }}
          image={require('@assets/images/gun.png')}
        />
      </MapView>
    </View>
  );
}
