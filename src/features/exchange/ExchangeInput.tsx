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
  amount: PropTypes.shape(amountPropTypes).isRequired,
  onChangeAmount: PropTypes.func.isRequired,
  onChangeCurrency: PropTypes.func.isRequired,
}

export default function ExchangeInput(props: InferProps<typeof propTypes>): JSX.Element | null {
  const currencies = useAppSelector(selectCurrencies);
  const { accounts, status: accountsStatus } = useAppSelector(selectAccounts);
  const { amount, onChangeAmount, onChangeCurrency } = props;

  // if (accountsStatus !== 'loaded') return null;

  const className = `Exchange__input${amount.status === 'exceeded'
    ? ` exceeded`
    : ''
    }`

  return (
    <div className={className}>
      <div className="wrapper">
        <select className="select" onChange={onChangeCurrency} value={amount.currency}>
          {currencies.map((currency) => (
            <option key={currency} value={`${currency}`}>
              {currency}
            </option>
          ))}
        </select>
        <input className="amount" type="text" value={amount.value === '0' ? '' : amount.value} placeholder="0" onChange={onChangeAmount} />
      </div>
      <div className="balance">
        {`Balance: ${amount.currency} ${accounts[amount.currency as Currency]}`}
      </div>
    </div >
  );
}

ExchangeInput.displayName = 'ExchangeInput';
ExchangeInput.propTypes = propTypes;