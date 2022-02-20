import { Currency, Rates } from "../features/rates/ratesSlice";
import { Amount } from "../features/exchange/ExchangeInput";
import { Accounts } from "../features/accounts/accountsSlice";

/**
 * Validate and format a value into an amount
 * @param {string} value value to validate
 * @returns {string | null | undefined} formated amount if computed. null if several dots. undefined if 0 or NaN
 */
export const cleanAmount = (value: string): string | null | undefined => {
  // Allow only digits and dots
  const allowed = (value
    .replace(/,/gi, '.')
    .match(/[\d.]/gi) || [])
    .join('');

  const splited = allowed.split('.');

  // Prevent adding several dots
  if (splited.length > 2) {
    return null;
  }

  // Remove more than 2 decimals
  const cleaned = splited
    .map((item, index) => (index > 0)
      ? item.substring(0, 2)
      : item)
    .join('.');

  // Empty or non-computable values handling
  if (cleaned === '' || isNaN(parseFloat(cleaned))) {
    return undefined;
  }

  // If the string is finishing with a dot, it must be remembered
  const suffix = (allowed[allowed.length - 1] === '.') ? '.' : '';

  // Parsing to float remove useless characters ( 0 as first character or . as last one)
  const amount = parseFloat(cleaned);

  return `${amount}${suffix}`;
}




/**
 * Convert an amount from one currency to another, following rates
 * @param {number} amount value to convert
 * @param {Currency} from value's currenvy
 * @param {Currency} to currency to convert to
 * @param {Rates} rates currencies rates
 * @returns
 */
export const convert = (amount: number, from: Currency, to: Currency, rates: Rates): number => {
  return Math.round((amount * 1000000 / rates[to]) * rates[from]) / 1000000;
}



/**
 * Entrypoint for amounts updates. Filter, validate, format and convert amounts
 * @param {string} updatedAmount the amount value who changed
 * @param {number} amountIndex the amount array index the onChange comes from
 * @param {Amount[]} amounts Amounts
 * @param {Accounts} accounts Accounts
 * @param {Rates} rates Rates
 * @returns {Amount[]} Updated amounts object
 */
export const computeAmountsFromChange = (updatedAmount: string, amountIndex: number, amounts: Amount[], accounts: Accounts, rates: Rates): Amount[] => {
  const cleanedAmount = cleanAmount(updatedAmount);

  // Amount is not valid. Reset amounts to 0.
  if (cleanedAmount === undefined) {
    return [{ ...amounts[0], value: '0' }, { ...amounts[1], value: '0' }];
  }

  // There's nothing to update
  if (cleanedAmount === null) {
    return amounts;
  }

  // Build new amounts object with new parameters
  const newAmounts = amounts.map((amount, index) => {
    // Set new value to proper amount.
    if (index === amountIndex) return {
      ...amount,
      value: cleanedAmount,
      // Evaluate status
      status: (index === 0 && parseFloat(cleanedAmount) > accounts[amount.currency as Currency]) ? 'exceeded' : ''
    } as Amount;

    // Compute conversion value for other amount
    const toIndex = (index === 0) ? 1 : 0;
    const newAmount = convert(parseFloat(cleanedAmount), amount.currency as Currency, amounts[toIndex].currency as Currency, rates)
    // Build amount object
    return {
      ...amount,
      // Remove unwanted decimals
      value: `${Math.round(newAmount * 100) / 100}`,
      status: (index === 0 && newAmount > accounts[amount.currency as Currency]) ? 'exceeded' : ''
    } as Amount;
  });

  return newAmounts;

}
