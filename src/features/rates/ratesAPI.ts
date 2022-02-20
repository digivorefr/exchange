import axios from 'axios';
import { Currency } from './ratesSlice';


interface ApiResponse {
  query: {
    base_currency: Currency;
    timestamp: number;
  },
  data: {
    [key: string]: number;
  };
}


// Add API key to each requests.
// On real project, there should be a proxy for hidding api key.
axios.interceptors.request.use((request) => {
  request.params = {
    ...request.params,
    apikey: 'ad8255b0-8fd2-11ec-8d86-c516c5cdb260'
  };
  return request;
})

export const fetchRates = async () => {
  // return new Promise<ApiResponse>((resolve) =>
  //   setTimeout(() => resolve({
  //     query: {
  //       base_currency: 'USD',
  //       timestamp: 1645091939,
  //     },
  //     data: {
  //       JPY: 115.04233,
  //       CNY: 6.33453,
  //       EUR: 2,
  //       GBP: 0.5,
  //     }
  //   }), 500)
  // );


  try {
    const response = await axios.get('https://freecurrencyapi.net/api/v2/latest')
    return response.data as ApiResponse;
  } catch {
    return undefined;
  }

}