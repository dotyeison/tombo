export interface IUser {
  name: string;
  email: string;
}

export interface IAppState {
  isUserChecked: boolean;
  loggedIn: boolean;
  user?: IUser;
}
