import { IAlertReportData } from '@views/Alerts/AlertItem';
import PocketBase from 'pocketbase';
import eventsource from 'react-native-sse';
// @ts-ignore
global.EventSource = eventsource;

export const pb = new PocketBase('https://dotyeison.paoloose.site');
pb.autoCancellation(false);

const sendReport = async (data: object) => {
  const res = await pb.collection('report').create(data);
  return res;
};

const getEventTypes = async () => {
  const res = await pb.collection('event_type').getList();
  return res;
};

export const getAllReports = async () => {
  const reports: IAlertReportData[] = await pb.collection('reports').getFullList({
    expand: 'event_type',
    sort: '-created',
  });
  return reports;
};

export const sendDevice = async (expoPushToken: string) => {
  const res = await pb.collection('devices').create({ expoPushToken });
  return res;
};

export const updateDeviceCoords = async (id: string, latitude: number, longitude: number) => {
  const res = await pb.collection('devices').update(id, { latitude, longitude });
  return res;
};

export const getDeviceByToken = async (expoPushToken: string) => {
  const res = await pb.collection('devices').getFirstListItem(`expoPushToken="${expoPushToken}"`);
  return res;
};

export const authAsAdmin = async () => {
  pb.admins.authWithPassword('backend@dotyeison.com', '92429d82a41e930486c6de5ebda9602d55c39986');
};

export default {
  sendReport,
  getEventTypes,
  sendDevice,
  updateDeviceCoords,
  getDeviceByToken,
  authAsAdmin,
};
