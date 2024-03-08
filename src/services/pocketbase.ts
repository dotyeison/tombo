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

export default {
  sendReport,
  getEventTypes,
};
