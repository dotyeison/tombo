import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { RecordModel } from 'pocketbase';
import { pb } from 'src/services/pocketbase';

interface NotificationListProps {
  notifications: RecordModel[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  const [saved, setSaved] = useState<RecordModel[]>(notifications);
  const updateRecord = async (listening: boolean, record_id: any) => {
    try {
      const record = await pb.collection('saved_locations').update(record_id, {
        listening: !listening,
      });
      const updatedRecord = await pb.collection('saved_locations').getFullList();
      setSaved(updatedRecord);
      // Handle the updated record if needed
      console.log('Record updated:', record);
    } catch (error) {
      // Handle the error
      console.error('Error updating record:', error);
    }
  };

  return (
    <View style={styles.container}>
      {notifications.map((notification, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{notification.custom_name}</Text>
          </View>
          <>
            <Text style={styles.message}>{notification.address_name}</Text>
            <Text style={styles.timestamp}>{notification.created}</Text>
          </>
          <View style={styles.bottom}>
            <Text style={styles.bottomText}>Abrir en el mapa</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={styles.bottomText}>Recibir alertas</Text>
              <Switch
                trackColor={{ true: 'grey' }}
                thumbColor={saved[index].listening ? '#ff5757' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                style={styles.switch}
                value={saved[index].listening}
                onValueChange={() => updateRecord(saved[index].listening, notification.id)}
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
