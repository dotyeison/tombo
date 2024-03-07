export interface IUser {
  name: string;
  email: string;
}

export interface IAppState {
  isUserChecked: boolean;
  loggedIn: boolean;
  user?: IUser;
  selectedLocation?: { latitude: number; longitude: number };
  currentLocation?: { latitude: number; longitude: number };
  eventTypes: Record<string, string>;
  expoPushToken?: string;
}
