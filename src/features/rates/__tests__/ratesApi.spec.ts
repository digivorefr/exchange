import axios from 'axios';
import { fetchRates } from './../ratesAPI';


describe('Rates API', () => {

  it('should return data on call', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { GBP: 2, EUR: 2 } })
    const response = await fetchRates();

    expect(response).toEqual({ GBP: 2, EUR: 2 })
  })

  it('should return undefined on error', async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce({})
    const response = await fetchRates();

    expect(response).toBe(undefined);
  })
})