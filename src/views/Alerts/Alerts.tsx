import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, StatusBar, ScrollView, Image } from 'react-native';
import { StackProps } from '@navigator/stack';
import { colors } from '@theme';
import { pb } from 'src/services/pocketbase';
import { ListResult, RecordModel } from 'pocketbase';
import { distanceBetweenCoordinates } from '@utils/geographic';
import Button from '@components/Button';

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.lightGrayPurple,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: 15,
  },
  alertCard: {
    borderWidth: 1.5,
    borderColor: colors.black,
    borderRadius: 8,
    width: '90%',
    marginBottom: 10,
    padding: 6,
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
    backgroundColor: colors.black,
  },
  scrollView: {
    height: '100%',
    width: '100%',
  },
  scrollViewContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function Alerts({ navigation }: StackProps) {
  const [reports, setReports] = useState<RecordModel[]>([]);

  useEffect(() => {
    pb.collection('users')
      .authWithPassword('paoloose', 'patito123')
      .then(async () => {
        const listeningLocations = await pb.collection('saved_locations').getFullList({
          filter: 'listening = true',
        });
        const reports = await pb.collection('reports').getList();
        setReports(
          reports.items.filter(report => {
            return listeningLocations.some(location => {
              const distance = distanceBetweenCoordinates(
                {
                  lat: report.lat,
                  lon: report.lon,
                },
                {
                  lat: location.lat,
                  lon: location.lon,
                },
              );
              return distance < 100; // 100 meters radius
            });
          }),
        );
      });
  }, []);

  useEffect(() => {
    console.log(
      { reports },
      reports.map(r => r.media),
    );
  }, [reports]);

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diff = now.getTime() - created.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years > 0) {
      return `Hace ${years} año${years > 1 ? 's' : ''}`;
    }
    if (months > 0) {
      return `Hace ${months} mese${months > 1 ? 's' : ''}`;
    }
    if (days > 0) {
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }
    if (hours > 0) {
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    }
    return `Hace ${seconds} segundo${seconds > 1 ? 's' : ''}`;
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Alertas en tiempo real</Text>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}>
        {reports.map(report => (
          <View key={report.id} style={styles.alertCard}>
            <Text>{getTimeAgo(report.created)}</Text>
            <Text>{report.description}</Text>
            <Text>{report.address_name}</Text>
            <Text>{report.event_type}</Text>
            <Text>{report.media}</Text>
            {report.media.map((file: string, index: number) => (
              <Image
                key={index}
                src={pb.files.getUrl(report, file)}
                // set fixed height and variable width
                style={{ height: 150, width: 'auto' }}
              />
            ))}
            <Text>{report.lat}</Text>
            <Text>{report.lon}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
