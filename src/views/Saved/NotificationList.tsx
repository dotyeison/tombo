import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import { RecordModel } from 'pocketbase';
import { Ionicons } from '@expo/vector-icons';
import RegisterPlaceModal from 'src/components/Modal/SavePlaceModal';
import { pb } from 'src/services/pocketbase';
import { StackProps } from '@navigator';

const NotificationList = ({ navigation }: StackProps) => {
  const [notifications, setNotifications] = useState<RecordModel[]>([]);

  useEffect(() => {
    pb.collection('users')
      .authWithPassword('paoloose', 'patito123')
      .then(async () => {
        const saved_locations = await pb.collection('saved_locations').getFullList();
        console.log('notifications: ', saved_locations);
        setNotifications(saved_locations);
      });
  }, []);

  const updateRecord = async (listening: boolean, record_id: any) => {
    try {
      const record = await pb.collection('saved_locations').update(record_id, {
        listening: !listening,
      });
      const updatedRecord = await pb.collection('saved_locations').getFullList();
      setNotifications(updatedRecord);
      // Handle the updated record if needed
      console.log('Record updated:', record);
    } catch (error) {
      // Handle the error
      console.error('Error updating record:', error);
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    pb.collection('saved_locations').delete(id);
  };

  return (
    <View>
      <RegisterPlaceModal />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent}>
        {notifications.map((notification, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{notification.custom_name}</Text>
              <TouchableOpacity onPress={() => deleteNotification(notification.id)}>
                <Ionicons name="close-circle" size={24} color="red" />
              </TouchableOpacity>
            </View>
            <>
              <Text style={styles.message}>{notification.address_name}</Text>
              <Text style={styles.timestamp}>{notification.created}</Text>
            </>
            <View style={styles.bottom}>
              <TouchableHighlight
                onPress={() => {
                  navigation.navigate('MapStack', {
                    focus: {
                      lat: notification.lat,
                      lon: notification.lon,
                    },
                  });
                }}>
                <Text style={styles.bottomText}>Abrir en el mapa</Text>
              </TouchableHighlight>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={styles.bottomText}>Recibir alertas</Text>
                <Switch
                  trackColor={{ true: 'grey' }}
                  thumbColor={notification.listening ? '#ff5757' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  style={styles.switch}
                  value={notification.listening}
                  onValueChange={() => updateRecord(notification.listening, notification.id)}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingTop: '1%',
    paddingBottom: '5%',
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
    marginBottom: 10,
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
