import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import PocketBase from 'pocketbase';

interface NotificationProps {
  id: any;
  title: string;
  message: string;
  timestamp: string;
  isSubscribed: boolean;
}

interface NotificationListProps {
  notifications: NotificationProps[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  const pb = new PocketBase('https://dotyeison.paoloose.site');

  const updateRecord = async (isSubscribed: boolean, record_id: any) => {
    try {
      const record = await pb.collection('saved_locations').update(record_id, {
        isSubscribed: !isSubscribed,
      });
      // Handle the updated record if needed
      console.log('Record updated:', record);
    } catch (error) {
      // Handle the error
      console.error('Error updating record:', error);
    }
  };

  const [isEnabled, setIsEnabled] = useState<boolean[]>(
    notifications.map(noification => noification.isSubscribed),
  );

  const toggleNotification = (index: number, record_id: any) => {
    setIsEnabled(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
    updateRecord(isEnabled[index], record_id);
  };

  return (
    <View style={styles.container}>
      {notifications.map((notification, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{notification.title}</Text>
          </View>
          <>
            <Text style={styles.message}>{notification.message}</Text>
            <Text style={styles.timestamp}>{notification.timestamp}</Text>
          </>
          <View style={styles.bottom}>
            <Text style={styles.bottomText}>Abrir en el mapa</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={styles.bottomText}>Recibir alertas</Text>
              <Switch
                trackColor={{ true: 'grey' }}
                thumbColor={isEnabled[index] ? '#ff5757' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                style={styles.switch}
                value={isEnabled[index]}
                onValueChange={() => toggleNotification(index, notification.id)}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 20,
    paddingBottom: 0,
  },
  card: {
    minWidth: '97%',
    maxWidth: '97%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 8,
    padding: 20,
    paddingBottom: 10,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  switch: {
    alignSelf: 'flex-start',
    marginTop: -2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  bottomText: {
    color: '#555',
    fontSize: 14,
    marginTop: 10,
    fontWeight: 'bold',
  },
  bottom: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 0,
  },
});

export default NotificationList;
