import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '@theme';
import NotificationList from './NotificationList';
import { StackProps } from '@navigator/stack';

export default function SavedUbications({ navigation }: StackProps) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Ubicaciones guardadas</Text>
      <NotificationList navigation={navigation} route={69 as any} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrayPurple,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: 75,
    fontWeight: '700',
  },
});
