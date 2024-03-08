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

const subscribeToReports = () => {
  pb.collection('reports').subscribe(
    '*',
    function (e) {
      console.log(e.action);
      console.log(e.record);
    },
    {
      /* other options like expand, custom headers, etc. */
    },
  );
};

export default {
  sendReport,
  getEventTypes,
  subscribeToReports,
};
