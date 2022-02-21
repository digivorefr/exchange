import accountsReducer, {
  exchange,
  initialState,
  selectAccounts,
} from '../accountsSlice';
import { store } from './../../../app/store';
import * as api from '../accountsAPI';
import { Currency } from '../../rates/ratesSlice';


describe('accounts store', () => {
  const rootState = store.getState();

  it('should handle initial state', () => {
    expect(accountsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should return accounts', () => {
    expect(selectAccounts(rootState)).toEqual({
      accounts: initialState.accounts,
      status: initialState.status,
    });
  });

  it('should exchange between two currencies', async () => {
    const request = jest.spyOn(api, 'mockExchangeApiCall').mockResolvedValueOnce({
      USD: -20,
      GBP: 10,
    });
    await store.dispatch(exchange(
      {
        from: { currency: 'USD' as Currency, amount: '20' },
        to: 'GBP' as Currency
      }
    ));
    expect(request).toHaveBeenCalled();
    expect(selectAccounts(store.getState()).accounts.USD).toBe(initialState.accounts.USD - 20);
    expect(selectAccounts(store.getState()).accounts.GBP).toBe(initialState.accounts.GBP + 10);
  })

  it('should set status to loading on promise execution', async () => {
    jest.spyOn(api, 'mockExchangeApiCall').mockImplementationOnce(() => new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          USD: 0,
          GBP: 0,
        })
      }, 50)
    }))
    store.dispatch(exchange(
      {
        from: { currency: 'USD' as Currency, amount: '0' },
        to: 'GBP' as Currency
      }
    ));
    expect(selectAccounts(store.getState()).status).toBe('loading');
  })


  it('should set status to failed on promise rejection', async () => {
    jest.spyOn(api, 'mockExchangeApiCall').mockImplementationOnce(() => new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('error');
      }, 50)
    }))
    await store.dispatch(exchange(
      {
        from: { currency: 'USD' as Currency, amount: '0' },
        to: 'GBP' as Currency
      }
    ));
    expect(selectAccounts(store.getState()).status).toBe('failed');
  })
})