import ratesReducer, {
  selectBase,
  selectCurrencies,
  selectRates,
  initialState,
  refreshRates,
} from './../ratesSlice'
import { store } from './../../../app/store';
import * as api from './../ratesAPI';


describe('rates store', () => {

  const rootState = store.getState();

  it('should handle initial state', () => {
    expect(ratesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should return currency base', () => {
    expect(selectBase(rootState)).toBe(initialState.base);
  });

  it('should return rates', () => {
    expect(selectRates(rootState)).toEqual({ rates: initialState.rates, status: initialState.status });
  });

  it('should return available currencies', () => {
    expect(selectCurrencies(rootState)).toEqual(initialState.currencies);
  });

  it('update rates after fetch', async () => {
    jest.spyOn(api, 'fetchRates').mockResolvedValueOnce({
      query: {
        base_currency: 'USD',
        timestamp: 123456789,
      },
      data: {
        GBP: 5,
        EUR: 10,
      },
    })
    await store.dispatch(refreshRates());
    expect(selectRates(store.getState())).toEqual({ rates: { USD: 100000, GBP: 500000, EUR: 1000000 }, status: 'loaded' })
  })

  it('should set status to failed on api error', async () => {
    jest.spyOn(api, 'fetchRates').mockRejectedValueOnce({})
    await store.dispatch(refreshRates());
    expect(selectRates(store.getState()).status).toBe('failed');
  })

  it('should set status to failed on api error', async () => {
    jest.spyOn(api, 'fetchRates').mockRejectedValueOnce({})
    await store.dispatch(refreshRates());
    expect(selectRates(store.getState()).status).toBe('failed');
  })

  it('should set status to failed on api error', async () => {
    jest.spyOn(api, 'fetchRates').mockResolvedValueOnce(undefined)
    await store.dispatch(refreshRates());
    expect(selectRates(store.getState()).status).toBe('failed');
  })



})