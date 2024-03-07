export interface IUser {
  name: string;
  email: string;
}

export interface IAppState {
  isUserChecked: boolean;
  loggedIn: boolean;
  user?: IUser;
  selectedLocation?: { latitude: number; longitude: number; place_name: string };
  currentLocation?: { latitude: number; longitude: number; place_name: string };
}
