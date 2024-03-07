import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useAppState } from '@states/app/app.state';
import { IUser } from '@states/app/app.state.types';
import DrawerNavigator from './drawer';
import { loadImages, loadFonts } from '@theme';
import { useDataPersist, DataPersistKeys } from '@hooks';

import * as Location from 'expo-location';
import reverseGeocode from '@utils/reverseGeocode';

// keep the splash screen visible while complete fetching resources
SplashScreen.preventAutoHideAsync();

function Navigator() {
  const { dispatch, isUserChecked, setUser, setLoggedIn, setCurrentLocation } = useAppState();
  const { getPersistData } = useDataPersist();

  /**
   * This function preloads the app data in the splash initial screen
   */
  const preload = async () => {
    try {
      // preload assets
      await Promise.all([loadImages(), loadFonts()]);

      // get current location
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        return alert('Permission to access location was denied');
      }

      const location = await Location.getCurrentPositionAsync({});

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const place_name = await reverseGeocode({ latitude, longitude });

      dispatch(
        setCurrentLocation({
          latitude,
          longitude,
          place_name,
        }),
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
        <DrawerNavigator />
      </NavigationContainer>
    )
  );
}

export default Navigator;
