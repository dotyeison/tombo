import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useAppState } from '@states/app/app.state';
import { IUser } from '@states/app/app.state.types';
import DrawerNavigator from './drawer';
import { LoginModal } from '../components/Modal/LoginModal';
import { loadImages, loadFonts } from '@theme';
import { useDataPersist, DataPersistKeys } from '@hooks';
import pocketbase from 'src/services/pocketbase';

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
const LOCATION_TASK_NAME = 'background-location-task';

interface TaskManagerArgs {
  data: {
    locations: Location.LocationObject[];
  };
  error: TaskManager.TaskManagerError | null;
}

// keep the splash screen visible while complete fetching resources
SplashScreen.preventAutoHideAsync();

function Navigator() {
  const { dispatch, isUserChecked, setUser, setLoggedIn, setCurrentLocation, setEventTypes } =
    useAppState();
  const { getPersistData } = useDataPersist();

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

      const rawEventTypes = await pocketbase.getEventTypes();
      dispatch(
        setEventTypes(
          rawEventTypes.items.reduce((acc, item) => ({ ...acc, [item.name]: item.id }), {}),
        ),
      );

      // check if we have user in cache
      const user = await getPersistData<IUser>(DataPersistKeys.USER);
      dispatch(setUser(user));
      dispatch(setLoggedIn(true));
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
