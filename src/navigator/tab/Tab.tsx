import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '@theme';
import { TabParamList, TabBarStatus } from './Tab.types';
import { MapStackNavigator, AlertsStackNavigator, ReportsStackNavigator } from '../stack/Stack';

const Tab = createBottomTabNavigator<TabParamList>();

const renderTabBarIcon = (tabName: keyof TabParamList) => (tabStatus: TabBarStatus) => {
  switch (tabName) {
    case 'MapTab':
      return <AntDesign name="earth" size={24} color={tabStatus.color} />;
    case 'AlertsTab':
      return <AntDesign name="bells" size={24} color={tabStatus.color} />;
    case 'ReportTab':
      return <AntDesign name="addfile" size={24} color={tabStatus.color} />;
  }
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: renderTabBarIcon(route.name),
        headerShown: false,
        tabBarStyle: { height: 55, paddingBottom: 5 },
        tabBarInactiveTintColor: colors.gray,
        tabBarInactiveBackgroundColor: colors.white,
        tabBarActiveTintColor: colors.black,
        tabBarActiveBackgroundColor: colors.white,
      })}>
      <Tab.Screen
        name="MapTab"
        component={MapStackNavigator as any}
        options={{ title: 'Explorar' }}
      />
      <Tab.Screen
        name="AlertsTab"
        component={AlertsStackNavigator as any}
        options={{ title: 'Alertas' }}
      />
      <Tab.Screen
        name="ReportTab"
        component={ReportsStackNavigator as any}
        options={{ title: 'Reportar' }}
      />
    </Tab.Navigator>
  );
}
