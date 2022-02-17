import * as React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { Currency, currencyPropTypes, selectRates } from '../rates/ratesSlice';
import { useAppSelector } from '../../app/hooks';
import { selectCurrencies } from '../rates/ratesSlice';
import { selectAccounts } from '../accounts/accountsSlice';

const propTypes = {
  selectedCurrency: PropTypes.oneOf(currencyPropTypes).isRequired,
  amount: PropTypes.string.isRequired,
  onChangeAmount: PropTypes.func.isRequired,
  onChangeCurrency: PropTypes.func.isRequired,
}

export default function ExchangeInput(props: InferProps<typeof propTypes>): JSX.Element | null {
  const currencies = useAppSelector(selectCurrencies);
  const { rates, status: ratesStatus } = useAppSelector(selectRates)
  const { accounts, status: accountsStatus } = useAppSelector(selectAccounts);
  const { selectedCurrency, amount, onChangeAmount, onChangeCurrency } = props;

  if (accountsStatus !== 'loaded') return null;

  return (
    <div className={`Exchange__input${ratesStatus !== 'loaded' ? ' disabled' : ''}`}>
      <select onChange={onChangeCurrency} value={selectedCurrency}>
        {currencies.map((currency) => (
          <option key={currency} value={`${currency}`}>
            {currency}
          </option>
        ))}
      </select>

      <div>
        {`Balance: ${accounts[selectedCurrency as Currency]} ${selectedCurrency}`}
      </div>

      <input type="text" value={amount} onChange={onChangeAmount} />

      <div>
        {`USD:${selectedCurrency} : ${rates[selectedCurrency as Currency]}`}
      </div>
    </div>
  );
}

ExchangeInput.displayName = 'ExchangeInput';
ExchangeInput.propTypes = propTypes;