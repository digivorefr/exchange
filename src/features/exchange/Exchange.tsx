import * as React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectAccounts } from '../accounts/accountsSlice';
import { selectCurrencies, selectRates } from '../rates/ratesSlice';
import ExchangeInput from './ExchangeInput';

const cleanAmount = (amount: string): string | null | undefined => {
  // Allow only digits and dots
  const allowed = (amount
    .replace(/,/gi, '.')
    .match(/[\d.]/gi) || [])
    .join('');

  // Retrieve regexp matches, filter and transform them into a string
  const amountRegEx = /([\d]*)(\.*)?/g;
  const cleaned = Array.from(allowed.matchAll(amountRegEx), m => m)
    .map((match) => match.filter((group, index) => index > 0
      && ![undefined, ''].includes(group)
    ))
    .reduce((previous, current) => [...previous, ...current])
    .join('');

  // Empty or non comptable values handling
  if (cleaned === '' || isNaN(parseFloat(cleaned))) {
    return undefined;
  }

  // Prevent adding values with several dots
  if ((cleaned.match(/\./g) || []).length > 1) {
    return null;
  }

  const suffix = (cleaned[cleaned.length - 1] === '.') ? '.' : '';
  // Prevent more than 2 decimals
  const parsedAmount = Math.round(parseFloat(cleaned) * 100) / 100;

  return `${parsedAmount}${suffix}`;
}

export default function Exchange(): JSX.Element | null {

  const currencies = useAppSelector(selectCurrencies);
  const { rates, status: ratesStatus } = useAppSelector(selectRates);
  const { accounts, status: accountsStatus } = useAppSelector(selectAccounts)

  const [amounts, setAmounts] = React.useState(['0', '0']);

  if (accountsStatus === 'init' || ratesStatus === 'init') {
    return null;
  }

  const onChangeAmount = (e: React.FormEvent<HTMLInputElement>): void => {
    const cleanedAmount = cleanAmount(e.currentTarget.value);

    if (cleanedAmount === undefined) {
      setAmounts(['0', amounts[1]]);
      return;
    }

    if (cleanedAmount === null) {
      return;
    }

    setAmounts([
      cleanedAmount,
      amounts[1],
    ])
  }
  const onChangeCurrency = (e: React.FormEvent<HTMLInputElement>): void => {
    console.log('change currency', e.currentTarget.value);
  }

  return (
    <form className="Exchange">
      {/* <input type="number" value={amounts[0]} disabled={ratesStatus !== 'loaded'} />
      <input type="number" value={amounts[1]} disabled={ratesStatus !== 'loaded'} /> */}
      <ExchangeInput
        selectedCurrency='USD'
        amount={amounts[0]}
        onChangeAmount={onChangeAmount}
        onChangeCurrency={onChangeCurrency}
      />
      <ExchangeInput
        selectedCurrency='EUR'
        amount={amounts[1]}
        onChangeAmount={onChangeAmount}
        onChangeCurrency={onChangeCurrency}
      />
      <button type="submit" disabled={ratesStatus !== 'loaded'}>Exchange</button>
    </form>
  )
}