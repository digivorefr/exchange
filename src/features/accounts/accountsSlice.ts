import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import PropTypes, { InferProps } from 'prop-types';
import { RootState } from '../../app/store';
import { Currency } from '../rates/ratesSlice';
import * as api from './apiClient';

export const accountsPropTypes = {
  USD: PropTypes.number.isRequired,
  GBP: PropTypes.number.isRequired,
  EUR: PropTypes.number.isRequired,
}

export type Accounts = InferProps<typeof accountsPropTypes>

export interface AccountsState {
  accounts: Accounts;
  status: 'init' | 'loading' | 'loaded' | 'failed';
}

export interface ExchangePayload {
  from: {
    currency: Currency;
    amount: string;
  },
  to: Currency;
}

export interface ExchangeResponse {
  [key: string]: number;
}

export interface UpdateAccountPayload {
  account: Currency;
  amount: number;
}

// Mock for API retrieved data in real world
const initialState: AccountsState = {
  status: 'loaded',
  accounts: {
    USD: 45.68,
    GBP: 347.31,
    EUR: 145.96,
  }
}

export const exchange = createAsyncThunk(
  'accounts/exchange',
  async (payload: ExchangePayload): Promise<ExchangeResponse> => api.mockExchangeApiCall(payload)
);

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    updateBalance: (state, action: PayloadAction<UpdateAccountPayload>) => {
      const { account, amount } = action.payload;
      state.accounts[account] = state.accounts[account] + amount;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(exchange.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(exchange.fulfilled, (state, action) => {
        Object.entries(action.payload).forEach(([key, value]) => {
          const newBalance = Math.round((state.accounts[key as Currency] * 100) + (value * 100)) / 100
          state.accounts[key as Currency] = newBalance;
        })
        state.status = 'loaded'
      })
  }
})

export const { updateBalance } = accountsSlice.actions;


export const selectAccounts = (state: RootState) => ({
  accounts: state.accounts.accounts,
  status: state.accounts.status,
});


export default accountsSlice.reducer;
