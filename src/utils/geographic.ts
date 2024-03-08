import distance from '@turf/distance';

export type Coordinate = {
  lat: number;
  lon: number;
};

export const distanceBetweenCoordinates = (from: Coordinate, to: Coordinate) =>
  distance([from.lon, from.lat], [to.lon, to.lat], {
    units: 'meters',
  });

export const formatDistanceAsText = (meters: number) => {
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
};
