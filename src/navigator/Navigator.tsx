import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useAppState } from '@states/app/app.state';
import { IUser } from '@states/app/app.state.types';
import DrawerNavigator from './drawer';
import { loadImages, loadFonts } from '@theme';
import { useDataPersist, DataPersistKeys } from '@hooks';

// keep the splash screen visible while complete fetching resources
SplashScreen.preventAutoHideAsync();

function Navigator() {
  const { dispatch, isUserChecked, setUser, setLoggedIn } = useAppState();
  const { getPersistData } = useDataPersist();

  /**
   * This function preloads the app data in the splash initial screen
   */
  const preload = async () => {
    try {
      // preload assets
      await Promise.all([loadImages(), loadFonts()]);

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
