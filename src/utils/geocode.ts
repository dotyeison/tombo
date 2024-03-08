interface Coordinates {
  latitude: number;
  longitude: number;
}

export async function getCoordinatesFromLocation(location: string): Promise<Coordinates | null> {
  const accessToken =
    'pk.eyJ1IjoiZG90eWVpc29uIiwiYSI6ImNsdGdsbWc0OTAxbXQyanAyaGFwY20xN2MifQ.zqaP-jWUgc1FYPfcHIjtVw';
  const encodedLocation = encodeURIComponent(location);
  const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedLocation}.json?access_token=${accessToken}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Data:', data); // Log the received data

    if (data.features && data.features.length > 0) {
      const result = data.features[0];
      const lat = result.center[0];
      const lon = result.center[0];
      return { latitude: lat, longitude: lon };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
}
