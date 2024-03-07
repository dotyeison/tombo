import PocketBase from 'pocketbase';
const pb = new PocketBase('https://dotyeison.paoloose.site');

const create = async (collection: string, data: object) => {
  const res = await pb.collection(collection).create(data);
  return res;
};

export default {
  create,
};
