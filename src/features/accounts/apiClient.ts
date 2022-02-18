import { ExchangePayload, ExchangeResponse } from "./accountsSlice";
import { convert } from './../../app/helpers'
import * as RateApi from './../rates/ratesAPI'
import { Rates } from "../rates/ratesSlice";

// Fake call to API that usually handles amount change and return new amounts.
export async function mockExchangeApiCall(payload: ExchangePayload): Promise<ExchangeResponse> {
  const response = await RateApi.fetchRates();
  if (response === undefined) return {};
  const { GBP, EUR } = response.data;
  const rates: Rates = {
    USD: 1,
    EUR,
    GBP,
  }
  // This code is a dirty one, mocking API, just for the test.
  return new Promise((resolve) => {
    setTimeout(() => {
      const { from, to } = payload;
      const amount = parseFloat(from.amount);
      const result = {
        [from.currency]: 0 - amount,
        [to]: convert(parseFloat(from.amount), to, from.currency, rates),
      };
      resolve(result);
    }, 500)
  })
}