import React from 'react';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from '@navigator/tab/Tab';
import { DrawerParamList } from './Drawer.types';

const Drawer = createDrawerNavigator<DrawerParamList>();

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

// A 'drawer' is that toggable app sidebar
const DrawerContent = () => (
  <SafeAreaView>
    <View style={styles.root}>
      <Text>Side Menu Contents</Text>
    </View>
  </SafeAreaView>
);

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="MainDrawer"
      screenOptions={{ headerShown: false }}
      drawerContent={DrawerContent}>
      <Drawer.Screen name="MainDrawer" component={TabNavigator} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
