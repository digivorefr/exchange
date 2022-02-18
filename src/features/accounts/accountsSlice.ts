import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import PropTypes, { InferProps } from 'prop-types';
import { RootState } from '../../app/store';
import { Currency } from '../rates/ratesSlice';

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

export interface UpdateAccountPayload {
  account: Currency;
  amount: number;
}

// Mock for API retrieved data in real world
const initialState: AccountsState = {
  status: 'loaded',
  accounts: {
    USD: 4500.68,
    GBP: 3497.31,
    EUR: 14567891.96,
  }
}

export const exchange = createAsyncThunk(
  'accounts/exchange',
  async (conf: { from: { currency: Currency, amount: string }, to: Currency }): Promise<string> => {
    // call api qui valide les changement et qui renvoit de nouveaux montants, qui sont poussés au store
    return 'wesh';
  }
);

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    updateBalance: (state, action: PayloadAction<UpdateAccountPayload>) => {
      const { account, amount } = action.payload;
      state.accounts[account] = state.accounts[account] + amount;
    }
  }
})

export const { updateBalance } = accountsSlice.actions;


export const selectAccounts = (state: RootState) => ({
  accounts: state.accounts.accounts,
  status: state.accounts.status,
});


export default accountsSlice.reducer;
