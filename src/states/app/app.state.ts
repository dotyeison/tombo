import { useDispatch, useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Dispatch } from '@utils/store';
import { IUser, IAppState } from './app.state.types';
import { DataPersistKeys, useDataPersist } from '@hooks';

const initialState: IAppState = {
  isUserChecked: false,
  loggedIn: false,
  user: undefined,
  selectedLocation: undefined,
  foregroundLocation: undefined,
  currentLocation: { latitude: 0, longitude: 0 },
  eventTypes: {},
  deviceId: undefined,
};

// You can think of an 'slice' as a state and the set of actions that can update that state
const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoggedIn: (state: IAppState, { payload }: PayloadAction<boolean>) => {
      state.isUserChecked = true;
      state.loggedIn = payload;
    },
    setUser: (state: IAppState, { payload }: PayloadAction<IUser>) => {
      state.user = payload;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { setPersistData } = useDataPersist();
      setPersistData<IUser>(DataPersistKeys.USER, {
        username: payload?.username,
        password: payload?.password,
      }); //
    },
    setSelectedLocation: (
      state: IAppState,
      { payload }: PayloadAction<IAppState['selectedLocation']>,
    ) => {
      state.selectedLocation = payload;
    },
    setCurrentLocation: (
      state: IAppState,
      { payload }: PayloadAction<IAppState['currentLocation']>,
    ) => {
      state.currentLocation = payload;
    },
    setForegroundLocation: (
      state: IAppState,
      { payload }: PayloadAction<IAppState['foregroundLocation']>,
    ) => {
      state.foregroundLocation = payload;
    },
    setEventTypes: (state: IAppState, { payload }: PayloadAction<IAppState['eventTypes']>) => {
      state.eventTypes = payload;
    },
    setDeviceId: (state: IAppState, { payload }: PayloadAction<string | undefined>) => {
      state.deviceId = payload;
    },
    reset: () => initialState,
  },
});

export function useAppState() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ app }: State) => app);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
