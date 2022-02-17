import * as React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectAccounts } from '../accounts/accountsSlice';
import { selectCurrencies, selectRates } from '../rates/ratesSlice';
import ExchangeInput from './ExchangeInput';


export default function Exchange(): JSX.Element | null {

  const currencies = useAppSelector(selectCurrencies);
  const { rates, status: ratesStatus } = useAppSelector(selectRates);
  const { accounts, status: accountsStatus } = useAppSelector(selectAccounts)

  const [amounts, setAmounts] = React.useState(['0', '0']);

  if (accountsStatus === 'init' || ratesStatus === 'init') {
    return null;
  }

  const onChangeAmount = (e: React.FormEvent<HTMLInputElement>): void => {
    const cleanedAmount = ((e.currentTarget.value
      .match(/[\d.]/gi) || [])
      .join('')
      .match(/^(\d*)(\.)?(\d{2})?/) || [])
      .join('');

    if (cleanedAmount === undefined) {
      setAmounts(['0', amounts[1]]);
      return;
    }
    const amount = parseFloat(cleanedAmount);

    if (isNaN(amount)) {
      setAmounts(['0', amounts[1]]);
      return;
    }

    const endsWithDecimalSeparator = cleanedAmount.match(/[.]$/);

    console.log('change amount', e.currentTarget.value, cleanedAmount, amount);
    setAmounts([
      (endsWithDecimalSeparator
        ? `${cleanedAmount}.`
        : cleanedAmount),
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