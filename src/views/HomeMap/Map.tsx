import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, Text } from 'react-native';
import { StackProps } from '@navigator/stack';
import { colors } from '@theme';
import MapView, { Marker, PROVIDER_GOOGLE, MapPressEvent, Callout } from 'react-native-maps';
import { useAppState } from 'src/states/app/app.state';
import { getAllReports, pb } from 'src/services/pocketbase';
import * as Location from 'expo-location';
import { MarkerIcon } from './markerIcon';
import { FontAwesome } from '@expo/vector-icons';

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

export default function HomeMap({ navigation, route }: StackProps) {
  const mapRef = React.createRef<MapView>();
  const focus = route.params?.focus;

  const { dispatch, foregroundLocation, setForegroundLocation, setSelectedLocation } =
    useAppState();
  const [eventMarker, setEventMarkers] = useState<EventMarkerType[]>();
  const [savedLocations, setSavedLocations] = useState<EventMarkerType[]>();

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
    pb.collection('users')
      .authWithPassword('paoloose', 'patito123')
      .then(async () => {
        const saved_locations = await pb.collection('saved_locations').getFullList();
        console.log('notifications: ', saved_locations);
        setSavedLocations(
          saved_locations.map(location => ({
            eventId: location.id,
            latitude: location.lat,
            longitude: location.lon,
            icon: 'dummy-icon',
            title: location.custom_name,
            description: location.address_name,
          })),
        );
      });
  }, []);

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
    console.log({ focus });
    mapRef.current?.animateCamera(
      {
        center: {
          latitude: focus?.lat ?? foregroundLocation?.latitude ?? LIMA_LATLNG.latitude,
          longitude: focus?.lon ?? foregroundLocation?.longitude ?? LIMA_LATLNG.longitude,
        },
        pitch: 0,
        heading: 0,
        altitude: 1000,
        zoom: 16,
      },
      { duration: 1000 },
    );
  }, [focus]);

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
    const interval = setInterval(refreshEventMarkers, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <MapView
        style={styles.map}
        ref={mapRef}
        mapType="terrain"
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
              <View>
                <Text>{marker.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
        {savedLocations?.map((marker, index) => (
          <Marker key={index} coordinate={marker} title="Ubicación guardada">
            <FontAwesome name="bookmark" size={24} color="black" />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}
