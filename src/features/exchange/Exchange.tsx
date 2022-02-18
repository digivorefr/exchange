import * as React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectAccounts } from '../accounts/accountsSlice';
import { Currency, selectCurrencies, selectRates } from '../rates/ratesSlice';
import ExchangeInput from './ExchangeInput';
import { computeAmountsFromChange, convert } from '../../app/helpers';
import { Amount } from './ExchangeInput';


export default function Exchange(): JSX.Element | null {

  const currencies = useAppSelector(selectCurrencies);
  const { rates, status: ratesStatus } = useAppSelector(selectRates);
  const { accounts, status: accountsStatus } = useAppSelector(selectAccounts)

  const [amounts, setAmounts] = React.useState<Amount[]>([{
    value: '0',
    currency: currencies[0],
    status: 'init',
  }, {
    value: '0',
    currency: currencies[1],
    status: 'init',
  }]);

  const [rate, setRate] = React.useState(0);

  const [disabled, setDisabled] = React.useState(true);

  // Compute a new rate when rates or amounts currencies are updated
  React.useEffect(() => {
    const newRate = convert(1, amounts[1].currency as Currency, amounts[0].currency as Currency, rates);
    setRate(newRate);
  }, [rates, amounts]);

  // Set disabled status
  React.useEffect(() => {
    if (ratesStatus !== 'loaded' || amounts[0].value === '0' || amounts[1].value === '0' || amounts[0].status !== '' || amounts[1].status !== '') {
      setDisabled(true);
    } else {
      setDisabled(false)
    }
  }, [ratesStatus, amounts]);

  // No render until accounts and rates are retrived.
  if (accountsStatus === 'init' || ratesStatus === 'init') {
    return null;
  }

  // When an amound is changed
  const onChangeAmount = (rawValue: string, amountIndex: number): void => {
    const newAmounts = computeAmountsFromChange(
      rawValue,
      amountIndex,
      amounts,
      accounts,
      rates
    );

    setAmounts(newAmounts)
  }

  // When a new currency is selected
  const onChangeCurrency = (e: React.FormEvent<HTMLSelectElement>, amountIndex: number): void => {
    const newCurrency = e.currentTarget.value as Currency;

    // Rebuild amounts object with newly selected currency
    const newAmounts = amounts.map((amount, index: number) => {
      let updatedCurrency = amount.currency as Currency;
      if (index === amountIndex) {
        updatedCurrency = newCurrency;
      } else if (amount.currency === newCurrency) {
        // Select another currency if both amounts have the same one
        updatedCurrency = currencies.filter(currency => currency !== newCurrency)[0]
      }
      return {
        ...amount,
        currency: updatedCurrency,
      } as Amount
    });

    // Recompute second amount with new settings
    const computedAmounts = computeAmountsFromChange(
      newAmounts[0].value,
      0,
      newAmounts,
      accounts,
      rates
    );

    setAmounts(computedAmounts);
  }

  // Reverse accounts order
  const onRevertClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newAmounts = [
      amounts[1],
      amounts[0],
    ];
    setAmounts(newAmounts);
  }

  // When an exchange is submitted
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('SUBMIT', amounts)
    if (!disabled) {
      console.log('Exchange agreed')
    }
  }


  return (
    <form className="Exchange" onSubmit={onSubmit}>
      <div className="Exchange__rate">
        {`1 ${amounts[0].currency} = ${rate.toFixed(6)} ${amounts[1].currency}`}
      </div>
      From<ExchangeInput
        amount={amounts[0]}
        onChangeAmount={(e: React.FormEvent<HTMLInputElement>) => onChangeAmount(e.currentTarget.value, 0)}
        onChangeCurrency={(e: React.FormEvent<HTMLSelectElement>) => onChangeCurrency(e, 0)}
      />
      <button type="button" onClick={onRevertClick}>Revert</button>
      To<ExchangeInput
        amount={amounts[1]}
        onChangeAmount={(e: React.FormEvent<HTMLInputElement>) => onChangeAmount(e.currentTarget.value, 1)}
        onChangeCurrency={(e: React.FormEvent<HTMLSelectElement>) => onChangeCurrency(e, 1)}
      />
      <button type="submit" disabled={disabled}>Exchange</button>
    </form>
  )
}