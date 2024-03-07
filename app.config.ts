import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config: expoConfig }: ConfigContext): ExpoConfig => {
  let name = '';
  let slug = '';
  let projectId = '';
  let ios = { bundleIdentifier: '', buildNumber: '' };
  let android = { package: '', versionCode: 1 };

  /**
   * dev configuration
   */
  function setDevConfig() {
    name = `DEV - ${expoConfig.name}`;
    slug = 'dotyeison';
    projectId = '7dfd2550-efeb-4d78-bef1-7cf03e0867a5';
    ios = {
      bundleIdentifier: 'com.watarumaeda.react-native-boilerplate-dev',
      buildNumber: '1.0.0',
    };
    android = {
      package: 'com.watarumaeda.react_native_boilerplate.dev',
      versionCode: 1,
    };
  }

  /**
   * prod configuration
   */
  function setProdConfig() {
    name = expoConfig.name ?? '';
    slug = 'dotyeison';
    projectId = '7dfd2550-efeb-4d78-bef1-7cf03e0867a5';
    ios = {
      bundleIdentifier: 'com.watarumaeda.react-native-boilerplate',
      buildNumber: '1.0.0',
    };
    android = {
      package: 'com.watarumaeda.react_native_boilerplate',
      versionCode: 1,
    };
  }

  // switch expo configuration based on environment
  const targetEnv = process.env.NODE_ENV ?? 'development';
  if (targetEnv === 'production') setProdConfig();
  else setDevConfig();

  const envConfig: ExpoConfig = {
    ...expoConfig,
    name,
    slug,
    updates: {
      url: `https://u.expo.dev/${projectId}`,
    },
    ios: {
      ...expoConfig.ios,
      ...ios,
    },
    android: {
      ...expoConfig.android,
      ...android,
    },
    extra: {
      ...expoConfig.extra,
      eas: { projectId },
    },
  };

  // console.log('[##] your expo config', envConfig);

  return envConfig;
};
