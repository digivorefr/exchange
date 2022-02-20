import { Rates } from "../../features/rates/ratesSlice";
import { Amount } from "../../features/exchange/ExchangeInput";
import { Accounts } from "../../features/accounts/accountsSlice";
import { cleanAmount, computeAmountsFromChange } from "../helpers";

describe('Amount validation and formating', () => {

  it('replaces commas by dots', () => {
    expect(cleanAmount('1,2')).toBe('1.2')
  })

  it('removes all characters but digits & dots', () => {
    expect(cleanAmount('Az4@d4f8,*+76;')).toBe('448.76')
  })

  it('returns null when several dots are found', () => {
    expect(cleanAmount('2.0.0')).toBe(null)
  })

  it('returns only two decimal', () => {
    expect(cleanAmount('25.23654896')).toBe('25.23')
  })

  it('returns undefined when there is no value', () => {
    expect(cleanAmount('')).toBe(undefined)
  })

  it('preserve dot when ending the value', () => {
    expect(cleanAmount('14.')).toBe('14.')
  })

})


describe('Amounts object building', () => {
  const amounts: Amount[] = [
    {
      value: '30',
      currency: 'USD',
      status: '',
    },
    {
      value: '15',
      currency: 'GBP',
      status: '',
    }
  ];

  const accounts: Accounts = {
    USD: 100,
    EUR: 100,
    GBP: 100,
  };

  const rates: Rates = {
    USD: 1,
    GBP: 0.5,
    EUR: 2,
  };

  it('resets amounts when a wrong new amount is given', () => {
    const newAmounts = computeAmountsFromChange('', 0, amounts, accounts, rates)
    expect(newAmounts[0].value).toBe('0');
    expect(newAmounts[1].value).toBe('0');
  })

  it('doesnt update any values if the amount end by a .', () => {
    const newAmounts = computeAmountsFromChange('1.0.', 0, amounts, accounts, rates);
    expect(newAmounts).toEqual(amounts)
  })

  it('checks amount against account balance', () => {
    let newAmounts = computeAmountsFromChange('200', 0, amounts, accounts, rates);
    expect(newAmounts[0].status).toBe('exceeded')
    newAmounts = computeAmountsFromChange('100', 0, amounts, accounts, rates);
    expect(newAmounts[0].status).toBe('')
  })

  it('converts values from amount 0 to amount 1', () => {
    const newAmounts = computeAmountsFromChange('1', 0, amounts, accounts, rates);
    expect(newAmounts[1].value).toBe('0.5');
  })

  it('converts values from amount 1 to amount 2', () => {
    const newAmounts = computeAmountsFromChange('1', 1, amounts, accounts, rates);
    expect(newAmounts[0].value).toBe('2');
  })

})