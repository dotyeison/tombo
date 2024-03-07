const token =
  'pk.eyJ1IjoiZG90eWVpc29uIiwiYSI6ImNsdGdsbWc0OTAxbXQyanAyaGFwY20xN2MifQ.zqaP-jWUgc1FYPfcHIjtVw';
const reverseGeocode = async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.features[0].place_name;
  } catch {
    return 'Unknown address';
  }
};

export default reverseGeocode;
