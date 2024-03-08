export interface IUser {
  username: string;
  password: string;
}

export interface IAppState {
  isUserChecked: boolean;
  loggedIn: boolean;
  user?: IUser;
  selectedLocation?: { latitude: number; longitude: number };
  currentLocation?: { latitude: number; longitude: number };
  foregroundLocation?: { latitude: number; longitude: number };
  eventTypes: Record<string, string>;
  deviceId?: string;
}
