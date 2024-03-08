import { Text, View, ScrollView, Image, TouchableHighlight, StyleSheet } from 'react-native';
import { distanceBetweenCoordinates, formatDistanceAsText } from '@utils/geographic';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { getTimeAgo } from '@utils/time';
import { colors } from '@theme';
import { RecordModel } from 'pocketbase';
import { useAppState } from '@states/app/app.state';
import { pb } from 'src/services/pocketbase';
import { useState } from 'react';

const styles = StyleSheet.create({
  alertCard: {
    borderWidth: 1,
    backgroundColor: '#fafafc',
    borderColor: colors.black,
    borderRadius: 8,
    minWidth: '94%',
    width: '94%',
    maxWidth: '94%',
    marginBottom: 10,
    padding: 12,
  },
});

export interface IAlertReportData extends RecordModel {
  address_name: string;
  description: string;
  event_type: string;
  id: string;
  lat: number;
  lon: number;
  media: string[];
  created: string;
  updated: string;
  expand?: {
    [key: string]: any;
  };
}

export function AlertItem({
  report,
  setGalleryIsVisible,
}: {
  report: IAlertReportData;
  setGalleryIsVisible: (value: { index: number; value: boolean }) => void;
}) {
  const [reportData, _setReportData] = useState<IAlertReportData>(report);
  const { currentLocation } = useAppState();

  return (
    <View key={reportData.id} style={styles.alertCard}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <AntDesign name="clockcircleo" size={16} color="#ff5757" />
        <Text style={{ color: '#ff5757', fontSize: 13, fontWeight: '600', marginLeft: 5 }}>
          {getTimeAgo(reportData.created)}
        </Text>
      </View>
      <Text style={{ fontWeight: '800', marginTop: 3, marginBottom: 2, fontSize: 18 }}>
        {reportData.expand?.event_type.name}
      </Text>
      <Text style={{ marginBottom: 8 }}>{reportData.description.trim()}</Text>
      <TouchableHighlight
        underlayColor="#fff"
        onPress={() => {
          console.log(`navigating to ${reportData.lat}, ${reportData.lon}`);
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            backgroundColor: '#d7dde4',
            overflow: 'hidden',
            padding: 4,
            borderRadius: 5,
            marginBottom: 8,
          }}>
          <MaterialIcons
            name="location-pin"
            size={18}
            color={colors.gray}
            style={{ marginRight: 2 }}
          />
          <Text style={{ fontSize: 14 }}>
            {reportData.address_name}{' '}
            {currentLocation?.latitude !== 0 && (
              <Text style={{ fontWeight: '600' }}>
                (
                {formatDistanceAsText(
                  distanceBetweenCoordinates(
                    { lat: reportData.lat, lon: reportData.lon },
                    {
                      lat: currentLocation!.latitude,
                      lon: currentLocation!.longitude,
                    },
                  ),
                )}
                {' de ti)'}
              </Text>
            )}
          </Text>
        </View>
      </TouchableHighlight>
      {reportData.media.length !== 0 && (
        <ScrollView
          horizontal
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 6,
          }}>
          {reportData.media.map((file: string, index: number) => (
            <TouchableHighlight
              underlayColor="transparent"
              key={index}
              style={{
                height: 100,
                width: 150,
                borderRadius: 5,
                marginRight: 4,
              }}
              onPress={() =>
                setGalleryIsVisible({
                  index,
                  value: true,
                })
              }>
              <Image
                src={pb.files.getUrl(reportData, file)}
                // set fixed height and variable width
                style={{ flex: 1, resizeMode: 'cover' }}
              />
            </TouchableHighlight>
          ))}
        </ScrollView>
      )}
      {/* TODO: go to map here */}
    </View>
  );
}
