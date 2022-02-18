import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchRates } from './ratesAPI';

export const currencyPropTypes = ['USD', 'GBP', 'EUR'];
export type Currency = 'USD' | 'GBP' | 'EUR';


export interface Rates {
  USD: number,
  GBP: number,
  EUR: number,
}

export interface RatesState {
  base: Currency;
  currencies: Currency[];
  rates: Rates;
  status: 'init' | 'loading' | 'loaded' | 'failed';
}

export interface ConvertCurrencyPayload {
  amount: number;
  from: Currency;
  to: Currency,
}


const initialState: RatesState = {
  base: 'USD',
  currencies: ['USD', 'GBP', 'EUR'],
  rates: {
    USD: 100000,
    GBP: 100000,
    EUR: 100000,
  },
  status: 'init'
}


export const refreshRates = createAsyncThunk(
  'rates/refresh',
  async () => {
    const response = await fetchRates();
    if (response === undefined) return null;
    // The value we return becomes the `fulfilled` action payload
    const { GBP, EUR } = response.data;
    // Remove unwanted currencies, and avoid any float number to prevent wrong calculations
    return {
      USD: 1 * 100000,
      GBP: GBP * 100000,
      EUR: EUR * 100000,
    };
  }
);


export const ratesSlice = createSlice({
  name: 'rates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(refreshRates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(refreshRates.fulfilled, (state, action) => {
        if (action.payload === null) {
          state.status = 'failed';
        } else {
          state.status = 'loaded';
          state.rates = action.payload;
        }
      });
  },
})

export const selectRates = (state: RootState) => ({ rates: state.rates.rates, status: state.rates.status });
export const selectBase = (state: RootState) => state.rates.base;
export const selectCurrencies = (state: RootState) => state.rates.currencies;

export default ratesSlice.reducer;