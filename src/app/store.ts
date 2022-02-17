import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import ratesReducer from '../features/rates/ratesSlice';
import accountsReducer from '../features/accounts/accountsSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    rates: ratesReducer,
    accounts: accountsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
