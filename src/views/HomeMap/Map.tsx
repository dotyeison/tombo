import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, Image, Text } from 'react-native';
import { StackProps } from '@navigator/stack';
import { colors } from '@theme';
import MapView, { Marker, PROVIDER_GOOGLE, MapPressEvent, Callout } from 'react-native-maps';
import { useAppState } from 'src/states/app/app.state';
import { getAllReports } from 'src/services/pocketbase';
import * as Location from 'expo-location';
import { MarkerIcon } from './markerIcon';
import { iconsMap } from './icons';

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

interface EventMarkerType {
  eventId: string;
  latitude: number;
  longitude: number;
  icon: string;
  title: string;
  description: string;
}

const LIMA_LATLNG = {
  latitude: -12.0624831,
  longitude: -76.9901451,
};

export default function HomeMap({ navigation }: StackProps) {
  const { dispatch, foregroundLocation, setForegroundLocation, setSelectedLocation } =
    useAppState();
  const [eventMarker, setEventMarkers] = useState<EventMarkerType[]>();

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

  const refreshEventMarkers = async () => {
    const reports = await getAllReports();
    const newMarkers = reports.map(report => {
      return {
        latitude: report.lat,
        longitude: report.lon,
        eventId: report.id,
        description: report.description,
        icon: report.expand!.event_type.icon_route,
        title: report.expand!.event_type.name,
      } satisfies EventMarkerType;
    });

    if (eventMarker?.length !== newMarkers.length) {
      setEventMarkers(newMarkers);
    }
  };

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(status => {
      Location.watchPositionAsync({ accuracy: Location.Accuracy.High }, location => {
        dispatch(
          setForegroundLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }),
        );
      });
    });

    refreshEventMarkers();
    const interval = setInterval(refreshEventMarkers, 2000);
    return () => clearInterval(interval);
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
          <Marker coordinate={foregroundLocation} title="Estás aquí">
            <MarkerIcon />
          </Marker>
        )}
        {eventMarker?.map((marker, index) => (
          <Marker key={index} coordinate={marker} title="Alerta">
            <Callout>
              <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{marker.title}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}
