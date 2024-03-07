import PocketBase from 'pocketbase';
const pb = new PocketBase('https://dotyeison.paoloose.site');

const sendReport = async (data: object) => {
  const res = await pb.collection('report').create(data);
  return res;
};

const getEventTypes = async () => {
  const res = await pb.collection('event_type').getList();
  return res;
};

export default {
  sendReport,
  getEventTypes,
};
