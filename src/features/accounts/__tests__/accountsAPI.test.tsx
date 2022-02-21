import { mockExchangeApiCall } from "../accountsAPI";
import * as rateAPI from '../../rates/ratesAPI';
import { Currency } from "../../rates/ratesSlice";


describe('mocked accounts api', () => {

  const rateApi = jest.spyOn(rateAPI, 'fetchRates');

  it('should return new amounts', async () => {
    rateApi.mockResolvedValueOnce({
      query: {
        base_currency: 'USD',
        timestamp: 123,
      },
      data: {
        EUR: 2,
        GBP: 2,
      }
    })
    const exchange = await mockExchangeApiCall({
      from: { currency: 'USD' as Currency, amount: '10' },
      to: 'GBP' as Currency
    })
    expect(rateApi).toHaveBeenCalled();
    expect(exchange).toEqual({ USD: -10, GBP: 20 })
  });

  it('should return an error on rejection', async () => {
    rateApi.mockRejectedValueOnce(undefined);
    try {
      await mockExchangeApiCall({
        from: { currency: 'USD' as Currency, amount: '10' },
        to: 'GBP' as Currency
      })
    } catch (e) {
      expect(e).toBe(undefined);
    } finally {
      expect(mockExchangeApiCall).rejects.toEqual('No rates available')
    }
  })

})