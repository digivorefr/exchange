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


const instance = axios.create({
  baseURL: 'https://freecurrencyapi.net/api/v2',
})

// Add API key to each requests.
instance.interceptors.request.use((request) => {
  request.params = {
    ...request.params,
    apikey: 'ad8255b0-8fd2-11ec-8d86-c516c5cdb260'
  };
  return request;
})

export const fetchRates = async () => {
  return new Promise<ApiResponse>((resolve) =>
    setTimeout(() => resolve({
      query: {
        base_currency: 'USD',
        timestamp: 1645091939,
      },
      data: {
        JPY: 115.04233,
        CNY: 6.33453,
        USD: 1,
        EUR: 2,
        GBP: 0.5,
      }
    }), 500)
  );


  // try {
  // const response = await instance.get('/latest')
  // return response.data as ApiResponse;
  // } catch (error: any) {
  //   if (error.response) {
  //     // Request made and server responded
  //     console.log(error.response.data);
  //     console.log(error.response.status);
  //     console.log(error.response.headers);
  //   } else if (error.request) {
  //     // The request was made but no response was received
  //     console.log(error.request);
  //   } else {
  //     // Something happened in setting up the request that triggered an Error
  //     console.log('Error', error.message);
  //   }
  // }

}