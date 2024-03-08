import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { StackProps } from '@navigator/stack';
import { colors } from '@theme';
import { getAllReports, pb } from 'src/services/pocketbase';
import { distanceBetweenCoordinates } from '@utils/geographic';
import { AlertItem, IAlertReportData } from './AlertItem';
import ImageView from 'react-native-image-viewing';

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
    fontWeight: '700',
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
  const [reports, setReports] = useState<IAlertReportData[]>([]);
  const [galleryVisible, setGalleryIsVisible] = useState({ index: 0, value: false });

  const setFilteredReports = async () => {
    const listeningLocations = await pb.collection('saved_locations').getFullList({
      filter: 'listening = true',
    });
    const reports = await getAllReports();

    setReports(
      reports.filter(report => {
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
          return true; // 100 meters radius
        });
      }),
    );
  };

  useEffect(() => {
    const interval = setInterval(setFilteredReports, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    pb.collection('users').authWithPassword('paoloose', 'patito123').then(setFilteredReports);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Alertas en tiempo real</Text>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}>
        {reports.map((report, i) => (
          <View key={report.id}>
            <ImageView
              images={report.media.map((file: string) => ({
                uri: pb.files.getUrl(report, file),
              }))}
              imageIndex={galleryVisible.index}
              visible={galleryVisible.value}
              onRequestClose={() => setGalleryIsVisible({ index: 0, value: false })}
            />
            <AlertItem report={report} setGalleryIsVisible={setGalleryIsVisible} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
