import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@theme';
import NotificationList from './NotificationList';
import { StackProps } from '@navigator/stack';

export default function SavedUbications({ navigation }: StackProps) {
  return (
    <View style={styles.root}>
      <NotificationList />
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
});
