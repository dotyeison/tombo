import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@theme';
import NotificationList from './NotificationList';
import pocketbase from 'src/services/pocketbase';
import PocketBase from 'pocketbase';
const pb = new PocketBase('https://dotyeison.paoloose.site');

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrayPurple,
  },
});

const notifications = async () => {
  const res = await pb.collection('saved_locations').authWithPassword('paoloose', 'patito123');
  return res;
};

console.log('notifications:', notifications);

export default function SavedUbications() {
  return (
    <View style={styles.root}>
      <></>
    </View>
  );
}
