import { useDispatch, useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Dispatch } from '@utils/store';
import { IUser, IAppState } from './app.state.types';

const initialState: IAppState = {
  isUserChecked: false,
  loggedIn: false,
  user: undefined,
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
    reset: () => initialState,
  },
});

export function useAppState() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ app }: State) => app);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
