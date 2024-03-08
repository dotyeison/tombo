import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useAppState } from '@states/app/app.state';
import { IUser } from '@states/app/app.state.types';
import DrawerNavigator from './drawer';
import { LoginModal } from '../components/Modal/LoginModal';
import { loadImages, loadFonts } from '@theme';
import { useDataPersist, DataPersistKeys } from '@hooks';
import { Platform } from 'react-native';
import pocketbase from 'src/services/pocketbase';

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
const LOCATION_TASK_NAME = 'background-location-task';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

interface TaskManagerArgs {
  data: {
    locations: Location.LocationObject[];
  };
  error: TaskManager.TaskManagerError | null;
}

// keep the splash screen visible while complete fetching resources
SplashScreen.preventAutoHideAsync();

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants!.expoConfig!.extra!.eas.projectId,
    });
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token!.data;
}

function Navigator() {
  const {
    dispatch,
    isUserChecked,
    setUser,
    setLoggedIn,
    setCurrentLocation,
    setEventTypes,
    setExpoPushToken,
  } = useAppState();
  const { getPersistData } = useDataPersist();

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  /**
   * This function preloads the app data in the splash initial screen
   */
  const preload = async () => {
    try {
      // preload assets
      await Promise.all([loadImages(), loadFonts()]);

      // get current location
      const { status } = await Location.requestBackgroundPermissionsAsync();

      if (status !== 'granted') {
        return alert('Permission to access location was denied');
      }

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 0,
      });

      TaskManager.defineTask(
        LOCATION_TASK_NAME,
        async ({ data: { locations }, error }: TaskManagerArgs) => {
          if (error) {
            console.log('Error on background location task', error);
            return;
          }
          const latitude = locations[0].coords.latitude;
          const longitude = locations[0].coords.longitude;
          dispatch(
            setCurrentLocation({
              latitude,
              longitude,
            }),
          );
        },
      );

      // background task for subscribing to new reports
      // pocketbase.subscribeToReports();

      const rawEventTypes = await pocketbase.getEventTypes();
      dispatch(
        setEventTypes(
          rawEventTypes.items.reduce((acc, item) => ({ ...acc, [item.name]: item.id }), {}),
        ),
      );

      // register for push notifications

      const pushToken = await registerForPushNotificationsAsync();
      // @ts-ignore
      dispatch(setExpoPushToken(pushToken));

      console.log(pushToken);

      // @ts-ignore
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        // @ts-ignore
        setNotification(notification);
      });

      // @ts-ignore
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });

      // check if we have user in cache
      const user = await getPersistData<IUser>(DataPersistKeys.USER);
      dispatch(setUser(user));
      dispatch(setLoggedIn(true));

      return () => {
        // @ts-ignore
        Notifications.removeNotificationSubscription(notificationListener.current);
        // @ts-ignore
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    } catch {
      console.log('[##] no user found in cache');
      dispatch(setLoggedIn(false));
    } finally {
      SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    // ran once on app start
    preload();
  }, []);

  return (
    isUserChecked && (
      <NavigationContainer>
        <LoginModal />
        <DrawerNavigator />
      </NavigationContainer>
    )
  );
}

export default Navigator;
