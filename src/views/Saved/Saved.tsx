import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@theme';
import NotificationList from './NotificationList';
import { StackProps } from '@navigator/stack';
import { RecordModel } from 'pocketbase';
import { pb } from 'src/services/pocketbase';

export default function SavedUbications({ navigation }: StackProps) {
  const [notifications, setNotifications] = useState<RecordModel[]>([]);

  useEffect(() => {
    pb.collection('users')
      .authWithPassword('paoloose', 'patito123')
      .then(async () => {
        const saved_locations = await pb.collection('saved_locations').getFullList();
        console.log(saved_locations);
        setNotifications(saved_locations);
      });
  }, []);

  return (
    <View style={styles.root}>
      <NotificationList notifications={notifications} />
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
