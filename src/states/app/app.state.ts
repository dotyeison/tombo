import { useDispatch, useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Dispatch } from '@utils/store';
import { IUser, IAppState } from './app.state.types';

const initialState: IAppState = {
  isUserChecked: false,
  loggedIn: false,
  user: undefined,
  selectedLocation: undefined,
  currentLocation: { latitude: 0, longitude: 0 },
  eventTypes: {},
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
    setUser: (state: IAppState, { payload }: PayloadAction<IUser | undefined>) => {
      state.user = payload;
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
    setEventTypes: (state: IAppState, { payload }: PayloadAction<IAppState['eventTypes']>) => {
      state.eventTypes = payload;
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
