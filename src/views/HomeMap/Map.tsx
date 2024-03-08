import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { StackProps } from '@navigator/stack';
import { colors } from '@theme';
import MapView, { Marker, PROVIDER_GOOGLE, MapPressEvent } from 'react-native-maps';
import { useAppState } from 'src/states/app/app.state';
import { getAllReports } from 'src/services/pocketbase';
import * as Location from 'expo-location';
import { MarkerIcon } from './markerIcon';

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

interface MarkerType {
  latitude: number;
  longitude: number;
}

const LIMA_LATLNG = {
  latitude: -12.0624831,
  longitude: -76.9901451,
};

export default function HomeMap({ navigation }: StackProps) {
  const { dispatch, foregroundLocation, setForegroundLocation, setSelectedLocation } =
    useAppState();
  const [markers, setMarkers] = useState<MarkerType[]>();

  const onLocationSelect = async (event: MapPressEvent) => {
    const latitude = event.nativeEvent.coordinate.latitude;
    const longitude = event.nativeEvent.coordinate.longitude;

    dispatch(
      setSelectedLocation({
        latitude,
        longitude,
      }),
    );
  };

  const initialCamera = {
    center: foregroundLocation ?? LIMA_LATLNG,
    pitch: 0,
    heading: 0,
    altitude: 1000,
    zoom: 12,
  };

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(status => {
      Location.watchPositionAsync({ accuracy: Location.Accuracy.High }, location => {
        setForegroundLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      });
    });

    getAllReports().then(reports => {
      const markers = reports.map(report => {
        return {
          latitude: report.lat,
          longitude: report.lon,
        };
      });
      setMarkers(markers);
    });
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <MapView
        style={styles.map}
        mapType="standard"
        initialCamera={initialCamera}
        provider={PROVIDER_GOOGLE}
        onPress={onLocationSelect}>
        {foregroundLocation && (
          <Marker coordinate={foregroundLocation} title="Your Location" description="You are here!">
            <MarkerIcon />
          </Marker>
        )}
      </MapView>
    </View>
  );
}
