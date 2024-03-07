import React from 'react';
import { Text, View, StyleSheet, StatusBar, Button } from 'react-native';
import { StackProps } from '@navigator/stack';
import { colors } from '@theme';
import pocketbase from 'src/services/pocketbase';

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
    height: 44,
    width: '50%',
    backgroundColor: colors.lightPurple,
  },
});

export default function Reports({ navigation }: StackProps) {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Button onPress={() => console.log('click')} title="Click me" />
      <Text style={styles.title}>Reportes</Text>
    </View>
  );
}
