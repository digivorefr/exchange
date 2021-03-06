import * as React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { Currency, currencyPropTypes } from '../rates/ratesSlice';
import { useAppSelector } from '../../app/hooks';
import { selectCurrencies } from '../rates/ratesSlice';
import { selectAccounts } from '../accounts/accountsSlice';

export const amountPropTypes = {
  value: PropTypes.string.isRequired,
  currency: PropTypes.oneOf(currencyPropTypes).isRequired,
  status: PropTypes.oneOf(['init', '', 'exceeded']),
}

export type Amount = InferProps<typeof amountPropTypes>;

const propTypes = {
  id: PropTypes.string.isRequired,
  amount: PropTypes.shape(amountPropTypes).isRequired,
  onChangeAmount: PropTypes.func.isRequired,
  onChangeCurrency: PropTypes.func.isRequired,
}

export default function ExchangeInput(props: InferProps<typeof propTypes>): JSX.Element | null {
  const currencies = useAppSelector(selectCurrencies);
  const { accounts, status: accountsStatus } = useAppSelector(selectAccounts);
  const { id, amount, onChangeAmount, onChangeCurrency } = props;

  if (accountsStatus !== 'loaded') return null;

  const className = `Exchange__input${amount.status === 'exceeded'
    ? ` exceeded`
    : ''
    }`

  return (
    <label className={className} id={`Exchange__input--${id}`} htmlFor={`amount-${id}-input`}>
      <div>{id}</div>
      <div className="wrapper">
        <select className="select" onChange={onChangeCurrency} value={amount.currency}>
          {currencies.map((currency) => (
            <option key={currency} value={`${currency}`}>
              {currency}
            </option>
          ))}
        </select>
        <input
          id={`amount-${id}-input`}
          className="amount"
          type="text"
          value={amount.value === '0' ? '' : amount.value}
          placeholder="0"
          onChange={onChangeAmount}
          pattern="\d*"
          inputMode="decimal" />
      </div>
      <div className="balance">
        {`Balance: ${amount.currency} ${accounts[amount.currency as Currency]}`}
      </div>
    </label >
  );
}

ExchangeInput.displayName = 'ExchangeInput';
ExchangeInput.propTypes = propTypes;